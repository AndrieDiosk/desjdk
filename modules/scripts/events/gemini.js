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

const fontMapping = {
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚',
    'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡',
    'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨',
    'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴',
    'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',
    'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂',
    'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇'
};

function convertToBold(text) {
    return text.replace(/(?:\*\*(.*?)\*\*|## (.*?)|### (.*?))/g, (match, boldText, h2Text, h3Text) => {
        const targetText = boldText || h2Text || h3Text;
        return [...targetText].map(char => fontMapping[char] || char).join('');
    });
}


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

async function getMessage(mid) {
  return await new Promise(async (resolve, reject) => {
    if (!mid) resolve(null);
    await axios.get(`https://graph.facebook.com/v21.0/${mid}?fields=message&access_token=${global.PAGE_ACCESS_TOKEN}`).then(data => {
      resolve(data.data.message);
    }).catch(err => {
      reject(err);
    });
  });
}

  let content = "";

if (event.type === "message_reply" && event.message) {
content = await getMessage(event.message.reply_to.mid);
}
const combinedContent = content ? `${messageText} ${content}` : messageText;

async function getAttachments(mid) {
    if (!mid) return;

    try {
      const { data } = await axios.get(`https://graph.facebook.com/v21.0/${mid}/attachments`, {
        params: { access_token: global.PAGE_ACCESS_TOKEN}
     });

      if (data && data.data.length > 0) {
        const attachment = data.data[0];

        if (attachment.image_data) return attachment.image_data.url;
        if (attachment.video_data) return attachment.video_data.url;
        if (attachment.animated_image_data) return attachment.animated_image_data.url;
   if (attachment.file_url) return attachment.file_url;    
      }
    } catch (error) {
    }
  }

let imageUrl = '';

if (event.message && event.message.attachments) {
    imageUrl = event.message.attachments[0].payload.url || null;
  }

  if (event.message && event.message.reply_to && event.message.reply_to.mid) {
    try {
      imageUrl = await getAttachments(event.message.reply_to.mid, `${global.PAGE_ACCESS_TOKEN}`);
    } catch (error) {
      imageUrl = ''; 
    }
  }  

const god = "who is jesus?";
const teach = "can you teach me";
const intro = "Can you tell me more about yourself?";
const owner = "who is your owner?";
const apis =  "what is your api?";

 if (
    !regEx_tiktok.test(messageText) &&
    !facebookLinkRegex.test(messageText) &&
    !instagramLinkRegex.test(messageText) &&
    !youtubeLinkRegex.test(messageText) &&
    !spotifyLinkRegex.test(messageText) &&
    !soundcloudRegex.test(messageText) &&
    !capcutLinkRegex.test(messageText) &&
!messageText.match(/^trans(\s+.+)?$/i) &&
!messageText.match(/^tempmail(\s+.+)?$/i) &&
!messageText.match(/^Tempmail(\s+.+)?$/i) &&
!messageText.match(/^imgen(\s+.+)?$/i) &&
!messageText.match(/^Imgen(\s+.+)?$/i) &&
!messageText.match(/^upscale(\s+.+)?$/i) &&
!messageText.match(/^Upscale(\s+.+)?$/i) &&
!messageText.match(/^random(\s+.+)?$/i) &&
!messageText.match(/^count(\s+.+)?$/i) &&
!messageText.match(/^Count(\s+.+)?$/i) &&
!messageText.match(/^Random(\s+.+)?$/i) &&
!messageText.match(/^humanize(\s+.+)?$/i) &&
!messageText.match(/^Humanize(\s+.+)?$/i) &&
!messageText.match(/^aidetect(\s+.+)?$/i) &&
!messageText.match(/^Aidetect(\s+.+)?$/i) &&
!messageText.match(/^Trans(\s+.+)?$/i) &&
!messageText.match(/^blackbox(\s+.+)?$/i) &&
!messageText.match(/^Blackbox(\s+.+)?$/i) &&
!messageText.match(/^say(\s+.+)?$/i) &&
!messageText.match(/^Say(\s+.+)?$/i) &&
    !messageText.match(/^eval\s+.+;/i) &&
    !messageText.match(/^Eval\s+.+;/i) &&
    !messageText.match(/^help(\s+.+)?$/i) &&
    !messageText.match(/^Help(\s+.+)?$/i) &&
    !messageText.match(/^flux(\s+.+)?$/i) &&
    !messageText.match(/^Flux(\s+.+)?$/i) &&
    !messageText.match(/^imagine(\s+.+)?$/i) &&
    !messageText.match(/^Imagine(\s+.+)?$/i) &&
    !messageText.match(/^id(\s+.+)?$/i) &&
    !messageText.match(/^Id(\s+.+)?$/i) &&
    !messageText.match(/^music(\s+.+)?$/i) &&
    !messageText.match(/^Music(\s+.+)?$/i) &&
    !messageText.match(/^shoti(\s+.+)?$/i) &&
    !messageText.match(/^Shoti(\s+.+)?$/i) &&
    !messageText.match(/^getlink(\s+.+)?$/i) &&
    !messageText.match(/^Getlink(\s+.+)?$/i) &&
    god !== messageText &&
    teach !== messageText &&
    intro !== messageText &&
    owner !== messageText &&
    apis !== messageText
  ) {
    try {
let text;
    if (imageUrl) {
const imgurApiUrl = `https://betadash-uploader.vercel.app/imgur?link=${encodeURIComponent(imageUrl)}`;
        const imgurResponse = await axios.get(imgurApiUrl, { headers } );
        const imgurLink = imgurResponse.data.uploaded.image;
        const apiUrl = `https://kaiz-apis.gleeze.com/api/gemini-vision?q=${encodeURIComponent(combinedContent)}&uid=${senderId}&&imageUrl=${imgurLink}`;
        const response = await axios.get(apiUrl, { headers });
        text = convertToBold(response.data.response);
      } else {
        const api = `https://kaiz-apis.gleeze.com/api/gemini-vision?q=${encodeURIComponent(combinedContent)}&uid=${senderId}`;
        const response = await axios.get(api, { headers });
        text = convertToBold(response.data.response);
  }
      api.sendMessage(text, event.sender.id);
    } catch (error) {
      api.sendMessage(error.message, event.sender.id);
    }
  }
};

