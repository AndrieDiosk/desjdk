const axios = require("axios");

module.exports.config = {
  name: "trans",
  author: "Cliff",
  version: "1.0",
  category: "media",
  description: "",
  adminOnly: false,
  usePrefix: false,
  cooldown: 5,
};

module.exports.run = async ({ event, args}) => {
  const targetLanguage = args[0];

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

  const content = args.slice(1).join(" ");
  try {
    if (content.length === 0 && event.type !== "message_reply") {
      return api.sendMessage(`Please provide a text to translate or reply to a message.\n\nExample: trans tl what is life`, event.sender.id);
    }

    let translateThis, lang;
    if (event.type === "message_reply" && event.message.reply_to) {
      translateThis = await getMessage(event.message.reply_to.mid);;
      lang = targetLanguage || 'tl';
    } else {
      translateThis = content;
      lang = targetLanguage || 'tl';
    }

    const response = await axios.get(`https://translate.googleapis.com/translate_a/single`, {
      params: {
        client: "gtx",
        sl: "auto",
        tl: lang,
        dt: "t",
        q: translateThis
      }
    });

    const retrieve = response.data;
    let text = '';
    retrieve[0].forEach(item => (item[0]) ? text += item[0] : '');
    const fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0];

    api.sendMessage(`Translation: ${text}\n - Translated from ${fromLang} to ${lang}`, event.sender.id);
  } catch (error) {
    api.sendMessage("An error has occurred!", event.sender.id);
  }
};