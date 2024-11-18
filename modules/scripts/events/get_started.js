const axios = require('axios');

module.exports.config = {
  name: 'get_started',
  author: 'Cliff',
  version: '21.0',
  description: 'GET_STARTED',
  selfListen: false,
};

module.exports.run = async function ({ event }) {
  async function handlePayload(payload) {
    if (payload === "GET_STARTED_PAYLOAD") {
      await api.graph({
        recipient: { id: event.sender.id },
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: "Hello, I'm Tropp! Your friendly AI assistant, here to help with questions, tasks, and more. I'm constantly learning and improving.\n\nType 'help' below 👇 to see available commands",
              buttons: [
                {
                  type: 'web_url',
                  url: "https://www.facebook.com/100066885190578",
                  title: "Like/Follow"
                },
                {
                  type: 'postback',
                  title: "Help",
                  payload: "HELP_PAYLOAD"
                }
              ]
            }
          },
          quick_replies: [
            {
              content_type: "text",
              title: "what is your api?",
              payload: "WHAT_IS_YOUR_API?"
            },
            {
              content_type: "text",
              title: "who is jesus?",
              payload: "WHO_IS_JESUS?"
            },
            {
              content_type: "text",
              title: "can you teach me",
              payload: "CAN_YOU_TEACH_ME"
            },
            {
              content_type: "text",
              title: "who is your owner?",
              payload: "WHO_IS_YOUR_OWNER?"
            }
          ]
        }
      });
    }
  }

  if (event.postback && event.postback.payload) {
    await handlePayload(event.postback.payload);
  }

  const url = `https://graph.facebook.com/v21.0/me/messenger_profile?access_token=${global.PAGE_ACCESS_TOKEN}`;
  const payload = {
    get_started: { payload: "GET_STARTED_PAYLOAD" },
    greeting: [
      {
        locale: "default",
        text: "Hi {{user_first_name}}! I'm Tropp, your friendly assistant. Ask me anything, and I'll be happy to help!"
      }
    ]
  };

  try {
    await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
  }
};

