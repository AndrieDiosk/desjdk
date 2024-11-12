const axios = require('axios');

module.exports.config = {
  name: "shoti",
  author: "Cliff",
  version: "1.0",
  category: "Utility",
  description: "Generate random shawty girl video",
  adminOnly: false,
  usePrefix: false,
  cooldown: 5,
};

module.exports.run = async function({ event, args}) { 
  const apiUrl = `https://betadash-shoti-yazky.vercel.app/shotizxx?apikey=shipazu`;

  try {    
    const response = await axios.get(apiUrl);
    const shotiUrl = response.data.shotiurl;

    if (shotiUrl) {
      const kupal = `𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲: ${response.data.username}\n𝗡𝗶𝗰𝗸𝗻𝗮𝗺𝗲: ${response.data.nickname}\n𝗥𝗲𝗴𝗶𝗼𝗻: ${response.data.region}\n\nSending shawty, wait a sec...`;

      await api.sendMessage(kupal, event.sender.id);

      await api.graph({
        recipient: { id: event.sender.id },
        message: {
          attachment: {
            type: 'video',
            payload: {
              url: shotiUrl,
              is_reusable: true
            }
          },
          quick_replies: [
            {
              content_type: "text",
              title: "shoti",
              payload: "SHOTI"
            },
            {
              content_type: "text",
              title: "help",
              payload: "HELP"
            }
          ]
        }
      });
    } else {
      await api.sendMessage("Sorry, no Shoti video found.", event.sender.id);
    }
  } catch (error) {
    await api.sendMessage("Sorry, there was an error processing your request.", event.sender.id);
  }
};
