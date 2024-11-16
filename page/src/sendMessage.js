const axios = require("axios");

module.exports = function (event) {
  return async function sendMessage(text, senderID) {
    const recipientID = senderID || event.senderID;

    function splitMessage(text) {
      const maxLength = 2000;
      const messages = [];
      let remainingText = text;

      while (remainingText.length > maxLength) {
        let splitIndex = remainingText.lastIndexOf("\n", maxLength);
        if (splitIndex === -1) {
          splitIndex = maxLength;
        } else {
          splitIndex += 1;
        }
        messages.push(remainingText.slice(0, splitIndex).trim());
        remainingText = remainingText.slice(splitIndex).trim();
      }
      messages.push(remainingText);
      return messages;
    }

    const messages = splitMessage(text);

    await axios.post(
      "https://graph.facebook.com/v21.0/me/messages",
      {
        recipient: { id: event.sender.id },
        sender_action: "typing_on",
      },
      {
        params: { access_token: global.PAGE_ACCESS_TOKEN },
      }
    );

    const sendPromises = messages.map((message) => {
      const form = {
        recipient: { id: recipientID },
        message: { text: message },
        messaging_type: "RESPONSE",
      };
      return Graph(form);
    });

    try {
      const results = await Promise.all(sendPromises);
      await axios.post(
        "https://graph.facebook.com/v21.0/me/messages",
        {
          recipient: { id: event.sender.id },
          sender_action: "typing_off",
        },
        {
          params: { access_token: global.PAGE_ACCESS_TOKEN },
        }
      );
      return results;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  function Graph(form) {
    return axios
      .post(
        `https://graph.facebook.com/v20.0/me/messages?access_token=${global.PAGE_ACCESS_TOKEN}`,
        form
      )
      .then((res) => res.data)
      .catch((err) => {
        throw err.response ? err.response.data : err.message;
      });
  }
};
