const axios = require("axios");

module.exports.config = {
  name: "say",
  author: "Cliff",
  version: "1.0",
  category: "media",
  description: "Text to voice speech messages",
  adminOnly: false,
  usePrefix: false,
  cooldown: 5,
};

module.exports.run = async ({ event, args}) => {


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
} else if (args && args.length > 0) {
  content = args.join(" ");
}

  if (!content) {
    api.sendMessage('Please provide text to convert to speech', event.sender.id);
    return;
  }

  const downloadUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(content)}&tl=tl&client=tw-ob`;

  await api.graph({
    recipient: { id: event.sender.id },
    message: {
      attachment: {
        type: 'audio',
        payload: {
          url: downloadUrl,
          is_reusable: true,
        },
      },
    },
  });
};

