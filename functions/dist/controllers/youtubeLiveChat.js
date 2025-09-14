'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.startYoutubeLiveChat = exports.startYoutubeLiveChats = void 0;
const youtube_chat_1 = require('youtube-chat');
const database_1 = require('./database');
let startedChats = [];
const startYoutubeLiveChat = async (youtubeName) => {
  try {
    youtubeName = youtubeName.trim() || '';
    if (youtubeName === '' || youtubeName.length === 0) return;
    startedChats.push(youtubeName.toString());
    console.log('started for youtube channel:', youtubeName);
    const liveChat = new youtube_chat_1.LiveChat({ channelId: youtubeName });
    liveChat.on('chat', (chatItem) => {
      database_1.database.sendFreeIoMessage('you' + youtubeName, {
        type: 'message',
        message: chatItem,
      });
    });
    const ok = await liveChat.start();
  } catch (e) {}
};
exports.startYoutubeLiveChat = startYoutubeLiveChat;
const startYoutubeLiveChats = async (userId) => {
  const data = await database_1.database.getData('integration', {});
  data.message.forEach((elem) => {
    if (parseInt(elem.userId) === parseInt(userId.toString())) {
      let youtubeName = JSON.parse(elem.data).youtube;
      if (!startedChats.includes(youtubeName.toString())) {
        startYoutubeLiveChat(youtubeName);
      }
    }
  });
};
exports.startYoutubeLiveChats = startYoutubeLiveChats;
const stopYoutubeLiveChats = () => {
  startedChats.forEach((liveChat) => {
    liveChat.stop();
  });
};
//# sourceMappingURL=youtubeLiveChat.js.map
