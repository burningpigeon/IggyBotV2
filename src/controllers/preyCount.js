const { google } = require('googleapis');
const path = require('path');
console.log("preyCount.js loaded");
const { isValidInt, getFormattedTimestamp} = require('../utils');

const TC_PREY_BACKEND = "1TUZHxTKaHXZ3LoO-l2S05_wbcCGQ4YmumNhS-oYh6TM"
const SC_PREY_BACKEND = "19UhMIDx-Ca3RYzlBkbvJUqE8D7QTBIa9U_NyWbpgIPg"
const RC_PREY_BACKEND = "1Cn9f5Ie3HWP4qqqmqYwzi0bypP6AZZlxtMFPtaj_lQ0"
const WC_PREY_BACKEND = "1fHeLDksrPA4NSceOJt2iXZiy6RqN9fj6Fupp8IdWA10"

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
            result = await getPreyCount(sheets, "ShadowClan", SC_PREY_BACKEND);
        }
        else if (clanIn === "riverclan"){
            result = await getPreyCount(sheets, "RiverClan", RC_PREY_BACKEND);
        }
        else if (clanIn === "windclan"){
            result = await getPreyCount(sheets, "WindClan", WC_PREY_BACKEND);
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