/**
 * Domaris · Lead magnet « Méthode »
 * Reçoit les inscriptions du site et les ajoute dans l'onglet "Leads" du Google Sheet.
 *
 * Installation : voir README.md (Extensions > Apps Script > coller ce code > Déployer > Application Web).
 */

const SHEET_NAME = 'Leads';
const HEADERS = ['Date', 'Prénom', 'Nom', 'Téléphone', 'Consentement rappel', 'Source', 'Page', 'Navigateur', 'Statut'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};
    const sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      clean_(p.prenom),
      clean_(p.nom),
      "'" + clean_(p.telephone), // l'apostrophe garde le 0 initial
      clean_(p.consentement),
      clean_(p.source),
      clean_(p.page),
      clean_(p.userAgent),
      'À rappeler'
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput('OK - endpoint Domaris actif');
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#3651BD').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Neutralise les formules injectées (=, +, -, @) et limite la longueur.
function clean_(v) {
  v = String(v || '').trim().slice(0, 300);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

// À lancer une fois à la main pour tester : ajoute une ligne de test.
function testInsert() {
  doPost({ parameter: { prenom: 'Test', nom: 'Domaris', telephone: '0600000000', consentement: 'oui', source: 'test', page: 'manuel', userAgent: '-' } });
}
