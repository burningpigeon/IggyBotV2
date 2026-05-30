const { google } = require('googleapis');
const path = require('path');
console.log("processHerbSubmission.js loaded");
const { isValidInt, getFormattedTimestamp} = require('../utils');
const herbData = require('../../data/herbs.json')

const TC_HERB_BACKEND = "1No8vMYVeBtRyB0SFjdpQ1YViMyH_s91V7MiFePx2ayo"
const SC_HERB_BACKEND = "1fefNIhXxRUTW5O3vyK7OBehU7OX61sV-0CiLNULKqQ8"
const RC_HERB_BACKEND = "1dYk2ebXyVij0QtyhTUSvr-_LoCPQXsBfoQB3naVUWDY"
const WC_HERB_BACKEND = "1jAFq2KcECQONRsEoUNLBZGPxV77d7TxhNRHecCRzjl0"
const KEYFILEPATH = path.join(__dirname, '../../data/extreme-ratio-443023-e1-57fff1ff9ae4.json')

async function herbStorage(clanIn){
    try{
        const auth = new google.auth.GoogleAuth({
            keyFile: KEYFILEPATH,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({
            version: 'v4',
            auth,
        });

        let result;  // Add this to store the result

        if (clanIn === "thunderclan"){
            result = await getHerbAmounts(sheets, TC_HERB_BACKEND, "thunderclan" )
        }
        else if (clanIn === "shadowclan"){
            result = await getHerbAmounts(sheets, SC_HERB_BACKEND, "shadowclan")
        }
        else if (clanIn === "riverclan"){
            result = await getHerbAmounts(sheets, RC_HERB_BACKEND, "riverclan")
        }
        else if (clanIn === "windclan"){
            result = await getHerbAmounts(sheets, WC_HERB_BACKEND, "windclan")
        }

        return result;  // Return the result
    }
    catch(error){
        console.error("Google Sheets error:", error);
        return{
            success: false,
            message: "Issue connecting to Google Sheets - Please try again later"
        };
    }
}

async function getHerbAmounts(sheets, clanBackend, clanIn){
    response = ""
    if (clanIn === "thunderclan"){
        response = await sheets.spreadsheets.values.get({
            spreadsheetId: clanBackend,
            range: 'Front End!A3:B21'
        })
    }
    else{
        response = await sheets.spreadsheets.values.get({
            spreadsheetId: clanBackend,
            range: 'Frontend!A3:B21'
        }) 
    }
    // TO DO: add error for if response doesn't work
    const rows = response.data.values;
    const message = `
Alder Bark:    ${rows[0][1]}
Borage:        ${rows[1][1]}
Burdock Root:  ${rows[2][1]}
Burnet:        ${rows[3][1]}
Catmint:       ${rows[4][1]}
Cobwebs:       ${rows[5][1]}
Comfrey:       ${rows[6][1]}
Curly Dock:    ${rows[7][1]}
Eyebright:     ${rows[8][1]}
Feverfew:      ${rows[9][1]}
Geranium:      ${rows[10][1]}
Lavender:      ${rows[11][1]}
Marigold:      ${rows[12][1]}
Poppy Seeds:   ${rows[13][1]}
Sea Buckthorn: ${rows[14][1]}
Tansy:         ${rows[15][1]}
Wild Garlic:   ${rows[16][1]}
Willow Bark:   ${rows[17][1]}
Yarrow:        ${rows[18][1]}
`
    return{
        success: true,
        message: message,
    }
}

module.exports = { herbStorage };