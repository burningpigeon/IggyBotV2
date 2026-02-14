const { getModifier, getModifierLvl, getRandomPrey, gatheringFailCheck, huntingFailCheck, huntingRoll, gatheringRoll, trackingRoll, sneakingRoll, swimmingRoll, climbingRoll, brawlingRoll, healingRoll } = require('../controllers/diceRolling');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    run: async ({ interaction }) => {
        const skill = interaction.options.getString('skill');
        const level = interaction.options.getString('level');
        let result;
        await interaction.reply(`You selected skill: ${skill}, level: ${level}`);
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
                    { name: '[1] Beginner', value: 'beginner' },
                    { name: '[2] Rookie', value: 'rookie' },
                    { name: '[3] Decent', value: 'decent' },
                    { name: '[4] Average', value: 'average' },
                    { name: '[5] Great', value: 'great' },
                    { name: '[6] Excellent', value: 'excellent' },
                    { name: '[7] Mastered', value: 'mastered' },
                    { name: '[8] Blessed', value: 'blessed' },
                ]
            }
        ]
    }
};
