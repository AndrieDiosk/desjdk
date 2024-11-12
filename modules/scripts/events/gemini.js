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

  let fileUrl = '';

  if (event && event.type === 'message_reply') {
    const kupal = event.reply_to ? event.reply_to.attachments : [];
    fileUrl = encodeURIComponent(kupal);
}



/**const commandEval = "eval";
const eval = commandEval ? commandEval.split(' ') : [];
const commandEvalUpper = "Eval";
const Eval = commandEvalUpper ? commandEvalUpper.split(' ') : [];

const commandHelp = "help";
const help = commandHelp ? commandHelp.split(' ') : [];
const commandHelpUpper = "Help";
const Help = commandHelpUpper ? commandHelpUpper.split(' ') : [];

const commandFlux = "flux";
const flux = commandFlux ? commandFlux.split(' ') : [];
const commandFluxUpper = "Flux";
const Flux = commandFluxUpper ? commandFluxUpper.split(' ') : [];

const commandId = "id";
const id = commandId ? commandId.split(' ') : [];
const commandIdUpper = "Id";
const Id = commandIdUpper ? commandIdUpper.split(' ') : [];

const commandMusic = "music";
const music = commandMusic ? commandMusic.split(' ') : [];
const commandMusicUpper = "Music";
const Music = commandMusicUpper ? commandMusicUpper.split(' ') : [];

const commandShoti = "shoti";
const shoti = commandShoti ? commandShoti.split(' ') : [];
const commandShotiUpper = "Shoti";
const Shoti = commandShotiUpper ? commandShotiUpper.split(' ') : []; **/

if (
  !regEx_tiktok.test(messageText) &&
  !facebookLinkRegex.test(messageText) &&
  !instagramLinkRegex.test(messageText) &&
  !youtubeLinkRegex.test(messageText) &&
  !spotifyLinkRegex.test(messageText) &&
  !soundcloudRegex.test(messageText) &&
  !capcutLinkRegex.test(messageText) &&
  !messageText.match(/^eval(\s+.*)?$/i) &&
  !messageText.match(/^Eval(\s+.*)?$/i) &&
  !messageText.match(/^help(\s+.*)?$/i) &&
  !messageText.match(/^Help(\s+.*)?$/i) &&
  !messageText.match(/^flux(\s+.*)?$/i) &&
  !messageText.match(/^Flux(\s+.*)?$/i) &&
  !messageText.match(/^id(\s+.*)?$/i) &&
  !messageText.match(/^Id(\s+.*)?$/i) && 
  !messageText.match(/^music(\s+.*)?$/i) && 
  !messageText.match(/^Music(\s+.*)?$/i) && 
  !messageText.match(/^shoti(\s+.*)?$/i) && 
  !messageText.match(/^Shoti(\s+.*)?$/i)
) {
    try {
      let text;
      if (fileUrl) {
        const apiUrl = `https://haji-mix.onrender.com/gemini?prompt=${encodeURIComponent(messageText)}&model=gemini-1.5-flash&uid=${senderId}&file_url=${fileUrl}`;
        const response = await axios.get(apiUrl, { headers });
        text = response.data.message;
      } else {
        const apiUrl = `https://haji-mix.onrender.com/gemini?prompt=${encodeURIComponent(messageText)}&model=gemini-1.5-flash&uid=${senderId}`;
        const response = await axios.get(apiUrl, { headers });
        text = response.data.message;
      }

      api.sendMessage(text, senderId);
    } catch (error) {
      api.sendMessage('Error response:\t\t' + error, senderId);
    }
  }
};
