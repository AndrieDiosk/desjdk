module.exports.config = {
  name: "eval",
  author: "Yan Maglinte",
  version: "1.0",
  category: "Utility",
  description: "Test the code",
  adminOnly: true,
  usePrefix: false,
  cooldown: 0,
};

module.exports.run = async function ({ event, args}) {
  if (!args || !Array.isArray(args) || args.length === 0) {
    api.sendMessage('Please provide a code you want to test', event.sender.id);
    return;
  }

  try {
    await eval(args.join(" "));
  } catch (error) {
    api.sendMessage(error.message || error, event.sender.id);
  }
};
