module.exports.config = {
  name: 'typing_endi',
  author: 'Cliff',
  version: '1.0',
  description: 'Automatically typing indicator',
  selfListen: false,
};

module.exports.run = async function({ event}) {

  if (!event || !event.message || (!event.message.text && !event.message.attachments)) {
    return;
  }

  try {
    await api.sendTypingIndicator(true, event.sender.id);

    await api.sendTypingIndicator(false, event.sender.id);
  } catch (error) {
  }
};
