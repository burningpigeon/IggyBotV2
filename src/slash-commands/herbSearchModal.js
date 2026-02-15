const {StringSelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, LabelBuilder, StringSelectMenuBuilder, setStringSelectMenuComponent, ModalSubmitInteraction, blockQuote, subtext, codeBlock} = require('discord.js')
const { isValidInt } = require('../utils');
const { capitalizeFirstLetters} = require('../utils');
const { getHerbData, herbSearch } = require('../controllers/herbSearch')

module.exports = {
    run: async({ interaction}) => {
        const modal = new ModalBuilder({
            customId: `herbSearch-${interaction.user.id}`,
            title: `Herb Search`,
        });


        const clanSelect = new StringSelectMenuBuilder()
            .setId(2)
            .setCustomId('clanSelect')
            .setPlaceholder('The clan you are submitting herbs to')
            .setRequired(true)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('ThunderClan')
                    .setValue('thunderclan'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('ShadowClan')
                    .setValue('shadowclan'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('RiverClan')
                    .setValue('riverclan'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('WindClan')
                    .setValue('windclan'),
            );

        const clanLabel = new LabelBuilder()
            .setLabel("Clan")
            .setDescription('The clan you are submitting the herbs to')
            .setStringSelectMenuComponent(clanSelect)

        const herbSelect = new StringSelectMenuBuilder()
            .setId(3)
            .setCustomId('herbSelect')
            .setPlaceholder('Select a herb')
            .setRequired(true)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Alder bark')
                    .setValue('Alder Bark'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Borage')
                    .setValue('Borage'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Budock Root')
                    .setValue('Burdock Root'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Burnet')
                    .setValue('Burnet'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Catmint')
                    .setValue('Catmint'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Cobwebs')
                    .setValue('Cobwebs'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Comfrey')
                    .setValue('Comfrey'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Curly Dock')
                    .setValue('Curly Dock'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Eyebright')
                    .setValue('Eyebright'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Feverfew')
                    .setValue('Feverfew'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Geruanium')
                    .setValue('Geruanium'),
                new StringSelectMenuOptionBuilder()
                    .setValue('Lavender')
                    .setLabel('Lavender'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Marigold')
                    .setValue('Marigold'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Poppy seeds')
                    .setValue('Poppy Seeds'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Sea Buckthorn')
                    .setValue('Sea Buckthorn'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Tansy')
                    .setValue('Tansy'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Wild Garlic')
                    .setValue('Wild Garlic'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Willow Bark')
                    .setValue('Willow Bark'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Yarrow')
                    .setValue('Yarrow'), 
            );

        const herbLabel = new LabelBuilder()
            .setLabel("What herb are you submitting?")
            .setDescription('Select the herb you are submitting from the dropdown')
            .setStringSelectMenuComponent(herbSelect)

        modal.addLabelComponents(clanLabel, herbLabel);
        await interaction.showModal(modal); 

        //wait for the modal to be submitted
        const filter = (interaction) => interaction.customId === `herbSearch-${interaction.user.id}`;

        interaction
            .awaitModalSubmit({ filter, time: 360000 })
            .then(async(ModalSubmitInteraction) => {
                const clan = ModalSubmitInteraction.fields.getStringSelectValues('clanSelect')[0];
                const herb = ModalSubmitInteraction.fields.getStringSelectValues('herbSelect')[0];
                const header = `:herb: **${capitalizeFirstLetters(clan)} Herb Search - ${capitalizeFirstLetters(herb)}** :herb:`;

                try {
                    const result = await herbSearch(clan, herb);
                    if (!result.success) {
                        await ModalSubmitInteraction.reply(`<@${interaction.user.id}> ${header} ${codeBlock(result.message)}`);
                    } else {
                        const blockQuoteMsg = codeBlock(result.message);
                        await ModalSubmitInteraction.reply(`<@${interaction.user.id}> ${header} ${blockQuoteMsg}`);
                    }
                } catch (err) {
                    console.error(err);
                    await ModalSubmitInteraction.reply(`<@${interaction.user.id}> ${header} ${codeBlock("Unexpected error occurred. Please try again later.")}`);
                }
            })
            .catch((err) => {
                console.log(`Error: ${err}`);
            })
    },  

    data: {
        name: 'herb-search',
        description: 'Gives additional information on a herb.'
    }
}
