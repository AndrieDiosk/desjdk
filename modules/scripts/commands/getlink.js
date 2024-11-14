const axios = require("axios");

module.exports.config = {
  name: "getlink",
  author: "Cliff",
  version: "1.0",
  category: "media",
  description: "getlink attachment",
  adminOnly: false, 
  usePrefix: false,
  cooldown: 5,
};

module.exports.run = async function({ event, args }) {
  if (!event || !event.sender || !event.message || !event.sender.id) {
    return;
  }

if (!args || !Array.isArray(args) || args.length === 0) {
    await api.sendMessage('Reply to image, video, GIF, or audio', event.sender.id);
    return;
  }

  async function getAttachments(mid) {
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
if (attachment.audio_data) return attachment.audio_data.url;
      }
    } catch (error) {
    }
  }

let imageUrl = '';

  if (event.message && event.message.attachments) {
    imageUrl = event.message.attachments[0].payload.url || null;
  }

  if (!imageUrl && event.message && event.message.reply_to && event.message.reply_to.mid) {
    imageUrl = await getAttachments(event.message.reply_to.mid);
  }

  if (imageUrl) {
    api.sendMessage(imageUrl, event.sender.id);
  } else {
    api.sendMessage("No valid attachment found.", event.sender.id);
  }
};
