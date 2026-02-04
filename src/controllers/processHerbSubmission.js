const { google } = require('googleapis');
const path = require('path');
console.log("processHerbSubmission.js loaded");

const TC_HERB_BACKEND = ""
const SC_HERB_BACKEND = ""
const RC_HERB_BACKEND = ""
const WC_HERB_BACKEND = ""
const KEYFILEPATH = path.join(__dirname, 'extreme-ratio-443023-e1-57fff1ff9ae4.json')

async function herbSubmission(timestampIn, nameIn, clanIn, herbIn, amountIn){
    // all discord.js error handling is handled in herbSubmissionModal.js
    try{
        const auth = new google.auth.GoogleAuth({
            keyfile: KEYFILEPATH,
            scopes: ['https//www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({
            version: 'v4',
            auth,
        });

        if (clanIn === "thunderclan"){
            processHerbSubmission(sheets, TC_HERB_BACKEND, timestampIn, nameIn, herbIn, amountIn)
        }
        else if (clanIn === "shadowclan"){
            processHerbSubmission(sheets, SC_HERB_BACKEND, timestampIn, nameIn, herbIn, amountIn)
        }
        else if (clanIn === "riverclan"){
            processHerbSubmission(sheets, RC_HERB_BACKEND, timestampIn, nameIn, herbIn, amountIn)
        }
        else if (clanIn === "windclan"){
            processHerbSubmission(sheets, WC_HERB_BACKEND, timestampIn, nameIn, herbIn, amountIn)
        }
    }
    catch(error){
        console.log('Append failed', error)
    }
}

async function processHerbSubmission(sheetsIn, clanHerbBackend, timestampIn, nameIn, herbIn, amountIn){
    await sheetsIn.spreadsheets.values.append({
        spreadsheetId: clanHerbBackend,
        range: '', // format: SheetName!StartColumn:EndColumn
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
            values: [[timestampIn, nameIn, 'Adding', herbIn, amountIn]],
        },
    });
}

module.exports = { herbSubmission };