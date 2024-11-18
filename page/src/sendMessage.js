const axios = require("axios");

module.exports = function (event) {
  return function sendMessage(text, senderID) {
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

    function Graph(form, onSuccess, onError) {
      axios
        .post(
          `https://graph.facebook.com/v20.0/me/messages?access_token=${global.PAGE_ACCESS_TOKEN}`,
          form
        )
        .then((res) => onSuccess(res.data))
        .catch((err) => onError(err.response ? err.response.data : err.message));
    }

    function processMessages(messages, index, recipientID, done) {
      if (index >= messages.length) {
        axios.post(
          "https://graph.facebook.com/v21.0/me/messages",
          {
            recipient: { id: event.sender.id },
            sender_action: "typing_off",
          },
          {
            params: { access_token: global.PAGE_ACCESS_TOKEN },
          }
        )
          .then(() => done())
          .catch(() => done());
        return;
      }

      const form = {
        recipient: { id: recipientID },
        message: { text: messages[index] },
        messaging_type: "RESPONSE",
      };

      Graph(
        form,
        () => processMessages(messages, index + 1, recipientID, done),
        () => processMessages(messages, index + 1, recipientID, done)
      );
    }

    axios.post(
      "https://graph.facebook.com/v21.0/me/messages",
      {
        recipient: { id: event.sender.id },
        sender_action: "typing_on",
      },
      {
        params: { access_token: global.PAGE_ACCESS_TOKEN },
      }
    )
      .then(() => {
        const messages = splitMessage(text);
        processMessages(messages, 0, recipientID, () => {});
      })
      .catch(() => {});
  };
};
