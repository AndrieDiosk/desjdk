const fs = require('fs');
const path = require('path');
const axios = require('axios');

const commandList = [];
const descriptions = [];
const commands = new Map();

module.exports.config = {
  name: 'persistent_menu',
  author: 'Cliff',
  version: '1.0',
  description: '',
  selfListen: false,
};

module.exports.run = async function ({ event }) {
  const commandFiles = fs
    .readdirSync(path.join(__dirname, '../commands'))
    .filter(file => file.endsWith('.js'));

  commandFiles.forEach(file => {
    const command = require(`../commands/${file}`);
    commands.set(command.config.name, command);
    const description = command.config.description || 'No description provided.';
    commandList.push(command.config.name);
    descriptions.push(description);
  });

  await updateMessengerCommands();
};

async function updateMessengerCommands() {
  const commandsPayload = commandList.map((name, index) => ({
    name,
    description: descriptions[index],
  }));

  try {
    const dataCmd = await axios.get(
      `https://graph.facebook.com/v21.0/me/messenger_profile`,
      {
        params: {
          fields: 'commands',
          access_token: `${global.PAGE_ACCESS_TOKEN}`,
        },
      }
    );

    if (dataCmd.data.data[0]?.commands?.length === commandsPayload.length) {
      return;
    }

    await axios.post(
      `https://graph.facebook.com/v21.0/me/messenger_profile?access_token=${global.PAGE_ACCESS_TOKEN}`,
      {
        commands: [
          {
            locale: 'default',
            commands: commandsPayload,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
  }
}

