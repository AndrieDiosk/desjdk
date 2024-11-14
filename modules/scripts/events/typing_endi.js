module.exports.config = {
  name: 'typing_endi',
  author: 'Cliff',
  version: '1.0',
  description: 'Automatically typing indicator',
  selfListen: false,
};

module.exports.run = async function({ event }) {

  if (!event || !event.message || (!event.message.text && !event.message.attachments)) {
    return;
  }

  try {
    await api.graph({
      recipient: { id: event.sender.id },
      sender_action: 'typing_on'
    });

    await api.graph({
      recipient: { id: event.sender.id },
      sender_action: 'typing_off'
    });
  } catch (error) {
  }
};
