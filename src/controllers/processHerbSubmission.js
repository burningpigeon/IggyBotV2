const { google } = require('googleapis');
const path = require('path');
console.log("processHerbSubmission.js loaded");
const { getFormattedTimestamp} = require('../utils');

const TC_HERB_BACKEND = "1add3qNqzltBlM0PXLr6V9dOwIDX8uKH_q_sKCs9R8Bk"
const SC_HERB_BACKEND = ""
const RC_HERB_BACKEND = ""
const WC_HERB_BACKEND = ""
const KEYFILEPATH = path.join(__dirname, '../../data/extreme-ratio-443023-e1-57fff1ff9ae4.json')

async function herbSubmission(timestampIn, nameIn, clanIn, herbIn, amountIn){
    // all discord.js error handling is handled in herbSubmissionModal.js
    try{
        const auth = new google.auth.GoogleAuth({
            keyFile: KEYFILEPATH,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({
            version: 'v4',
            auth,
        });

        if (clanIn === "thunderclan"){
            console.log("HIII X2");
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
    console.log("HII x3")
    await sheetsIn.spreadsheets.values.append({
        spreadsheetId: clanHerbBackend,
        range: 'Backend!A:E', // format: SheetName!StartColumn:EndColumn
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
            values: [[timestampIn, nameIn, 'Adding', herbIn, amountIn]],
        },
    });
    console.log("HETYYY ")
}

//timestamp = getFormattedTimestamp();
//catName = "Lunarlynx";
//herb = "Willow Bark";
//amount = 1;
//clan = "thunderclan"
//console.log(timestamp)
//herbSubmission(timestamp, catName, clan, herb, amount );

module.exports = { herbSubmission };