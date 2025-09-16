// callbackHandler.js
function handleCallback(payload, onChatMessage) {
  if (!payload?.data?.data?.chats) return;

  // eslint-disable-next-line no-unsafe-optional-chaining
  const { chats } = payload?.data?.data;

  chats.forEach((chat) => {
    const chatMessage = {
      id: chat.id,
      timestamp: chat.timestamp,
      timestampUsec: chat.timestampUsec,
      authorName: chat.authorName,
      authorChannelId: chat.authorChannelId,
      authorPhoto: chat.authorPhoto,
      message: chat.message.map((m) => m.text).join(' '), // merge multi-part messages
      rawMessage: chat.rawMessage.map((m) => m.text).join(' '),
      isOwner: chat.isOwner,
      isVerified: chat.isVerified,
      isModerator: chat.isModerator,
    };

    // Pass parsed chat message back to consumer
    if (typeof onChatMessage === 'function') {
      onChatMessage(chatMessage);
    }
  });
}

window.handleCallback = handleCallback;
