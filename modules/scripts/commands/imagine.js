module.exports.config = {
  name: "imagine",
  author: "Cliff",
  version: "1.0",
  category: "Utility",
  description: "Generate images via prompt.",
  adminOnly: false,
  usePrefix: false,
  cooldown: 5,
};

module.exports.run = async function ({ event, args }) {
  const senderId = event.sender.id;

  if (!args || !Array.isArray(args) || args.length === 0) {
    await api.sendMessage('Please provide a prompt for image generation.', senderId);
    return;
  }

  const prompt = args.join(' ');

  try {
    const apiUrl = `https://echavie3.nethprojects.workers.dev/flux?q=${encodeURIComponent(prompt)}`;

    await api.graph({
      recipient: { id: senderId },
      message: {
        attachment: {
          type: 'image',
          payload: {
            url: apiUrl,
            is_reusable: true
          }
        }
      }
    });
  } catch (error) {
    await api.sendMessage('An error occurred while generating the image. Please try again later.', senderId);
  }
};
