const { google } = require('googleapis');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
console.log("processHerbSubmission.js loaded");
const { isValidInt, getFormattedTimestamp} = require('../utils');
const herbData = require('../../data/herbs.json')

const { TC_HERB_BACKEND, SC_HERB_BACKEND, RC_HERB_BACKEND, WC_HERB_BACKEND } = process.env;
const KEYFILEPATH = path.join(__dirname, '../../data/extreme-ratio-443023-e1-57fff1ff9ae4.json')

async function herbSearch(clanIn, herbIn){
   
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
            result = await getHerbData(sheets, herbIn, "tc", TC_HERB_BACKEND, "thunderclan")  // Store result
        }
        else if (clanIn === "shadowclan"){
            result = await getHerbData(sheets, herbIn, "sc", SC_HERB_BACKEND, "shadowclan")
        }
        else if (clanIn === "riverclan"){
            result = await getHerbData(sheets, herbIn, "rc", RC_HERB_BACKEND, "riverclan")
        }
        else if (clanIn === "windclan"){
            result = await getHerbData(sheets, herbIn, "wc", WC_HERB_BACKEND, "windclan")
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


async function getHerbData(sheets, herbIn, locationIn, clanBackend,clanIn){
    const herb = herbData.herbs.find(herb =>
        herb.Name.toLowerCase() === herbIn.toLowerCase()
    );

    if (!herb){
        return{
            success: false,
            message: `Herb: ${herbIn} not found`  // Fix: herbIn not herbName
        };
    }

    const locationData = herb.Locations[locationIn];
    if (!locationData){
        return{
            success: false,
            message: `Location: ${locationIn} not found for ${herb.Name}`
        };
    }
    let range = ""
    if(clanIn === "thunderclan"){
        range = 'Front End!A3:B21'
    }
    else{
        range = 'Frontend!A3:B21'
    }

    const response = await sheets.spreadsheets.values.get({
            spreadsheetId: clanBackend,
            range: range
        })

    const rows = response.data.values;
    let finalAmount;
    for (const row of rows){
        const name = row[0]
        const amount = row[1]

        if (name.toLowerCase() === herb.Name.toLowerCase()){
            finalAmount = amount
        }
    }

    const message = `Name: ${herb.Name}
Usage: ${herb.Usage}
Amount: ${finalAmount}
Description: ${herb.Description}
Application: ${herb.Application}
Toxicity: ${herb.Toxicity}
Rarity:
    Newleaf: ${herb.Rarity.Newleaf}
    Greenleaf: ${herb.Rarity.Greenleaf}
    Leaffall: ${herb.Rarity.Leafall} 
    Leafbare: ${herb.Rarity.Leafbare}
Locations: ${locationData}`

    return{
        success: true,
        message: message
    }
}

module.exports = { getHerbData, herbSearch };