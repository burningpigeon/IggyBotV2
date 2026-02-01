const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { Client, IntentsBitField, Events, GatewayIntentBits} = require('discord.js');
const { CommandHandler} = require('djs-commander');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });


client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

new CommandHandler({
    client,
    commandsPath: path.join(__dirname, 'slash-commands'),
});

client.login(process.env.TOKEN);