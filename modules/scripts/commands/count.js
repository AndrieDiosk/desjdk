const axios = require('axios');

module.exports.config = {
  name: "count",
  author: "Cliff",
  version: "1.0",
  category: "utility",
  description: "Counts the number of words, paragraphs, and alphanumeric characters in a given input string.",
  adminOnly: false,
  usePrefix: false,
  cooldown: 5,
};

module.exports.run = async function ({ event, args }) {
  const getMessage = async (mid) => {
    if (!mid) return null;
    try {
      const { data } = await axios.get(`https://graph.facebook.com/v21.0/${mid}?fields=message&access_token=${global.PAGE_ACCESS_TOKEN}`);
      return data.message;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  let content = "";

  if (event.type === "message_reply" && event.message) {
    content = await getMessage(event.message.reply_to.mid);
  } else if (args && args.length > 0) {
    content = args.join(" ");
  }

  if (!content) {
    api.sendMessage('Please provide text to count or reply to a message.', event.sender.id);
    return;
  }


  const wordCount = content.split(/\s+/).length;
  const paragraphCount = (content.match(/\n\n/g) || []).length + 1; 
  const alphanumericCount = (content.match(/[a-zA-Z0-9]/g) || []).length;

  api.sendMessage(`❯ There are ${wordCount} word(s), ${paragraphCount} paragraph(s), and ${alphanumericCount} alphanumeric character(s) in your input.`, event.sender.id);
};
