const axios = require('axios');

module.exports.config = {
  name: 'get_started',
  author: 'Cliff',
  version: '21.0',
  description: 'GET_STARTED',
  selfListen: false,
};

module.exports.run = async function ({ event }) {
  function handlePayload(payload) {
    if (payload === "GET_STARTED_PAYLOAD") {
      api.graph({
        recipient: { id: event.sender.id },
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: "Hello, I'm Tropp! Your friendly AI assistant, here to help with questions, tasks, and more. I'm constantly learning and improving. \n\nType 'help' below 👇 to see available commands",
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
             title: "Can you tell me more about yourself?",
             payload: "CAN_YOU_TELL_ME_MORE_ABOUT_YOURSELF?"
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
    handlePayload(event.postback.payload);
  }

  const url = `https://graph.facebook.com/v21.0/me/messenger_profile?access_token=${global.PAGE_ACCESS_TOKEN}`;
  const payload = {
    get_started: { payload: "GET_STARTED_PAYLOAD" },
    greeting: [
      {
        locale: "en_US",
        text: "Hi {{user_first_name}}! I'm Tropp! I'm your friendly AI assistant, here to help with any questions, tasks, or just about anything else you need. What's on your mind today?"
      }
/**      {
        locale: "en_US",
        text: "Hi, {{user_first_name}}! We're glad to see you. Let us know how we can assist you today!" 
      } **/
    ]
  };

  axios.post(url, payload, {
    headers: { "Content-Type": "application/json" }
  })
  .then(response => {
  })
  .catch(error => {
  });
};
