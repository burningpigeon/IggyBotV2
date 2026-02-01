const {StringSelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, LabelBuilder, StringSelectMenuBuilder, setStringSelectMenuComponent} = require('discord.js')

module.exports = {
    run: async({ interaction}) => {
        const modal = new ModalBuilder({
            customId: `new Modal-${interaction.user.id}`,
            title: `new Modal`,
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

        const herbSelect = new StringSelectMenuBuilder()
            .setId(2)
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

        modal.addLabelComponents(nameLabel, herbLabel);
        await interaction.showModal(modal);
        
    },  


    data: {
        name: 'herb-submission',
        description: 'Submits herbs to the backend'
    }
}