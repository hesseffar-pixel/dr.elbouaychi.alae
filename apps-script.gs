// ═══════════════════════════════════════════════════════════════════
//  Dr. El Bouaychi Alae — Google Apps Script
//  Connecte le formulaire de feedback à Google Sheets
// ═══════════════════════════════════════════════════════════════════
//
//  INSTALLATION :
//  1. Ouvrez Google Sheets → Extensions → Apps Script
//  2. Collez tout ce code, sauvegardez
//  3. Déployer → Nouveau déploiement → Web app
//     - Exécuter en tant que : Moi
//     - Accès : Tout le monde
//  4. Copiez l'URL et collez-la dans feedback.html (APPS_SCRIPT_URL)
// ═══════════════════════════════════════════════════════════════════

const SHEET_NAME = "Feedbacks Patients";

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        "📅 Date",
        "❓ Ce qui n'a pas répondu aux attentes",
        "🤝 Qualité de l'accueil",
        "🔁 Recommanderait le cabinet ?",
        "💬 Commentaire libre"
      ]);

      const headerRange = sheet.getRange(1, 1, 1, 5);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#e6f5f4");
      headerRange.setFontColor("#1a3a4a");
      sheet.setFrozenRows(1);
      sheet.setColumnWidth(1, 165);
      sheet.setColumnWidth(2, 270);
      sheet.setColumnWidth(3, 220);
      sheet.setColumnWidth(4, 230);
      sheet.setColumnWidth(5, 310);
    }

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.date  || new Date().toLocaleString('fr-FR'),
      data.q1    || "—",
      data.q2    || "—",
      data.q3    || "—",
      data.q4    || "—"
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function testDoPost() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        date: "06/05/2026 10:30",
        q1: "Temps d'attente trop long",
        q2: "Correct",
        q3: "Peut-être, avec réserves",
        q4: "L'attente était longue mais la consultation était bonne."
      })
    }
  };
  doPost(fakeEvent);
  Logger.log("Test OK — vérifiez l'onglet 'Feedbacks Patients' !");
}
