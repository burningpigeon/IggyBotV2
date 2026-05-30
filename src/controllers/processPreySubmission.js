const { google } = require('googleapis');
const path = require('path');
console.log("processPreySubmission.js loaded");
const { isValidInt, getFormattedTimestamp, capitalizeFirstLetters} = require('../utils');
const preyData = require('../../data/prey.json')
const TC_PREY_BACKEND = "1TUZHxTKaHXZ3LoO-l2S05_wbcCGQ4YmumNhS-oYh6TM"
const SC_PREY_BACKEND = "19UhMIDx-Ca3RYzlBkbvJUqE8D7QTBIa9U_NyWbpgIPg"
const RC_PREY_BACKEND = "1Cn9f5Ie3HWP4qqqmqYwzi0bypP6AZZlxtMFPtaj_lQ0"
const WC_PREY_BACKEND = "1fHeLDksrPA4NSceOJt2iXZiy6RqN9fj6Fupp8IdWA10"
const KEYFILEPATH = path.join(__dirname, '../../data/extreme-ratio-443023-e1-57fff1ff9ae4.json')

// TO DO: buildPreyLookup should be moved to index so it only needs to run once instead of every time processPreySubmission is called

function buildPreyLookup(preyArr){
    const lookup = {};
    preyArr.forEach(preyItem => {
        const allNames = [
            preyItem.prey_name,
            ...preyItem.alternative_names
        ];

        allNames.forEach(name => {
            const preyName = name.toLowerCase().trim();
            lookup[preyName] = preyItem.categories.map(category =>
                category.toLowerCase()
            );
        });
    });
    return lookup
}

const preyLookup = buildPreyLookup(preyData.prey);

function isPreyValid(preyIn){
    const normalized = preyIn.toLowerCase().trim();
    return normalized in preyLookup;

}

function isPreyInCategory(preyIn, categoryIn){
    const categories = preyLookup[preyIn.toLowerCase()];
    return categories?.includes(categoryIn.toLowerCase()) ?? false;
}

async function submitPrey(timestampIn, nameIn, clanIn, preyIn, categoryIn, sizeIn){
    if(isPreyValid(preyIn) === false){
        return{
            success: false,
            message: `${preyIn} is not a valid prey type, please try again!`
        }
    }

    if(isPreyInCategory(preyIn, categoryIn) === false){
        return{
            success: false,
            message: `Prey ${preyIn} is not in category ${categoryIn}. Please try again! `
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
            await processPreySubmission(sheets, TC_PREY_BACKEND, timestampIn, nameIn, categoryIn, preyIn, sizeIn)
        }
        else if (clanIn === "shadowclan"){
            await processPreySubmission(sheets, SC_PREY_BACKEND, timestampIn, nameIn, categoryIn, preyIn, sizeIn)
        }
        else if (clanIn === "riverclan"){
            await processPreySubmission(sheets, RC_PREY_BACKEND, timestampIn, nameIn, categoryIn, preyIn, sizeIn)
        }
        else if (clanIn === "windclan"){
            await processPreySubmission(sheets, WC_PREY_BACKEND, timestampIn, nameIn, categoryIn, preyIn, sizeIn)
        }
        return{
            success: true,
            message: `Successfully added ${nameIn}'s ${preyIn} to ${capitalizeFirstLetters(clanIn)}'s freshkill pile!`
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

async function processPreySubmission(sheetsIn, clanPreyBackend, timestampIn, nameIn, preyCategoryIn, preyTypeIn, sizeIn){
    preyTypeIn = capitalizeFirstLetters(preyTypeIn)
    
    // TODO: Update these sheet names to match your Google Sheet
    const sheetName = 'Form Responses 1'; // Change this if you have different sheet names for each category
    
    if (preyCategoryIn === "air"){
        await sheetsIn.spreadsheets.values.append({
            spreadsheetId: clanPreyBackend,
            range: `${sheetName}!A:Z`,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values: [[timestampIn, nameIn, preyCategoryIn, "", "","","","","","","", preyTypeIn, sizeIn]],
            },
        });
    }
    else if (preyCategoryIn === "cave"){
        await sheetsIn.spreadsheets.values.append({
            spreadsheetId: clanPreyBackend,
            range: `${sheetName}!A:Z`,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values: [[timestampIn, nameIn, preyCategoryIn, "", "","","","","","","","","", preyTypeIn, sizeIn]],
            },
        });
    }
    else if (preyCategoryIn === "foliage" ){
        await sheetsIn.spreadsheets.values.append({
            spreadsheetId: clanPreyBackend,
            range: `${sheetName}!A:Z`,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values: [[timestampIn, nameIn, preyCategoryIn, "", "","","", preyTypeIn, sizeIn]],
            },
        });
    }
    else if (preyCategoryIn === "land"){
        await sheetsIn.spreadsheets.values.append({
            spreadsheetId: clanPreyBackend,
            range: `${sheetName}!A:Z`,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values: [[timestampIn, nameIn, preyCategoryIn, "", "", preyTypeIn, sizeIn]],
            },
        });
    }
    else if (preyCategoryIn === "water"){
        await sheetsIn.spreadsheets.values.append({
            spreadsheetId: clanPreyBackend,
            range: `${sheetName}!A:Z`,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values: [[timestampIn, nameIn, preyCategoryIn, preyTypeIn, sizeIn]],
            },
        });
    }
    else if (preyCategoryIn === "wetland"){
        await sheetsIn.spreadsheets.values.append({
            spreadsheetId: clanPreyBackend,
            range: `${sheetName}!A:Z`,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values: [[timestampIn, nameIn, preyCategoryIn, "", "","","","","", preyTypeIn, sizeIn]],
            },
        });
    }
    else{
        return{
            success: false, 
            message: `${preyCategoryIn} is invalid. The categories are air, cave, foliage, land, water and wetland. Please try again!`
        }
    }
}

module.exports = { processPreySubmission, isPreyValid, isPreyInCategory, submitPrey };