module.exports.config = {
  name: "id",
  author: "Yan Maglinte", 
  version: "1.0", 
  category: "Utility",
  description: "Sends the user's recipient ID",
  adminOnly: false, 
  usePrefix: false,
  cooldown: 0, 
};


module.exports.run = function ({ event, args}) {
  if (event.type === "message") {
    api.sendMessage("This is your ID: " + event.sender.id, event.sender.id);
  };


  if (event.type === "message_reply") {
    api.sendMessage(`This your ID: ${event.sender.id}`, event.sender.id);
    console.log(event)
  }
};
