const preyData = require('../../data/prey_categories.json');


function roll20(){
    return Math.floor(Math.random()* 20) +1;
}

// console.log(roll20());
// console.log(roll20());
// console.log(roll20());

function getModifier(modifierIn){
    const modifierMap = {
        "Beginner": -3,
        "1": -3,
        "Rookie": -2,
        "2": -2,
        "Decent": -1,
        "3": -1,
        "Average": 0,
        "4": 0,
        "Great": 1,
        "5": 1,
        "Excellent": 2,
        "6": 2,
        "Mastered": 3,
        "7": 3,
        "Blessed": 5,
        "8": 5,
    };

    if (!(modifierIn in modifierMap)){
        return{
            success: false,
            message: `Incorrect level, please try again`
        };
    }
    return modifierMap[modifierIn]
}

//console.log(getModifier("Beginner"));
//console.log(getModifier("Average"));
//console.log(getModifier("Blessed"));

function getModifierLvl(modifierIn){
    const modifierLvlMap = {
        "-3": "Beginner",
        "-2": "Rookie",
        "-1": "Decent",
        "0": "Average",
        "1": "Great",
        "2": "Excellent",
        "3": "Mastered",
        "5": "Blessed"
    };
    const key = String(modifierIn);

    if (!(key in modifierLvlMap)){
        return{
            success: false,
            message: `Incorrect level, please try again`
        };
    }
    return modifierLvlMap[modifierIn]
}

//console.log(getModifierLvl("-3"))
//console.log(getModifierLvl("0"))
//console.log(getModifierLvl("3"))

function gatheringFailCheck(modifierIn, gatheringLvlIn){
    const failThresholds = {
        "Common": 2,
        "Uncommon": 6,
        "Rare": 10,
    };

    if (!(gatheringLvlIn in failThresholds)){
        return{
            succes: false,
            message: `Invalid gathering level: ${gatheringLvlIn}`
        }
    }

    const finalRoll = Math.floor(parseInt(roll20()) + parseInt(getModifier(modifierIn)));
    console.log(finalRoll)
    return finalRoll <= failThresholds[gatheringLvlIn];
}

//console.log(gatheringFailCheck("5", "Common"));  
//console.log(gatheringFailCheck("5", "Legendary"));

function huntingFailCheck(levelIn){
    const roll = Math.floor(parseInt(roll20()))
    const failThresholds = {
        "Beginner": 11,
        "Rookie": 10,
        "Decent": 8,
        "Average": 6,
        "Great": 4,
        "Excellent": 3,
        "Mastered": 2,
        "Blessed": 2,
    }
    return roll <= Math.floor(parseInt(failThresholds[levelIn]));
}
//console.log(huntingFailCheck("Beginner"));
//console.log(huntingFailCheck("Average"));
//console.log(huntingFailCheck("Blessed"));

function getRandomPrey(categoryIn){
    const preyArray = preyData.prey_categories[categoryIn];

    if(!preyArray || preyArray.length === 0){
        return{
            success: false,
            message: "Category doesn't exist"
        }
    }

    const totalWeight = preyArray.reduce((sum, prey) => sum + prey.weight, 0);
    let randomNum = Math.random() * totalWeight;

    for (const prey of preyArray){
        randomNum -= prey.weight;
        if (randomNum <= 0){
            return{
                prey_name: prey.prey_name,
                emoji: prey.emoji
            };
        }

    }
}

// const randomAirPrey = getRandomPrey('air');
// console.log(randomAirPrey)

