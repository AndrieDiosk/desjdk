const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "help",
  author: "Yan Maglinte",
  version: "1.0",
  category: "Utility",
  description: "Lists all commands and events.",
  adminOnly: false,
  usePrefix: false,
  cooldown: 5,
};

const commandsPerPage = 20;

module.exports.run = function ({ event, args}) {
  const commandsPath = path.join(__dirname, "../commands");
  const eventsPath = path.join(__dirname, "../events");

  if (event.type === "message" || event.postback.payload === "HELP_PAYLOAD") {
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));

    if (args.length > 0 && isNaN(args[0])) {
      const commandName = args[0].toLowerCase();
      const commandFile = commandFiles.find(file => file.replace('.js', '') === commandName);

      if (commandFile) {
        const command = require(path.join(commandsPath, commandFile));
        const name = command.config.name ? `➟ Name: ${command.config.name}\n` : "";
        const author = command.config.author ? `➟ Author: ${command.config.author}\n` : "";
        const version = command.config.version ? `➟ Version: ${command.config.version}\n` : "";
        const category = command.config.category ? `➟ Category: ${command.config.category}\n` : "";
        const description = command.config.description ? `➟ Description: ${command.config.description}\n` : "";
        const adminOnly = `➟ Admin Only: ${command.config.adminOnly}\n`;
        const usePrefix = `➟ Use Prefix: ${command.config.usePrefix}\n`;
        const cooldown = `➟ Cooldown: ${command.config.cooldown} seconds\n`;
        const commandDetails = `${name}${author}${version}${category}${description}${adminOnly}${usePrefix}${cooldown}`;

        return api.sendMessage(commandDetails, event.sender.id);
      } else {
        return api.sendMessage(`❌ Command not found: ${commandName}`, event.sender.id);
      }
    }

    const pageNumber = parseInt(args[0]) || 1;
    const totalPages = Math.ceil(commandFiles.length / commandsPerPage);
    const startIndex = (pageNumber - 1) * commandsPerPage;
    const endIndex = startIndex + commandsPerPage;

    let message = "╭─❍「 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 」\n";
    commandFiles.slice(startIndex, endIndex).forEach((file) => {
      const command = require(path.join(commandsPath, file));
      if (command.config) {
        message += `│ ✦ ${command.config.name}\n`;
      }
    });

    message += `├─❍「 𝗘𝗩𝗘𝗡𝗧𝗦 」\n`;
    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith(".js"));
    eventFiles.forEach((file) => {
      const event = require(path.join(eventsPath, file));
      if (event.config) {
        message += `│ ✦ ${event.config.name}\n`;
      }
    });

    message += "├────────⋆☾⋆\n";
    message += `│» Page: <${pageNumber}/${totalPages}>\n│» Total Commands: [ ${commandFiles.length} ]\n╰─────────⧕`;

    api.sendMessage(message, event.sender.id);
  }
};
