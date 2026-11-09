// Dán toàn bộ file này vào Google Apps Script (Extensions > Apps Script) của Google Sheet.
// KHÔNG đưa file này lên GitHub công khai vì có chứa mật khẩu giáo viên.
const TEACHER_PASSWORD = "FPT123";
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
    return out({ ok: true });
  } finally {
    lock.releaseLock();
  }
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