function huntingRoll(levelIn, categoryIn){
    const failCheck = huntingFailCheck(levelIn)
    const modifier = Math.floor(parseInt(getModifier(levelIn)))
    if (failCheck === true){
        return{
            success: true,
            message: "Unfortunately, you don't find any prey."
        }
    }
    else{
        const roll = Math.floor(parseInt(roll20()));
        const preyRoll = getRandomPrey(categoryIn);
        if (roll === 1){
            return{
                success: true,
                message: " Natural [1] - Ouch! You lose the prey, and somehow hurt yourself in the process. This results in an injury level of your choosing! If you are currently injured, ignore this and instead treat it as a regular failed roll with no negative outcomes."
            }
        }
        else if (roll === 20){
            return{
                success: true,
                message: `🍖 You caught sight of a ${preyRoll.emoji} ${preyRoll.prey_name}! 🌟 Natural [20] - You catch the prey excellently - and it's absolutely massive! This prey counts as two pieces. Please submit it to your Clan's Freshkill pile before Monday!`
            }
        }
        else{
            const finalRoll = roll + modifier;
            if (finalRoll <= 1){
                return{
                    success: true,
                    message: `🐾 [${finalRoll}] Terrible Hunt: You stumble over your own paws. Luckily, you are unhurt, but the prey is long gone.`
                    }
                }
            else if (finalRoll <=3){
                return{
                    success: true,
                    message: `🐾 [${finalRoll}] Lousy Hunt: You miss the kill sloppily. Might get wet if fishing, or covered in dirt if on the ground.`
                    }
                }
            else if (finalRoll <=6){
                return{
                    success: true,
                    message: `🐾 [${finalRoll}] Almost Got It: You almost caught it! You miss by a whisker length!`
                    }
                }
            else if (finalRoll <=14){
                return{
                    success: true,
                    message: `🍖 You caught sight of a ${preyRoll.emoji} ${preyRoll.prey_name}! 🐾 [${finalRoll}] Mediocre Hunt: You catch your prey, but not very well. It’s a bit mangled. Please submit it to your Clan's Freshkill pile before Monday!`
                    }
                }
            else if (finalRoll <=19){
                return{
                    success: true,
                    message: `🍖 You caught sight of a ${preyRoll.emoji} ${preyRoll.prey_name}! 🐾 [${finalRoll}] Good Hunt: Decently executed hunt! Still some minor room for improvements. Please submit it to your Clan's Freshkill pile before Monday!`
                    }
                }
            else {
                return{
                    success: true,
                    message: `🍖 You caught sight of a ${preyRoll.emoji} ${preyRoll.prey_name}! 🐾 [${finalRoll}] Excellent Hunt: Perfectly executed hunt, couldn't have gone better. Please submit it to your Clan's Freshkill pile before Monday!`
                    }
                }
            }
        }
    }

function gatheringRoll(levelIn, rarityIn){
    const failCheck = gatheringFailCheck(levelIn, rarityIn)
    const modifier = Math.floor(parseInt(getModifier(levelIn)))
    if (failCheck === true){
        return{
            success: true,
            message: "Unfortunately, you don't find any prey."
        }
    }
    else{
        const roll = Math.floor(parseInt(roll20()));
        if (roll === 1){
            return{
                success: true,
                message: "☠️ Natural [1] - You found no herbs and received an injury level of your choosing. If you are currently injured, ignore this and instead treat it as a regular failed roll with no negative outcomes."
            }
        }
        else if (roll === 20){
            return{
                success: true,
                message: `🌟 Natural [20] You found 3 uses of the herb you’re looking for and can give advantage to a companion’s next gathering roll. Please log your find on your Clan's Herb Storage page when possible.`
            }
        }
        else{
            const finalRoll = roll + modifier;
            if (finalRoll <= 1){
                return{
                    success: true,
                    message: `🥀 [${finalRoll}] — Failure - You found a plant, but it’s not of any use to you or your healer. Better luck next time!`
                }
            }
            else if (finalRoll <= 5){
                return{
                    success: true,
                    message: `🥀 [${finalRoll}] — Failure - You found no uses on this plant. They’re out there somewhere!`
                }
            }
            else if (finalRoll <=12){
                return{
                    success: true,
                    message: `🌿 [${finalRoll}] — 1 Use - You found 1 use of the herb you’re looking for! Please log your find on your Clan's Herb Storage page when possible.`
                }
            }
            else if (finalRoll <=17){
                return{
                    success: true,
                    message: `🌿 [${finalRoll}] — 2 Uses - You found 2 uses of the herb you’re looking for! Please log your find on your Clan's Herb Storage page when possible.`
                }
            }
            else{
                return{
                    success: true,
                    message: `🌿 [${finalRoll}] — 3 Uses - You found 3 uses of the herb you’re looking for! Please log your find on your Clan's Herb Storage page when possible.`
                }
            }
        }
    }
}

