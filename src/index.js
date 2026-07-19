const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Client, IntentsBitField, Events, GatewayIntentBits} = require('discord.js');
const { CommandHandler} = require('djs-commander');
const fs = require('fs')

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    fs.writeFileSynx('/tmp/iggybot-ready', Date.now().toString());
});

new CommandHandler({
    client,
    commandsPath: path.join(__dirname, 'slash-commands'),
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

async function shutdown() {
  console.log('Shutting down gracefully...');
  try {
    fs.unlinkSync('/tmp/iggybot-ready'); // clean up so a stale file can't fool the next health check
  } catch (e) { /* file may not exist, that's fine */ }
  await client.destroy();
  process.exit(0);
}

client.login(process.env.TOKEN);