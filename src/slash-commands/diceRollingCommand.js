const { getModifier, getModifierLvl, getRandomPrey, gatheringFailCheck, huntingFailCheck, huntingRoll, gatheringRoll, trackingRoll, sneakingRoll, swimmingRoll, climbingRoll, brawlingRoll, healingRoll } = require('../controllers/diceRolling');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    run: async ({ interaction }) => {
        const skill = interaction.options.getString('skill');
        const level = interaction.options.getString('level');
        let result;
        if (skill === 'air' ){
            result = huntingRoll(level, "air").message
        }
        else if (skill === 'cave'){
            result = huntingRoll(level, "cave").message
        }
        else if (skill === 'foliage'){
            result = huntingRoll(level, "foliage").message
        }
        else if (skill === 'land'){
            result = huntingRoll(level, "land").message
        }
        else if (skill === 'water'){
            result = huntingRoll(level, "water").message
        }
        else if (skill === 'wetland'){
            result = huntingRoll(level, "wetland").message
        }
        else if (skill === ' common'){
            result = gatheringRoll(level, "Common").message
        }
        else if (skill === 'uncommon'){
            result = gatheringRoll(level, "Uncommon").message
        }
        else if (skill === 'rare'){
            result = gatheringRoll(level, "Rare").message
        }
        else if (skill === 'tracking'){
            result = trackingRoll(level).message
        }
        else if (skill === 'sneaking'){
            result = sneakingRoll(level).message
        }
        else if (skill === 'swimming'){
            result = swimmingRoll(level).message
        }
        else if (skill === 'climbing'){
            result = climbingRoll(level).message
        }
        else if (skill === 'brawling'){
            result = brawlingRoll(level).message
        }
        else if (skill === 'healing'){
            result = healingRoll(level).message
        }
        else{
            result = {
                success: false,
                message: `Unknown skill: ${skill}`
            }
        }

        await interaction.reply(`Result: ${result}`);
    },
    data: {
        name: 'gif',
        description: 'Backup dice roller',
        options: [
            {
                type: 3, // STRING
                name: 'skill',
                description: 'Choose a skill',
                required: true,
                choices: [
                    { name: 'Hunting-Air', value: 'air' },
                    { name: 'Hunting-Cave', value: 'cave' },
                    { name: 'Hunting-Foliage', value: 'foliage' },
                    { name: 'Hunting-Land', value: 'land' },
                    { name: 'Hunting-Water', value: 'water' },
                    { name: 'Hunting-Wetland', value: 'wetland' },
                    { name: 'Gathering-Common', value: 'common' },
                    { name: 'Gathering-Uncommon', value: 'uncommon' },
                    { name: 'Gathering-Rare', value: 'rare' },
                    { name: 'Tracking', value: 'tracking' },
                    { name: 'Sneaking', value: 'sneaking' },
                    { name: 'Swimming', value: 'swimming' },
                    { name: 'Climbing', value: 'climbing' },
                    { name: 'Brawling', value: 'brawling' },
                    { name: 'Healing', value: 'healing' },
                ]
            },
            {
                type: 3, // STRING
                name: 'level',
                description: 'Choose a level',
                required: true,
                choices: [
                    { name: '[1] Beginner', value: 'Beginner' },
                    { name: '[2] Rookie', value: 'Rookie' },
                    { name: '[3] Decent', value: 'Decent' },
                    { name: '[4] Average', value: 'Average' },
                    { name: '[5] Great', value: 'Great' },
                    { name: '[6] Excellent', value: 'Excellent' },
                    { name: '[7] Mastered', value: 'Mastered' },
                    { name: '[8] Blessed', value: 'Blessed' },
                ]
            }
        ]
    }
};
