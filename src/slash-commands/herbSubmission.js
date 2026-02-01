const {StringSelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, LabelBuilder, StringSelectMenuBuilder, setStringSelectMenuComponent, ModalSubmitInteraction} = require('discord.js')
const { isValidInt } = require('../utils');


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
                    .setValue('alderbark'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Borage')
                    .setValue('borage'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Budock Root')
                    .setValue('burdock-root'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Burnet')
                    .setValue('burnet'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Catmint')
                    .setValue('catmint'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Cobwebs')
                    .setValue('cobwebs'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Comfrey')
                    .setValue('comfrey'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Curly Dock')
                    .setValue('curly-dock'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Eyebright')
                    .setValue('eyebright'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Feverfew')
                    .setValue('feverfew'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Geruanium')
                    .setValue('geruanium'),
                new StringSelectMenuOptionBuilder()
                    .setValue('Lavender')
                    .setLabel('lavender'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Marigold')
                    .setValue('marigold'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Poppy seeds')
                    .setValue('poppy-seeds'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Sea Buckthorn')
                    .setValue('sea-buckthorn'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Tansy')
                    .setValue('tansy'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Wild Garlic')
                    .setValue('wild-garlic'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Willow Bark')
                    .setValue('willow-bark'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Yarrow')
                    .setValue('yarrow'), 
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
            .setDescription('The amount of herbs you are submitting')
            .setTextInputComponent(amountInput)

        modal.addLabelComponents(nameLabel, clanLabel, herbLabel, amountLabel);
        await interaction.showModal(modal); 

        //wait for the modal to be submitted
        const filter = (interaction) => interaction.customId === `herbSubmmission-${interaction.user.id}`;

        interaction
            .awaitModalSubmit({ filter, time: 3600000 })
            .then((ModalSubmitInteraction) => {
                const name = ModalSubmitInteraction.fields.getTextInputValue('nameInput')
                const clan = ModalSubmitInteraction.fields.getStringSelectValues('clanSelect')
                const amount = ModalSubmitInteraction.fields.getTextInputValue('amountInput')
                
                if (isValidInt(amount) === false) {
                    return ModalSubmitInteraction.reply('The amount of herbs submitted must be a valid integer.');
                }
                ModalSubmitInteraction.reply(`Your name is: ${name} and you are in ${clan}`)
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