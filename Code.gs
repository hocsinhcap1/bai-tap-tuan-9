// Dán toàn bộ file này vào Google Apps Script (Extensions > Apps Script) của Google Sheet.
const SHEET_NAME = "Bài nộp";

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const d = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow(["Thời gian", "Họ và tên", "Lớp", "Điểm tự chấm"].concat(d.labels));
      sh.setFrozenRows(1);
    }
    const clip = s => String(s == null ? "" : s).slice(0, 600);
    sh.appendRow([new Date(), clip(d.name), clip(d.cls), d.got + "/" + d.total].concat(d.answers.map(clip)));
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return out({ ok: true, message: "Web App đang chạy" }); }

function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
