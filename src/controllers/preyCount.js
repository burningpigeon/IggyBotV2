const { google } = require('googleapis');
const path = require('path');
console.log("preyCount.js loaded");
const { isValidInt, getFormattedTimestamp} = require('../utils');

const TC_PREY_BACKEND = "1f49kKw0KPJzNbBgZE9ss0YhOv2ouI9cG8hkMkGw300I"
const SC_HERB_BACKEND = ""
const RC_HERB_BACKEND = ""
const WC_HERB_BACKEND = ""

const KEYFILEPATH = path.join(__dirname, '../../data/extreme-ratio-443023-e1-57fff1ff9ae4.json')

async function preyCount(clanIn){
        try{
        const auth = new google.auth.GoogleAuth({
            keyFile: KEYFILEPATH,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({
            version: 'v4',
            auth,
        });

        let result;

        if (clanIn === "thunderclan"){
            result = await getPreyCount(sheets, "ThunderClan", TC_PREY_BACKEND);
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
            message: result.message
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

async function getPreyCount(sheets, clanIn, backendIn){
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: backendIn,
        range: 'P4:Q4'
    });

    try{
        const preyCount = Math.floor(parseInt(response.data.values?.[0]?.[0]));
        const preyGoal = Math.floor(parseInt(response.data.values?.[0]?.[1]));
        console.log(`Prey Count: ${preyCount}`)
        console.log(`Prey Goal: ${preyGoal}`)

        if (preyCount < preyGoal){
            return{
                success: true,
                message: `${clanIn} currently has ${preyCount}/${preyGoal} pieces. You need ${preyGoal - preyCount} more pieces of prey to meet prey requirements. Time to get hunting!`
            }
        }
        else if (preyCount >= preyGoal){
            return{
                success: true,
                message: `Woo hoo! ${clanIn} currently has ${preyCount}/${preyGoal} pieces. Prey requirements have been met! Great work!`
            }
        }
        else{
            return{
                success: false,
                message: `Prey count and prey goal couldn't be compared. Please inform staff and try again later.`
            }
        }
    }
    catch(err){
        return{
            success: false,
            message:  `Prey count and/or prey goal aren't numbers. Please inform staff and try again later.`
        }
    }
}

module.exports = { getPreyCount, preyCount };