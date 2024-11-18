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

async function getAttachments(mid, pageAccessToken) {
    if (!mid) return;

    try {
      const { data } = await axios.get(`https://graph.facebook.com/v21.0/${mid}/attachments`, {
        params: { access_token: global.PAGE_ACCESS_TOKEN }
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
      imageUrl = await getAttachments(event.message.reply_to.mid);
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
const apiUrl = content
  ? `https://haji-mix.onrender.com/google?prompt=${encodeURIComponent(combinedContent)}&model=gemini-1.5-flash&uid=${senderId}&roleplay=&google_api_key=&file_url=${encodeURIComponent(imageUrl)}`
  : `https://haji-mix.onrender.com/gemini?prompt=${encodeURIComponent(combinedContent)}&model=gemini-1.5-flash&uid=${senderId}`;

const response = await axios.get(apiUrl, { headers });
text = response.data.message;
}

      api.sendMessage(text, senderId);
    } catch (error) {
      api.sendMessage(error, senderId);
    }
  }
};

