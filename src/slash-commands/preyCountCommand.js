const { getPreyCount, preyCount } = require('../controllers/preyCount');
const { SlashCommandBuilder, codeBlock } = require('discord.js');
const {capitalizeFirstLetters } = require('../utils');

module.exports = {
    run: async ({ interaction }) => {
        const clan = interaction.options.getString('clan');
        let header = `🍖 **${capitalizeFirstLetters(clan)} Prey Pile** 🍖`
        let result = await preyCount(clan);
        const blockQuoteMsg = codeBlock(result.message)
        await interaction.reply(`<@${interaction.user.id}> ${header} ${blockQuoteMsg}`);
    },
    data: {
        name: 'prey-count',
        description: 'See your clans freshkill pile',
        options: [
            {
                type: 3, // STRING
                name: 'clan',
                description: 'Choose a clan',
                required: true,
                choices: [
                    { name: 'ThunderClan', value: 'thunderclan' },
                    { name: 'ShadowClan', value: 'shadowclan' },
                    { name: 'RiverClan', value: 'riverclan' },
                    { name: 'WindClan', value: 'windclan' },

                ]
            }
        ]
    }
};