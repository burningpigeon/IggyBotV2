const { getHerbAmounts, herbStorage } = require('../controllers/herbStorage');
const { SlashCommandBuilder, codeBlock } = require('discord.js');
const {capitalizeFirstLetters } = require('../utils');

module.exports = {
    run: async ({ interaction }) => {
        await interaction.deferReply();
        let header;
        try{
            const clan = interaction.options.getString('clan');
            header = `🌿 **${capitalizeFirstLetters(clan)} Herb Storage** 🌿`
            let result = await herbStorage(clan);
            const blockQuoteMsg = codeBlock(result.message)
            await interaction.editReply(`<@${interaction.user.id}> ${header} ${blockQuoteMsg}`);
        }
        catch(error){
            console.error(error);
            await interaction.editReply(`<@${interaction.user.id}> ${header ?? "🌿 Herb Storage"} An unexpected error occurred`);
        }

    },
    data: {
        name: 'herb-storage',
        description: 'See the herbs your clan current has in store.',
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