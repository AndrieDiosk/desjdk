const axios = require("axios");

module.exports.config = {
  name: "upscale",
  author: "Yan Maglinte",
  version: "1.0",
  category: "Tools",
  description: "Image enhancer.",
  adminOnly: false, 
  usePrefix: false,
  cooldown: 5,
};

module.exports.run = async function ({ event, args }) {
  const senderId = event.sender.id;

    if (!event || !event.sender || !event.message || !event.sender.id) {
    return;
  }

if (!event.message.reply_to || !event.message.reply_to.mid) {
    await api.sendMessage('Reply to an image', event.sender.id);
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


  try {
    await api.sendMessage("⌛ Enhancing image Please wait...", senderId);

    const apiUrl = `https://yt-video-production.up.railway.app/upscale?imageUrl=${encodeURIComponent(imageUrl)}`;

const im = await axios.get(apiUrl);
const yawa = im.data.imageUrl;

    await api.graph({
      recipient: { id: senderId },
      message: {
        attachment: {
          type: 'image',
          payload: {
            url: yawa,
            is_reusable: true
          }
        }
      }
    });
  } catch (err) {
    await api.sendMessage(err, senderId);
  }
};
