const axios = require('axios');

module.exports.config = {
  name: "blackbox",
  author: "Cliff",
  version: "1.0",
  category: "media",
  description: "Blackbox Large language model",
  adminOnly: false,
  usePrefix: false,
  cooldown: 5,
};

module.exports.run = async function ({ event, args }) {

    const prompt = args.join(' ');

    if (!prompt) {
        api.sendMessage("Please provide a question first!", event.sender.id);
        return;
    }

    const symbols = ["⎔", "☰", "⿻"];
    const randomIndex = Math.floor(Math.random() * symbols.length);
    const symbol = symbols[randomIndex];

    try {
        api.sendMessage("🔍 Searching, Please Wait....", event.sender.id);

        const apiUrl = `https://yt-video-production.up.railway.app/blackbox?ask=${encodeURIComponent(prompt)}`;
        const response = await axios.get(apiUrl);
        const text = response.data.Response;

        const formattedResponse = `${symbol} | 𝗕𝗟𝗔𝗖𝗞𝗕𝗢𝗫 𝗔𝗜\n━━━━━━━━━━━━\n${text}\n━━━━━━━━━━━━`;

        await api.sendMessage(formattedResponse, event.sender.id);
    } catch (error) {
        api.sendMessage("Sorry, there was an error processing your request.", event.sender.id);
    }
};
