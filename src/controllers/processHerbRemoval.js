const { google } = require('googleapis');
const path = require('path');
console.log("processHerbSubmission.js loaded");
const { isValidInt, getFormattedTimestamp} = require('../utils');

const TC_HERB_BACKEND = "1No8vMYVeBtRyB0SFjdpQ1YViMyH_s91V7MiFePx2ayo"
const SC_HERB_BACKEND = "1fefNIhXxRUTW5O3vyK7OBehU7OX61sV-0CiLNULKqQ8"
const RC_HERB_BACKEND = "1dYk2ebXyVij0QtyhTUSvr-_LoCPQXsBfoQB3naVUWDY"
const WC_HERB_BACKEND = "1jAFq2KcECQONRsEoUNLBZGPxV77d7TxhNRHecCRzjl0"
const KEYFILEPATH = path.join(__dirname, '../../data/extreme-ratio-443023-e1-57fff1ff9ae4.json')

async function herbRemoval(timestampIn, nameIn, clanIn, herbIn, amountIn){
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
            await processHerbRemoval(sheets, TC_HERB_BACKEND, timestampIn, nameIn, herbIn, amountIn)
        }
        else if (clanIn === "shadowclan"){
            await processHerbRemoval(sheets, SC_HERB_BACKEND, timestampIn, nameIn, herbIn, amountIn)
        }
        else if (clanIn === "riverclan"){
            await processHerbRemoval(sheets, RC_HERB_BACKEND, timestampIn, nameIn, herbIn, amountIn)
        }
        else if (clanIn === "windclan"){
            await processHerbRemoval(sheets, WC_HERB_BACKEND, timestampIn, nameIn, herbIn, amountIn)
        }
        return{
            success: true,
            message: `Successfully removed ${nameIn}'s ${amountIn} ${herbIn} from ${clanIn}'s herb stores!`
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

async function processHerbRemoval(sheetsIn, clanHerbBackend, timestampIn, nameIn, herbIn, amountIn){
    await sheetsIn.spreadsheets.values.append({
        spreadsheetId: clanHerbBackend,
        range: 'Backend!A:E', // format: SheetName!StartColumn:EndColumn
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
            values: [[timestampIn, nameIn, 'Removing', herbIn, amountIn]],
        },
    });
}

function printTest(){
    console.log("Test worked! ")
}


module.exports = { herbRemoval, processHerbRemoval, printTest };