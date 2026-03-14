const { google } = require('googleapis');
const path = require('path');
console.log("processPreySubmission.js loaded");
const { isValidInt, getFormattedTimestamp, capitalizeFirstLetters} = require('../utils');
const preyData = require('../../data/prey.json')
const TC_PREY_BACKEND = "1f49kKw0KPJzNbBgZE9ss0YhOv2ouI9cG8hkMkGw300I"
const SC_PREY_BACKEND = ""
const RC_PREY_BACKEND = ""
const WC_PREY_BACKEND = ""
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
            message: `Successfully added ${nameIn}'s ${preyIn} to ${clanIn}'s freshkill pile!`
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
    if (preyCategoryIn === "air"){
        await sheetsIn.spreadsheets.values.append({
            spreadsheetId: clanPreyBackend,
            range: 'Form Responses 1!A:Z', // format: SheetName!StartColumn:EndColumn
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
            range: 'Backend!A:Z', // format: SheetName!StartColumn:EndColumn
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
            range: 'Backend!A:Z', // format: SheetName!StartColumn:EndColumn
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
            range: 'Backend!A:Z', // format: SheetName!StartColumn:EndColumn
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
            range: 'Backend!A:Z', // format: SheetName!StartColumn:EndColumn
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
            range: 'Backend!A:Z', // format: SheetName!StartColumn:EndColumn
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