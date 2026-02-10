const {StringSelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, LabelBuilder, StringSelectMenuBuilder, setStringSelectMenuComponent, ModalSubmitInteraction, blockQuote, subtext, codeBlock} = require('discord.js')
const { isValidInt } = require('../utils');
const { getFormattedTimestamp} = require('../utils');
const { herbSubmission, processHerbSubmission, printTest} = require('../controllers/processHerbSubmission')

module.exports = {
    run: async({ interaction}) => {
        const modal = new ModalBuilder({
            customId: `herbSubmmission-${interaction.user.id}`,
            title: `Herb Submission`,
        });

        const nameInput = new TextInputBuilder()
            .setId(1)
            .setCustomId('nameInput')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Owlscreech, Lunarlynx, Nightfinch..')
            .setRequired(true)

        const nameLabel = new LabelBuilder()
            .setLabel('What is your cats name?')
            .setDescription('The name of the cat who you are submitting herbs under')
            .setTextInputComponent(nameInput)

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

        const amountInput = new TextInputBuilder()
            .setId(5)
            .setCustomId('amountInput')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        const amountLabel = new LabelBuilder()
            .setLabel('How many herbs are you submitting?')
            .setDescription('The number of herbs you are submitting (1,2... etc)')
            .setTextInputComponent(amountInput)

        modal.addLabelComponents(nameLabel, clanLabel, herbLabel, amountLabel);
        await interaction.showModal(modal); 

        //wait for the modal to be submitted
        const filter = (interaction) => interaction.customId === `herbSubmmission-${interaction.user.id}`;

        interaction
            .awaitModalSubmit({ filter, time: 360000 })
            .then(async(ModalSubmitInteraction) => {
                const time = getFormattedTimestamp();
                const name = ModalSubmitInteraction.fields.getTextInputValue('nameInput');
                const clan = ModalSubmitInteraction.fields.getStringSelectValues('clanSelect')[0];
                const herb = ModalSubmitInteraction.fields.getStringSelectValues('herbSelect')[0];
                const amount = ModalSubmitInteraction.fields.getTextInputValue('amountInput');

                const header = `:herb: **Herb Storage Submission** :herb:`;

                try {
                    const result = await herbSubmission(time, name, clan, herb, amount);
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
        name: 'herb-submission',
        description: 'Submits herbs to the backend'
    }
}