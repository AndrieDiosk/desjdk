const fs = require("fs");
const path = require("path");
const config = require("../config.json");
const { getTheme } = require("../website/web.js");
const cooldowns = {};

const bannedKeywords = [  'pussy', 'dick', 'nude', 'xnxx', 'pornhub', 'hot', 'clothes', 'sugar', 'fuck', 'fucked', 'step',
  'shit', 'bitch', 'hentai', 'sex', 'boobs', 'cute girl undressed', 'undressed', 
  'naked', 'underwear', 'sexy', 'panty', 'fuckers', 'fck', 'fucking', 'vagina', 'intercourse', 
  'penis', 'gae', 'panties', 'fellatio', 'blow job', 'blow', 'skin', 'segs', 'porn', 'loli', 'kantutan','lulu', 'kayat', 'bilat',
  'ahegao', 'dildo', 'vibrator', 'asses', 'butt', 'asshole', 'cleavage', 'arse', 'dic', 'puss'];

function escapeRegex(keyword) {
  return keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = async function (event) {
  const modulesPath = path.join(__dirname, "../modules/scripts/commands");
  const eventsPath = path.join(__dirname, "../modules/scripts/events");
  const commandFiles = fs.readdirSync(modulesPath).filter(file => file.endsWith(".js"));

  const isAdmin = config.ADMINS.includes(event.sender.id);

  if (event?.message?.is_echo) {
    event.sender.id = event.recipient.id;
  }

  const messageText = event.message?.text || event.postback?.title || "";
  const [rawCommandName, ...args] = messageText.split(" ");

  const containsBannedKeyword = bannedKeywords.some(keyword => {
    const pattern = new RegExp(`\\b${escapeRegex(keyword)}\\b`, 'i');
    return pattern.test(messageText);
  });

  if (containsBannedKeyword) {
    await api.graph({
      recipient: { id: event.sender.id },
      message: { text: '🚫 Your prompt contains inappropriate content. Please try again with a different prompt.' }
    });
    return;
  }

  for (const file of commandFiles) {
    const commandPath = path.join(modulesPath, file);
    const command = require(commandPath);

    if (command && command.config && typeof command.config.name === "string") {
      let commandName;

      if (command.config.usePrefix) {
        if (rawCommandName.startsWith(config.PREFIX)) {
          commandName = rawCommandName.slice(config.PREFIX.length).toLowerCase();
        } else {
          continue;
        }
      } else {
        commandName = rawCommandName.toLowerCase();

        if (rawCommandName.startsWith(config.PREFIX + command.config.name) && !command.config.usePrefix) {
          api.sendMessage(`The "${command.config.name}" command does not require a prefix. Please try again without it.`, event.sender.id);
          continue;
        }
      }

      if (commandName === command.config.name.toLowerCase() && command.config.adminOnly && !isAdmin) {
        api.sendMessage("You do not have permission to use this command.", event.sender.id);
        continue;
      }

      if (command.config.name.toLowerCase() === commandName) {
        const cooldownTime = command.config.cooldown || 0;
        const userCooldown = cooldowns[event.sender.id] || {};
        const lastUsed = userCooldown[command.config.name] || 0;
        const now = Date.now();

        if (cooldownTime > 0 && now - lastUsed < cooldownTime * 1000) {
          const remainingTime = Math.ceil((cooldownTime * 1000 - (now - lastUsed)) / 1000);
          api.sendMessage(`Please wait ${remainingTime} second(s) before using this command again.`, event.sender.id);
          return;
        }

        cooldowns[event.sender.id] = {
          ...userCooldown,
          [command.config.name]: now
        };

        console.log(getTheme().gradient(`SYSTEM:`), `${command.config.name} command was executed!`);
        try {
          await command.run({ event, args });
        } catch (error) {
          console.error(`Error executing ${command.config.name}:`, error);
        }
      }
    } else {
      console.log(`Skipped command: ${file} - missing or invalid config.`);
    }
  }

  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));
  for (const file of eventFiles) {
    const eventModulePath = path.join(eventsPath, file);
    const ev = require(eventModulePath);

    if (!ev.config?.selfListen && event.message?.is_echo) return;

    try {
      await ev.run({ event, args });
    } catch (error) {
      console.error(`Error executing event handler ${file}:`, error);
    }
  }
};

