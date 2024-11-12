module.exports.config = {
  name: 'autoseen',
  author: 'Cliff',
  version: '1.0',
  description: 'Automatically mark messages as seen',
  selfListen: false,
};

module.exports.run = async function({ event }) {
  if (!event || !event.message || (!event.message.text && !event.message.attachments)) {
    return;
  }

  try {
    await api.graph({
      recipient: { id: event.sender.id },
      sender_action: 'mark_seen'
    });
  } catch (error) {
  }
};

