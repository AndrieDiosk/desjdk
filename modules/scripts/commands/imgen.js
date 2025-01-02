const axios = require("axios");

module.exports.config = {
  name: "imgen",
  author: "Yan Maglinte",
  version: "1.0",
  category: "Utility",
  description: "Generate images from DALL-E openai.",
  adminOnly: false, 
  usePrefix: false,
  cooldown: 5,
};

module.exports.run = async function ({ event, args }) {
  const senderId = event.sender.id;

  if (!args || !Array.isArray(args) || args.length === 0) {
    await api.sendMessage('Please provide a prompt for image generation.', senderId);
    return;
  }

  const prompt = args.join(' ');

  try {

    const apiUrl = `https://imgen.duck.mom/prompt/${encodeURIComponent(prompt)}`;

const im = await axios.get(apiUrl);
const yawa = im.data.imageUrl;

    await api.graph({
      recipient: { id: senderId },
      message: {
        attachment: {
          type: 'image',
          payload: {
            url: apiUrl,
            is_reusable: true
          }
        }
      }
    });
  } catch (err) {
    await api.sendMessage('An error occurred while generating the image. Please try again later.', senderId);
  }
};
