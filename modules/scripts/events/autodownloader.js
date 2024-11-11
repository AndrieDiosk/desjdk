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
  name: 'downloader',
  author: 'Yan Maglinte',
  version: '1.0',
  description: 'autodownloader',
  selfListen: false,
};

module.exports.run = async function({ event, args}) {

if (!event || !event.sender || !event.message || !event.message.text || !event.sender.id)  {
    return;
  }

  const messageText = event.message.text;

  if (instagramLinkRegex.test(messageText)) {
    try {
      api.sendMessage("Downloading Instagram, please wait...", event.sender.id);
      const apiUrl = `https://universaldownloader.zapto.org/download?url=${encodeURIComponent(messageText)}`;
      const response = await axios.get(apiUrl, { headers });
      const videoUrl = response.data.result;

      const headResponse = await axios.head(videoUrl, { headers });
      const fileSize = parseInt(headResponse.headers['content-length'], 10);

      if (fileSize > 25 * 1024 * 1024) {
        api.graph({
          recipient: { id: event.sender.id },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'button',
                text: 'The Instagram video exceeds the 25 MB limit and cannot be sent.',
                buttons: [
                  {
                    type: 'web_url',
                    url: videoUrl,
                    title: 'Watch Video'
                  }
                ]
              }
            }
          }
        });
      } else {
        api.graph({
          recipient: { id: event.sender.id },
          message: {
            attachment: {
              type: 'video',
              payload: {
                url: videoUrl,
                is_reusable: true
              }
            }
          }
        });
      }
    } catch (error) {}
  } else if (facebookLinkRegex.test(messageText)) {
    try {
      api.sendMessage("Downloading Facebook, please wait...", event.sender.id);
      const apiUrl = `https://betadash-search-download.vercel.app/fbdl?url=${encodeURIComponent(messageText)}`;

      const headResponse = await axios.head(apiUrl, { headers });
      const fileSize = parseInt(headResponse.headers['content-length'], 10);

      if (fileSize > 25 * 1024 * 1024) {
        api.graph({
          recipient: { id: event.sender.id },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'button',
                text: 'The Facebook video exceeds the 25 MB limit and cannot be sent.',
                buttons: [
                  {
                    type: 'web_url',
                    url: apiUrl,
                    title: 'Watch Video'
                  }
                ]
              }
            }
          }
        });
      } else {
        api.graph({
          recipient: { id: event.sender.id },
          message: {
            attachment: {
              type: 'video',
              payload: {
                url: apiUrl,
                is_reusable: true
              }
            }
          }
        });
      }
    } catch (error) {}
  } else if (regEx_tiktok.test(messageText)) {
    try {
      api.sendMessage("Downloading Tiktok, please wait...", event.sender.id);
      const response = await axios.post(`https://www.tikwm.com/api/`, { url: messageText }, { headers });
      const data = response.data.data;
      const shotiUrl = data.play;
      const headResponse = await axios.head(shotiUrl, { headers });
      const fileSize = parseInt(headResponse.headers['content-length'], 10);

      if (fileSize > 25 * 1024 * 1024) {
        api.graph({
          recipient: { id: event.sender.id },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'button',
                text: 'The Tiktok video exceeds the 25 MB limit and cannot be sent.',
                buttons: [
                  {
                    type: 'web_url',
                    url: shotiUrl,
                    title: 'Watch Video'
                  }
                ]
              }
            }
          }
        });
      } else {
        api.graph({
          recipient: { id: event.sender.id },
          message: {
            attachment: {
              type: 'video',
              payload: {
                url: shotiUrl,
                is_reusable: true
              }
            }
          }
        });
      }
    } catch (error) {}
  } else if (youtubeLinkRegex.test(messageText)) {
    try {
      api.sendMessage("Downloading Youtube, please wait...", event.sender.id);
      const yts = `https://apiv2.kenliejugarap.com/video?url=${encodeURIComponent(messageText)}`;
      const yu = await axios.get(yts, { headers });
      const vid = yu.data.response;
      const title = yu.data.title;

      const kupal = `🎥 Now playing\n\n𝗧𝗶𝘁𝗹𝗲: ${title}`;
      api.sendMessage(kupal, event.sender.id);

      const headResponse = await axios.head(vid, { headers });
      const fileSize = parseInt(headResponse.headers['content-length'], 10);

      if (fileSize > 25 * 1024 * 1024) {
        api.graph({
          recipient: { id: event.sender.id },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'button',
                text: 'The YouTube video exceeds the 25 MB limit and cannot be sent.',
                buttons: [
                  {
                    type: 'web_url',
                    url: vid,
                    title: 'Watch Video'
                  }
                ]
              }
            }
          }
        });
      } else {
        api.graph({
          recipient: { id: event.sender.id },
          message: {
            attachment: {
              type: 'video',
              payload: {
                url: vid,
                is_reusable: true
              }
            }
          }
        });
      }
    } catch (error) {}
  } else if (spotifyLinkRegex.test(messageText)) {
    try {
      api.sendMessage("Downloading Spotify, please wait...", event.sender.id);
      const apiUrl = `https://betadash-search-download.vercel.app/spotifydl?url=${encodeURIComponent(messageText)}`;
      const response = await axios.get(apiUrl, { headers });
      const spotifyLink = response.data.result;

      if (spotifyLink) {
        api.graph({
          recipient: { id: event.sender.id },
          message: {
            attachment: {
              type: 'audio',
              payload: {
                url: spotifyLink,
                is_reusable: true
              }
            }
          }
        });
      }
    } catch (error) {}
  } else if (soundcloudRegex.test(messageText)) {
    try {
      api.sendMessage("Downloading SoundCloud, please wait...", event.sender.id);
      const sc = `https://betadash-search-download.vercel.app/soundcloud?url=${encodeURIComponent(messageText)}`;

      const response = await axios.get(sc, { headers });
      const { download, thumbnail, quality, duration, title } = response.data;

      api.graph({
        recipient: { id: event.sender.id },
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [
                {
                  title: title,
                  image_url: thumbnail,
                  subtitle: `Quality: ${quality} - Duration: ${duration}`,
                  default_action: {
                    type: 'web_url',
                    url: thumbnail,
                    webview_height_ratio: 'tall'
                  }
                }
              ]
            }
          }
        }
      });

      const headResponse = await axios.head(download, { headers });
