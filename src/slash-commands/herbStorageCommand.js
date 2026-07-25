const { SlashCommandBuilder, codeBlock } = require('discord.js');
const {capitalizeFirstLetters } = require('../utils');

module.exports = {
    run: async ({ interaction }) => {
        try {
            await interaction.deferReply();
            const { herbStorage } = require('../controllers/herbStorage');
            const clan = interaction.options.getString('clan');
            const header = `🌿 **${capitalizeFirstLetters(clan)} Herb Storage** 🌿`;
            const result = await herbStorage(clan);
            const blockQuoteMsg = codeBlock(result.message);
            await interaction.editReply(`<@${interaction.user.id}> ${header} ${blockQuoteMsg}`);
        }
        catch(error){
            console.error('herb-storage command failed:', error);
            if (interaction.deferred || interaction.replied) {
                try {
                    await interaction.editReply(`<@${interaction.user.id}> 🌿 Herb Storage An unexpected error occurred`);
                }
                catch(editError) {
                    console.error('Failed to edit herb-storage reply:', editError);
                }
            }
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