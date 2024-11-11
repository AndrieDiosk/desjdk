const axios = require('axios');
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  'Content-Type': 'application/json',
};

module.exports.config = {
  name: "music",
  author: "Yan Maglinte",
  version: "1.0",
  category: "Media",
  description: "",
  adminOnly: false, 
  usePrefix: false,
  cooldown: 5,
};

module.exports.run = async function ({ event, args}) {
  const senderId = event.sender.id;
  const query = args.join(' ');

  if (!query) {
    await api.graph({
      recipient: { id: senderId },
      message: { text: 'Please provide the name of the music you want to search' }
    });
    return;
  }

  try {
    const apiUrl = `https://dlvc.vercel.app/yt-audio?search=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl, { headers });
    const { downloadUrl, title, time, thumbnail, views } = response.data;

    if (!downloadUrl) {
      await api.graph({
        recipient: { id: senderId },
        message: { text: `Sorry, no download link found for "${query}"` }
      });
      return;
    }

    await api.graph({
      recipient: { id: senderId },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: title,
                image_url: thumbnail,
                subtitle: `Views: ${views} - Duration: ${time}`,
                default_action: {
                  type: "web_url",
                  url: thumbnail,
                  webview_height_ratio: "tall"
                }
              }
            ]
          }
        }
      }
    });

    const headResponse = await axios.head(downloadUrl, { headers });
    const fileSize = parseInt(headResponse.headers['content-length'], 10);

    if (fileSize > 25 * 1024 * 1024) {
      await api.graph({
        recipient: { id: senderId },
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: `Error: The audio file exceeds the 25 MB limit and cannot be sent.`,
              buttons: [
                {
                  type: 'web_url',
                  url: downloadUrl,
                  title: 'Download URL'
                }
              ]
            }
          }
        }
      });
    } else {
      await api.graph({
        recipient: { id: senderId },
        message: {
          attachment: {
            type: 'audio',
            payload: {
              url: downloadUrl,
              is_reusable: true
            }
          }
        }
      });
    }
  } catch (error) {
    await api.graph({
      recipient: { id: senderId },
      message: { text: 'Music not found. Please try again.' }
    });
  }
};
