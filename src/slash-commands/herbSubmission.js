const {StringSelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, LabelBuilder, StringSelectMenuBuilder, setStringSelectMenuComponent} = require('discord.js')

module.exports = {
    run: async({ interaction}) => {
        const modal = new ModalBuilder({
            customId: `new Modal-${interaction.user.id}`,
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
            .setStringSelectMenuComponent(clanSelect)

        const herbSelect = new StringSelectMenuBuilder()
            .setId(3)
            .setCustomId('herbSelect')
            .setPlaceholder('Select a herb')
            .setRequired(true)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Alder bark')
                    .setDescription('tree bark oohh')
                    .setValue('alderbark'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Borage')
                    .setDescription('pretty flower')
                    .setValue('borage'),
            );

        const herbLabel = new LabelBuilder()
            .setLabel("What herb are you submitting?")
            .setStringSelectMenuComponent(herbSelect)

        modal.addLabelComponents(nameLabel, clanLabel, herbLabel);
        await interaction.showModal(modal);
        
    },  


    data: {
        name: 'herb-submission',
        description: 'Submits herbs to the backend'
    }
}