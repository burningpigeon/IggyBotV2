const preyData = require('../../data/prey_categories.json');


function roll20(){
    return Math.floor(Math.random()* 20) +1;
}


function getModifier(modifierIn){
    const modifierMap = {
        "beginner": -3,
        "1": -3,
        "rookie": -2,
        "2": -2,
        "decent": -1,
        "3": -1,
        "average": 0,
        "4": 0,
        "great": 1,
        "5": 1,
        "excellent": 2,
        "6": 2,
        "mastered": 3,
        "7": 3,
        "blessed": 5,
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
    return finalRoll <= failThresholds[gatheringLvlIn];
}

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


function getRandomPrey(categoryIn){
    const preyArray = preyData.prey_categories[categoryIn];

    if(!preyArray || preyArray.length === 0){
        return{
            success: false,
            message: `Category: ${categoryIn} doesn't exist`
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


function huntingRoll(levelIn, categoryIn){
    const failCheck = module.exports.huntingFailCheck(levelIn)
    const modifier = Math.floor(parseInt(module.exports.getModifier(levelIn)))
    if (failCheck === true){
        return{
            success: true,
            message: `Unfortunately, you don't find any prey.`
        }
    }
    else{
        const roll = Math.floor(parseInt(module.exports.roll20()));
        const preyRoll = module.exports.getRandomPrey(categoryIn);
        if (roll === 1){
            return{
                success: true,
                message: ` Natural [1] - Ouch! You lose the prey, and somehow hurt yourself in the process. This results in an injury level of your choosing! If you are currently injured, ignore this and instead treat it as a regular failed roll with no negative outcomes.`
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
    const modifier = Math.floor(parseInt(module.exports.getModifier(levelIn)))
    const failCheck = module.exports.gatheringFailCheck(levelIn, rarityIn)
    if (failCheck === true){
        return{
            success: true,
            message: `Unfortunately, you don't find any herbs.`
        }
    }
    else{
        const roll = Math.floor(parseInt(module.exports.roll20()));
        if (roll === 1){
            return{
                success: true,
                message: `☠️ Natural [1] - You found no herbs and received an injury level of your choosing. If you are currently injured, ignore this and instead treat it as a regular failed roll with no negative outcomes.`
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
            else if (finalRoll <=10){
                return{
                    success: true,
                    message: `🌿 [${finalRoll}] — 1 Use - You found 1 use of the herb you’re looking for! Please log your find on your Clan's Herb Storage page when possible.`
                }
            }
            else if (finalRoll <=15){
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
    const modifier = Math.floor(parseInt(module.exports.getModifier(levelIn)))
    const roll = Math.floor(parseInt(module.exports.roll20())); // the base roll before modifiers, used for nats
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
                message: `🔍 [${finalRoll}] You have trouble finding your target.`
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
    const modifier = Math.floor(parseInt(module.exports.getModifier(levelIn)))
    const roll = Math.floor(parseInt(module.exports.roll20())); // the base roll before modifiers, used for nats
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

function swimmingRoll(levelIn){
const modifier = Math.floor(parseInt(module.exports.getModifier(levelIn)))
    const roll = Math.floor(parseInt(module.exports.roll20())); // the base roll before modifiers, used for nats
    if (roll === 1){
        return{
            success: true,
            message: `❗ Natural [1] — Although you're not drowning, you do get injured, resulting in an injury level of your choosing! Your cat is now on the shore you started at. If you are currently injured, ignore this and instead treat it as a regular failed roll with no negative outcomes.`
        }
    }
    else if (roll === 20){
        return{
            success: true,
            message: `🌟 Natural [20] — You successfully swim to your destination, and you’re able to give advantage to someone else’s swimming roll! This roll may be combo-ed!`
        }
    }
    else{
        const finalRoll = roll + modifier;
        if (finalRoll <=3){
            return{
                success: true,
                message: `💦 [${finalRoll}] — You manage to tread water, but you struggle to move forward in any direction!`
            }
        }
        else if (finalRoll <= 10){
            return{
                success: true,
                message: `🌊 [${finalRoll}] You struggle to make it to your destination.`
            }
        }
        else if (finalRoll <= 15){
            return{
                success: true,
                message: `🌊 [${finalRoll}] You successfully swim to your destination! This roll may be combo-ed!`
            }
        }
        else{
            return{
                success: true,
                message: `🌊 [${finalRoll}] You not only swim to your destination, but you look epic doing it! This roll may be combo-ed!`
            }
        }
    }
}

function climbingRoll(levelIn){
const modifier = Math.floor(parseInt(module.exports.getModifier(levelIn)))
    const roll = Math.floor(parseInt(module.exports.roll20())); // the base roll before modifiers, used for nats
    if (roll === 1){
        return{
            success: true,
            message: `❗ Natural [1] — Your footing wasn't as stable as you thought, and you slip, resulting in an injury level of your choosing! If you are currently injured, ignore this and instead treat it as a regular failed roll with no negative outcomes.`
        }
    }
    else if (roll === 20){
        return{
            success: true,
            message: `🌟 Natural [20] — You not only make it to your destination, but are able to give another cat an advantage on their climbing roll! This roll may be combo-ed!`
        }
    }
    else{
        const finalRoll = roll + modifier;
        if (finalRoll <=3){
            return{
                success: true,
                message: `🍂 [${finalRoll}] — You attempt to climb, but you become stuck and are currently unable to move forward.`
            }
        }
        else if (finalRoll <= 10){
            return{
                success: true,
                message: `🌲 [${finalRoll}] You have trouble making it to your destination.`
            }
        }
        else if (finalRoll <= 15){
            return{
                success: true,
                message: `🌲 [${finalRoll}] You successfully climb to your destination with little trouble. This roll may be combo-ed!`
            }
        }
        else{
            return{
                success: true,
                message: `🌲 [${finalRoll}] You not only make it to your destination, you look epic doing it. This roll may be combo-ed!`
            }
        }
    }
}

function brawlingRoll(levelIn){
    const modifier = Math.floor(parseInt(module.exports.getModifier(levelIn)))
    const roll = Math.floor(parseInt(module.exports.roll20())); // the base roll before modifiers, used for nats
    if (roll === 1){
        return{
            success: true,
            message: `❗ Natural [1] - That’s gonna sting! You miss your strike and receive an injury level of your choosing. If you are currently injured in a spar, ignore this and instead treat it as a regular failed roll with no negative outcomes.`
        }
    }
    else if (roll === 20){
        return{
            success: true,
            message: `🌟 Natural [20] - Wow! You pulled off that move perfectly! You can get one extra strike for free, or you can choose to back away!`
        }
    }
    else{
        const finalRoll = roll + modifier;
        if (finalRoll <= 1){
            return{
                success: true,
                message: `🎲 [${finalRoll}] — Terrible Miss - Yikes! That really didn’t go according to plan did it? Your intended attack goes completely wrong. Perhaps you slip, or the cat countering is one step ahead of you!`
            }
        }
        else if (finalRoll <=7){
            return{
                success: true,
                message: ` 🎲 [${finalRoll}] — Lousy Miss - You miss your target! Maybe your move was too sloppy? At least you tried.`
            }
        }
        else if (finalRoll <= 10){
            return{
                success: true,
                message: `🎲 [${finalRoll}] — Near Miss - Oh! So close! You just barely miss your target, they must have dodged, or your strike was just barely off the mark.`
            }
        }
        else if (finalRoll <=14){
            return{
                success: true,
                message: `🎲 [${finalRoll}] — Mediocre Hit - Landed a hit! You meant to aim for one spot, but because of the movement of your opponent, your attack landed in a way you didn’t intend!`
            }
        }
        else if (finalRoll <= 18){
            return{
                success: true,
                message: `🎲 [${finalRoll}] — Good Hit - Nice hit! Your attack lands how you intend it to, but with less or more impact than planned!`
            }
        }
        else if (finalRoll <= 19){
            return{
                success: true,
                message: `🎲 [${finalRoll}] — Excellent Hit - Stars above, that was stunning! Your attack is executed perfectly, and your ancestors are proud to be related to you.`
            }
        }
        else{
            return{
                success: true,
                message: `🎲 [${finalRoll}] — 20+ - Attacker hits, landing the attack exactly as intended!`
            }
        }
    }
}

function healingRoll(levelIn){
    const modifier = Math.floor(parseInt(getModifier(levelIn)))
    const roll = Math.floor(parseInt(roll20())); // the base roll before modifiers, used for nats
    if (roll === 1){
        return{
            success: true,
            message: `❗ Natural [1] - Wow, you really aren’t cut out for healing! The level of injury/illness increases by one.`
        }
    }
    else if (roll === 20){
        return{
            success: true,
            message: `🌟 Natural [20] - The remedy works wonders! Is this an act of StarClan? The level of injury is decreased by one! This does not count toward the overall successes, because it reduces the level instead.`
        }
    }
    else{
        const finalRoll = roll + modifier;
        if (finalRoll <= 1){
            return{
                success: true,
                message: `☠️ [${finalRoll}] — Failure - The remedy doesn't seem to be working. Are you sure you know what you’re doing?`
            }
        }
        else if (finalRoll <=7){
            return{
                success: true,
                message: `☠️ [${finalRoll}] — Failure - The remedy doesn't appear to be working at the moment. Perhaps your technique was wrong?`
            }
        }
        else if (finalRoll <=10){
            return{
                success: true,
                message: `🥀 [${finalRoll}] — Failure - Although this almost started to make the patient feel better, there wasn't much progress.`
            }
        }
        else if (finalRoll <=14){
            return{
                success: true,
                message: `💞 [${finalRoll}] — 1 Success - The remedy is working! The patient starts to feel a bit better.`
            }
        }
        else if (finalRoll <=19){
            return{
                success: true,
                message: `💞 [${finalRoll}] — 2 Successes - The remedy is absolutely working! The patient is definitely starting to feel better.`
            }
        }
        else{
            return{
                success: true,
                message: `💞 [${finalRoll}] — 3 Successes - The remedy works wonders! Your technique was perfect and the patient is doing much better.`
            }
        }
    }
}


module.exports = { roll20, getModifier, getModifierLvl, getRandomPrey, gatheringFailCheck, huntingFailCheck, huntingRoll, gatheringRoll, trackingRoll, sneakingRoll, swimmingRoll, climbingRoll, brawlingRoll, healingRoll };

