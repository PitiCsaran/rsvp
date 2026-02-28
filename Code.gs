/**
 * Wedding RSVP — Google Apps Script
 *
 * SETUP INSTRUCTIONS
 * ──────────────────
 * 1. Open your Google Sheet (or create a new one).
 * 2. Click Extensions → Apps Script.
 * 3. Delete any existing code, then paste the entire contents of this file.
 * 4. Click Save (Ctrl+S), then Deploy → New deployment.
 * 5. Choose type: Web app.
 *    - Description: Wedding RSVP
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Click Deploy → Authorize access → Allow.
 * 7. Copy the Web app URL that appears.
 * 8. In index.html, replace 'YOUR_APPS_SCRIPT_URL_HERE' with that URL.
 */

const SHEET_NAME = 'RSVPs'; // Change if you want a specific sheet tab name

function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    const data  = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(data.submittedAt) || new Date(),  // Timestamp
      data.name        || '',                     // Full Name
      data.email       || '',                     // Email
      data.attending   || '',                     // Attending (yes / no)
      data.attending === 'yes' ? (data.guests || 1) : '', // Guest Count
      (data.meals || []).join(', '),              // Meal Preferences
      data.dietary     || '',                     // Dietary Restrictions
      data.message     || '',                     // Message
    ]);

    return jsonResponse({ status: 'success' });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.message });
  }
}

/** Returns the RSVP sheet, creating it with a header row if it doesn't exist. */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Timestamp',
      'Full Name',
      'Email',
      'Attending',
      'Guest Count',
      'Meal Preferences',
      'Dietary Restrictions',
      'Message',
    ]);
    // Style the header row
    const header = sheet.getRange(1, 1, 1, 8);
    header.setFontWeight('bold');
    header.setBackground('#f5e6d3');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/** Helper to return a JSON ContentService response. */
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
