// Dán toàn bộ file này vào Google Apps Script (Extensions > Apps Script) của Google Sheet.
// KHÔNG đưa file này lên GitHub công khai vì có chứa mật khẩu giáo viên.
const TEACHER_PASSWORD = "FPT123";
const TEACHER_EMAIL = "doanphuongthao29102002@gmail.com"; // email nhận thông báo
const NOTIFY = "each"; // "each" = mỗi bài nộp 1 email | "daily" = 1 email tổng hợp mỗi ngày | "off" = không gửi
const TZ = "Asia/Ho_Chi_Minh";
const SHEET_NAME = "Bài nộp";
const HEAD = ["Thời gian", "Họ và tên", "Lớp", "Số ý đúng", "Điểm /10"];

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    return d.action === "list" ? listRows(d) : saveRow(d);
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

function sheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

function saveRow(d) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = sheet();
    if (sh.getLastRow() === 0) {
      sh.appendRow(HEAD.concat(d.labels));
      sh.setFrozenRows(1);
    }
    const clip = s => String(s == null ? "" : s).slice(0, 600);
    sh.appendRow([new Date(), clip(d.name), clip(d.cls), d.got + "/" + d.total, d.score10].concat(d.answers.map(clip)));
    if (NOTIFY === "each") notifyOne(d);
    return out({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// Email 1 bài nộp: chỉ gồm tên, lớp, số câu đã làm
function notifyOne(d) {
  try {
    const done = Number(d.done) || 0, count = Number(d.count) || 0;
    MailApp.sendEmail(TEACHER_EMAIL,
      "[Bài nộp] " + String(d.name).slice(0, 60) + " - lớp " + String(d.cls).slice(0, 20),
      "Họ và tên: " + d.name + "\nLớp: " + d.cls + "\nĐã làm: " + done + "/" + count + " câu\nGiờ nộp: " +
      Utilities.formatDate(new Date(), TZ, "dd/MM/yyyy HH:mm"));
  } catch (err) { /* lỗi gửi mail không làm hỏng việc lưu bài */ }
}

// Email tổng hợp trong ngày (chỉ chạy khi NOTIFY = "daily", sau khi chạy installDailyTrigger một lần)
function sendDailyReport() {
  const sh = sheet();
  if (sh.getLastRow() < 2) return;
  const today = Utilities.formatDate(new Date(), TZ, "yyyy-MM-dd");
  const latest = {};
  sh.getDataRange().getValues().slice(1).forEach(r => {
    if (!(r[0] instanceof Date) || Utilities.formatDate(r[0], TZ, "yyyy-MM-dd") !== today) return;
    const done = r.slice(5).filter(x => String(x) !== "").length;
    latest[r[2] + "|" + r[1]] = { name: r[1], cls: r[2], done: done, count: r.length - 5 };
  });
  const list = Object.values(latest).sort((a, b) => String(a.cls).localeCompare(String(b.cls)) || String(a.name).localeCompare(String(b.name)));
  const body = list.length
    ? "Hôm nay có " + list.length + " học sinh nộp bài:\n\n" + list.map(x => x.cls + " | " + x.name + " | " + x.done + "/" + x.count + " câu").join("\n")
    : "Hôm nay chưa có học sinh nào nộp bài.";
  MailApp.sendEmail(TEACHER_EMAIL, "[Thống kê bài nộp] " + Utilities.formatDate(new Date(), TZ, "dd/MM/yyyy"), body);
}

// Chạy hàm này MỘT lần (nút Chạy trong Apps Script) để bật email tổng hợp lúc 18h hằng ngày
function installDailyTrigger() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === "sendDailyReport").forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("sendDailyReport").timeBased().everyDays(1).atHour(18).inTimezone(TZ).create();
}

function listRows(d) {
  if (d.password !== TEACHER_PASSWORD) {
    Utilities.sleep(1500);
    return out({ ok: false, error: "Sai mật khẩu" });
  }
  const sh = sheet();
  if (sh.getLastRow() === 0) return out({ ok: true, rows: [] });
  const v = sh.getDataRange().getValues();
  const rows = [v[0]].concat(v.slice(1).slice(-500)).map((r, i) => r.map((c, j) =>
    (i > 0 && j === 0 && c instanceof Date) ? Utilities.formatDate(c, "Asia/Ho_Chi_Minh", "dd/MM HH:mm") : c));
  return out({ ok: true, rows: rows });
}

function doGet() { return out({ ok: true, message: "Web App đang chạy" }); }

function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
