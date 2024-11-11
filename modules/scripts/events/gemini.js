const axios = require('axios');
const regEx_tiktok = /https:\/\/(www\.|vt\.)?tiktok\.com\//;
const facebookLinkRegex = /https:\/\/www\.facebook\.com\/\S+/;
const instagramLinkRegex = /https:\/\/www\.instagram\.com\/reel\/[a-zA-Z0-9_-]+\/\?igsh=[a-zA-Z0-9_=-]+$/;
const youtubeLinkRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
const spotifyLinkRegex = /^https?:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]+$/;
const soundcloudRegex = /^https?:\/\/soundcloud\.com\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)(?:\/([a-zA-Z0-9-]+))?(?:\?.*)?$/;
const capcutLinkRegex = /https:\/\/www\.capcut\.com\/t\/[A-Za-z0-9]+/;
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  'Content-Type': 'application/json'
};
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: 'gemini',
  author: 'Cliff',
  version: '1.0',
  description: 'Provide a text or reply by a photo',
  selfListen: false,
};

module.exports.run = async function({ event, args }) {
  if (!event || !event.sender || !event.message || !event.sender.id) {
    return;
  }

  const messageText = event.message.text;
  const senderId = event.sender.id;
  let imageUrl = '';

  if (event.type === 'message_reply' && event.message.reply_to && event.message.reply_to.attachments) {
    const imageAttachment = event.message.reply_to.attachments.find(att => att.type === 'image');
    if (imageAttachment && imageAttachment.payload && imageAttachment.payload.url) {
      imageUrl = imageAttachment.payload.url;
    }
  }

  if (!regEx_tiktok.test(messageText) &&
      !facebookLinkRegex.test(messageText) &&
      !instagramLinkRegex.test(messageText) &&
      !youtubeLinkRegex.test(messageText) &&
      !spotifyLinkRegex.test(messageText) &&
      !soundcloudRegex.test(messageText) &&
      !capcutLinkRegex.test(messageText)) {

    const commandsPath = path.join(__dirname, "../commands");
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));

    if (args.length > 0 && isNaN(args[0])) {
      const commandName = args[0].toLowerCase();
      const commandFile = commandFiles.find(file => file.replace('.js', '') === commandName);

      if (commandFile) {
        const command = require(path.join(commandsPath, commandFile));
        command.config.name(messageText);
      }
    }

    try {
      let text;
      const apiUrl = `https://haji-mix.onrender.com/gemini?prompt=${encodeURIComponent(messageText)}&model=gemini-1.5-flash&uid=${senderId}${imageUrl ? `&file_url=${encodeURIComponent(imageUrl)}` : ''}`;
      const response = await axios.get(apiUrl, { headers });
      text = response.data.message;

      api.sendMessage(text, senderId);
    } catch (error) {
    }
  }
};
