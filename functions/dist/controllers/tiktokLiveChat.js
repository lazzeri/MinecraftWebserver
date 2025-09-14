'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.startTikTokLiveChat = exports.startTikTokLiveChats = void 0;
const tiktok_live_connector_1 = require('tiktok-live-connector');
const database_1 = require('./database');
tiktok_live_connector_1.signatureProvider.config.extraParams.apiKey =
  'ZGE4MWY4MzRlZWY2OGNkMzU5OTdhNDBhMWNhZTc2OTYyOTNjZjg2ZmUyYzQzMGU1NDJjYjE0';
let startedChats = [];
const startTikTokLiveChat = async (tiktokUsername) => {
  if (tiktokUsername === '') return;
  try {
    let tiktokChatConnection = new tiktok_live_connector_1.WebcastPushConnection(tiktokUsername);
    tiktokChatConnection
      .connect()
      .then((state) => {
        startedChats.push(tiktokUsername);
        console.info(`Connected to Tiktok  ${tiktokUsername}`);
        tiktokChatConnection.on('disconnected', async () => {
          await sleep(5000);
          startTikTokLiveChat(tiktokUsername);
        });
        tiktokChatConnection.on('streamEnd', () => {
          startedChats = startedChats.filter((elem) => elem !== tiktokUsername);
        });
        tiktokChatConnection.on('chat', (data) => {
          database_1.database.sendFreeIoMessage('tik' + tiktokUsername, {
            type: 'message',
            message: data,
          });
        });
      })
      .catch((err) => {});
  } catch (e) {}
};
exports.startTikTokLiveChat = startTikTokLiveChat;
const startTikTokLiveChats = async (userId) => {
  const data = await database_1.database.getData('integration', {});
  data.message.forEach((elem) => {
    if (parseInt(elem.userId) === parseInt(userId.toString())) {
      let tiktokName = JSON.parse(elem.data).tiktok;
      if (!startedChats.includes(tiktokName)) {
        startTikTokLiveChat(tiktokName);
      }
    }
  });
};
exports.startTikTokLiveChats = startTikTokLiveChats;
function sleep(milliseconds) {
  if (milliseconds < 0)
    return new Promise((resolve) => {
      resolve();
    });
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
//# sourceMappingURL=tiktokLiveChat.js.map