const fileSize = parseInt(headResponse.headers['content-length'], 10);

if (fileSize > 25 * 1024 * 1024) {
  api.graph({
    recipient: { id: event.sender.id },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: 'The audio file exceeds the 25 MB limit and cannot be sent.',
          buttons: [
            {
              type: 'web_url',
              url: download,
              title: 'Download URL'
            }
          ]
        }
      }
    }
  });
} else {
  api.graph({
    recipient: { id: event.sender.id },
    message: {
      attachment: {
        type: 'audio',
        payload: {
          url: download,
          is_reusable: true
        }
      }
    }
  });
}

if (capcutLinkRegex.test(messageText)) {
  api.sendMessage("Downloading Capcut, please wait...", event.sender.id);
  const capct = `https://betadash-search-download.vercel.app/capcutdl?link=${encodeURIComponent(messageText)}`;

  const response = await axios.get(capct, { headers });
  const { title, description, digunakan, video_ori, author_profile, cover } = response.data.result;

  const kupal = `𝗧𝗶𝘁𝗹𝗲: ${title}\n𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${description}\n𝗧𝗲𝗺𝗽𝗹𝗮𝘁𝗲-𝗨𝘀𝗲𝗱: ${digunakan}`;
  api.sendMessage(kupal, event.sender.id);

  const headResponseCapcut = await axios.head(video_ori, { headers });
  const fileSizeCapcut = parseInt(headResponseCapcut.headers['content-length'], 10);

  if (fileSizeCapcut > 25 * 1024 * 1024) {
    api.graph({
      recipient: { id: event.sender.id },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: title,
                image_url: cover,
                subtitle: `Description: ${description} Used: ${digunakan}`,
                default_action: {
                  type: "web_url",
                  url: cover,
                  webview_height_ratio: "tall"
                },
                buttons: [
                  {
                    type: "web_url",
                    url: video_ori,
                    title: "Download Video"
                  },
                  {
                    type: "web_url",
                    url: author_profile,
                    title: "Author Profile"
                  }
                ]
              }
            ]
          }
        }
      }
    });
  } else {
    api.graph({
      recipient: { id: event.sender.id },
      message: {
        attachment: {
          type: 'video',
          payload: {
            url: video_ori,
            is_reusable: true
          }
        }
      }
    });
  }
 }
} catch (error) {
   }
 }
}
