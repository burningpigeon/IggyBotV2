const { google } = require('googleapis');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
console.log("processHerbSubmission.js loaded");
const { isValidInt, getFormattedTimestamp} = require('../utils');

const { TC_HERB_BACKEND, SC_HERB_BACKEND, RC_HERB_BACKEND, WC_HERB_BACKEND } = process.env;
const KEYFILEPATH = path.join(__dirname, '../../data/extreme-ratio-443023-e1-57fff1ff9ae4.json')

async function herbSubmission(timestampIn, nameIn, clanIn, herbIn, amountIn){
    if (isValidInt(amountIn) === false) {
        return{
            success: false,
            message: "The amount of herbs submitted must be a valid integer."
        }
    }
             
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
            await processHerbSubmission(sheets, TC_HERB_BACKEND, timestampIn, nameIn, herbIn, amountIn)
        }
        else if (clanIn === "shadowclan"){
            await processHerbSubmission(sheets, SC_HERB_BACKEND, timestampIn, nameIn, herbIn, amountIn)
        }
        else if (clanIn === "riverclan"){
            await processHerbSubmission(sheets, RC_HERB_BACKEND, timestampIn, nameIn, herbIn, amountIn)
        }
        else if (clanIn === "windclan"){
            await processHerbSubmission(sheets, WC_HERB_BACKEND, timestampIn, nameIn, herbIn, amountIn)
        }
        return{
            success: true,
            message: `Successfully added ${nameIn}'s ${amountIn} ${herbIn} to ${clanIn}'s herb stores!`
        };
    }
    catch(error){
        console.error("Google Sheets error:", error);
        return{
            success: false,
            message: "Issue connecting to Google Sheets - Please try agin later "
        };
    }
}

async function processHerbSubmission(sheetsIn, clanHerbBackend, timestampIn, nameIn, herbIn, amountIn){
    await sheetsIn.spreadsheets.values.append({
        spreadsheetId: clanHerbBackend,
        range: 'Backend!A:E', // format: SheetName!StartColumn:EndColumn
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
            values: [[timestampIn, nameIn, 'Adding', herbIn, amountIn]],
        },
    });
}

function printTest(){
    console.log("Test worked! ")
}

//timestamp = getFormattedTimestamp();
//catName = "Lunarlynx";
//herb = "Willow Bark";
//amount = 1;
//clan = "thunderclan"
//console.log(timestamp)
//herbSubmission(timestamp, catName, clan, herb, amount );

module.exports = { herbSubmission, processHerbSubmission, printTest };