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
      "'" + String(p.telephone || '').replace(/[^\d+]/g, '').slice(0, 20), // l'apostrophe garde le 0 initial
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

// Optionnel : coller ici l'URL de votre Google Sheet. Laisser vide pour qu'un Sheet
// « Leads · Méthode Domaris » soit créé automatiquement dans votre Google Drive.
const SHEET_URL = '';

function getSpreadsheet_() {
  if (SHEET_URL) return SpreadsheetApp.openByUrl(SHEET_URL);
  const active = SpreadsheetApp.getActiveSpreadsheet(); // script créé depuis le Sheet
  if (active) return active;
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('SHEET_ID');
  if (id) return SpreadsheetApp.openById(id);
  const ss = SpreadsheetApp.create('Leads · Méthode Domaris');
  props.setProperty('SHEET_ID', ss.getId());
  return ss;
}

function getSheet_() {
  const ss = getSpreadsheet_();
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

// À lancer une fois à la main : ajoute une ligne de test et affiche l'URL du Sheet dans le journal.
function testInsert() {
  doPost({ parameter: { prenom: 'Test', nom: 'Domaris', telephone: '0600000000', consentement: 'oui', source: 'test', page: 'manuel', userAgent: '-' } });
  Logger.log('Sheet des leads : ' + getSpreadsheet_().getUrl());
}
