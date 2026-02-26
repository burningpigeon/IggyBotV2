const {StringSelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, LabelBuilder, StringSelectMenuBuilder, setStringSelectMenuComponent, ModalSubmitInteraction, blockQuote, subtext, codeBlock} = require('discord.js')
const { isValidInt } = require('../utils');
const { getFormattedTimestamp} = require('../utils');
const { processPreySubmission, isPreyValid, isPreyInCategory, submitPrey} = require('../controllers/processPreySubmission')

module.exports = {
    run: async({ interaction}) => {
        const modal = new ModalBuilder({
            customId: `preySubmission-${interaction.user.id}`,
            title: `Prey Submission`,
        });

        const nameInput = new TextInputBuilder()
            .setId(1)
            .setCustomId('nameInput')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Firepaw, Bluestar, Yellowfang..')
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
            .setLabel('Clan')
            .setDescription('The clan you are submitting the herbs to')
            .setStringSelectMenuComponent(clanSelect)

        const preyCategorySelect = new StringSelectMenuBuilder()
            .setId(3)
            .setCustomId('preyCategorySelect')
            .setPlaceholder('Select a type of prey')
            .setRequired(true)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Air')
                    .setValue('air'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Cave')
                    .setValue('cave'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Foliage')
                    .setValue('foliage'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Land')
                    .setValue('land'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Water')
                    .setValue('water'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Wetland')
                    .setValue('wetland'),
            );

        const preyCategoryLabel = new LabelBuilder()
            .setLabel("What category did you roll?")
            .setDescription('Select the category you rolled from the dropdown')
            .setStringSelectMenuComponent(preyCategorySelect)

        const preyInput = new TextInputBuilder()
            .setId(4)
            .setCustomId('preyInput')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('The prey you caught i.e. Wren, Pigeon, Mouse etc)')
            .setRequired(true)

        const preyLabel = new LabelBuilder()
            .setLabel('What is your cats name?')
            .setDescription('The name of the cat who you are submitting herbs under')
            .setTextInputComponent(preyInput)

        const sizeInput = new StringSelectMenuBuilder()
            .setId(5)
            .setCustomId('sizeInput')
            .setPlaceholder('Select the size of the prey')
            .setRequired(true)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('1 (Normal)')
                    .setValue('1'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('2 (Nat 20/Double Prey)')
                    .setValue('2'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('4 (Nat 20 & Favored prey OR Nat 20 in Double Prey)')
                    .setValue('4'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('8 (Nat 20, Favored prey in Double Prey)' )
                    .setValue('8'),
            );

        const sizeLabel = new LabelBuilder()
            .setLabel('The size of the prey')
            .setDescription('1 = Normal, 2 = Nat 20')
            .setStringSelectMenuComponent(sizeInput)

        modal.addLabelComponents(nameLabel, clanLabel, preyCategoryLabel, preyLabel, sizeLabel);
        await interaction.showModal(modal); 

        //wait for the modal to be submitted
        const filter = (interaction) => interaction.customId === `preySubmission-${interaction.user.id}`;

        interaction
            .awaitModalSubmit({ filter, time: 360000 })
            .then(async(ModalSubmitInteraction) => {
                const time = getFormattedTimestamp();
                const name = ModalSubmitInteraction.fields.getTextInputValue('nameInput');
                const clan = ModalSubmitInteraction.fields.getStringSelectValues('clanSelect')[0];
                const preyCategory = ModalSubmitInteraction.fields.getStringSelectValues('preyCategorySelect')[0];
                const prey = ModalSubmitInteraction.fields.getTextInputValue('preyInput');
                const size = ModalSubmitInteraction.fields.getStringSelectValues('sizeInput')[0];

                const header = `:meat_on_bone: **Prey Submission** :meat_on_bone:`;

                try {
                    const result = await submitPrey(time, name, clan, prey, preyCategory, size);
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
        name: 'prey-submission',
        description: 'Submits prey to the backend'
    }
}