function trackingRoll(levelIn){
    const modifier = Math.floor(parseInt(getModifier(levelIn)))
    const roll = Math.floor(parseInt(roll20())); // the base roll before modifiers, used for nats
    if (roll === 1){
        return{
            success: true,
            message: "❗ Natural [1] — You are so focused on the sights and smells that it seems you've missed what was right in front of you. You managed to get injured in a minor accident, resulting in an injury level of your choosing! If you are currently injured, ignore this and instead treat it as a regular failed roll with no negative outcomes."
        }
    }
    else if (roll === 20){
        return{
            success: true,
            message: `🌟 Natural [20] — Not only do you seek out your objective with commendable prowess, you're also able to help someone else notice the trail as well! This roll may be combo-ed!`
        }
    }
    else{
        const finalRoll = roll + modifier;
        if (finalRoll <=3){
            return{
                success: true,
                message: `❓ [${finalRoll}] — You could have sworn you had it! It seems you've managed to lose the trail you'd been following.`
            }
        }
        else if (finalRoll <= 10){
            return{
                success: true,
                message: `🔍 [${finalRoll}] You have trouble finding your target`
            }
        }
        else if (finalRoll <= 15){
            return{
                success: true,
                message: `🔍 [${finalRoll}] You follow the trail expertly! You easily navigate to its source. This roll may be combo-ed!`
            }
        }
        else{
            return{
                success: true,
                message: `🔍 [${finalRoll}] Your eyes are as keen as a hawk's and your nose as great as a bloodhound's as you seek out your target! This roll may be combo-ed!`
            }
        }
    }
}

function sneakingRoll(levelIn){
const modifier = Math.floor(parseInt(getModifier(levelIn)))
    const roll = Math.floor(parseInt(roll20())); // the base roll before modifiers, used for nats
    if (roll === 1){
        return{
            success: true,
            message: `❗ Natural [1] — Uh-oh! You were so focused on being unseen, you stopped paying attention to your environment! You managed to get injured in a minor accident, resulting in an injury level of your choosing! If you are currently injured, ignore this and instead treat it as a regular failed roll with no negative outcomes.`
        }
    }
    else if (roll === 20){
        return{
            success: true,
            message: `🌟 Natural [20] — You know what you are doing, and are quiet as a mouse! You successfully sneak, and can give a companion advantage on their sneaking. This roll may be combo-ed!`
        }
    }
    else{
        const finalRoll = roll + modifier;
        if (finalRoll <=3){
            return{
                success: true,
                message: `🍂 [${finalRoll}] — You think you are being sneaky, though it appears you have alerted your quarry! If you hurry, you might still pull this off, though.`
            }
        }
        else if (finalRoll <= 10){
            return{
                success: true,
                message: `🐾 [${finalRoll}] Who knew there were so many loud plants around here?! By the stars, it’s a struggle!`
            }
        }
        else if (finalRoll <= 15){
            return{
                success: true,
                message: `🐾 [${finalRoll}] You are sneaking effectively! Keep up the good work! This roll may be combo-ed!`
            }
        }
        else{
            return{
                success: true,
                message: `🐾 [${finalRoll}] You are so sneaky, you’re virtually undetectable. If another cat detects you they must be a super cat! This roll may be combo-ed!`
            }
        }
    }
}

output = sneakingRoll("Mastered")
console.log(output)
