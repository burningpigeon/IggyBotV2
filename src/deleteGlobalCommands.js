const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const rest = new REST().setToken(process.env.TOKEN);

async function deleteGlobalCommands() {
  try {
    const commands = await rest.get(Routes.applicationCommands(process.env.CLIENT_ID));
    console.log(`Found ${commands.length} global commands. Deleting...`);
    
    for (const cmd of commands) {
      await rest.delete(Routes.applicationCommand(process.env.CLIENT_ID, cmd.id));
      console.log(`✓ Deleted: ${cmd.name}`);
    }
    
    console.log('\nDone! All global commands deleted.');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

deleteGlobalCommands();
