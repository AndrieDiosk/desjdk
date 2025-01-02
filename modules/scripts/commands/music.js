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
  description: "search music from YouTube",
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
const videoSearchUrl = `https://betadash-search-download.vercel.app/yt?search=${encodeURIComponent(query)}`;
      const music = await axios.get(videoSearchUrl, { headers });
      const mp3 = music.data[0];

    const audioUrl = mp3.url;

      const shesh = `https://yt-video-production.up.railway.app/ytdl?url=${encodeURIComponent(audioUrl)}`;
      const response = await axios.get(shesh, { headers });
      const { audio, title, thumbnail, duration } = response.data;

 if (!audio) {
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
                subtitle: `Duration: ${duration.label} (${duration.seconds}s)`,
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

    const headResponse = await axios.head(audio, { headers });
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
                  url: audio,
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
              url: audio,
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

