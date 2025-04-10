const config = require("./config.json");
const utils = require("./modules/utils");

module.exports.listen = function (event) {
  try {
    if (event.object === "page") {
      event.entry.forEach((entry) => {
        entry.messaging.forEach(async (event) => {
         /** if (event.postback && event.postback.payload) {
 await utils.handlePayload(event.postback.payload, event.sender.id);
          } **/

          event.type = await utils.getEventType(event);

          global.PAGE_ACCESS_TOKEN = config.PAGE_ACCESS_TOKEN;

          if (config.selfListen && event?.message?.is_echo) return;
          utils.log(event);

          if (event.postback && event.postback.payload) {
            const payload = event.postback.payload;

            if (payload === "FEEDBACK_GOOD") {
              await utils.handleFeedback(event, { feedback: "Good response" });
              return;
            } else if (payload === "FEEDBACK_BAD") {
              await utils.handleFeedback(event, { feedback: "Bad response" });
              return;
            }

          require("./page/main")(event);
        });
      });
    }
  } catch (error) {
    console.error(error);
  }
};
