'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.testPusher = exports.addToPusherSilencer = exports.pusherListenToChatChannel = void 0;
const pusher_client_1 = __importDefault(require('pusher-client'));
const crypto_1 = require('./crypto');
const database_1 = require('./database');
const userIdVerifier_1 = require('./userIdVerifier');
let pusher;
let privatePusher;
let subscribedChatChannels = [];
let privatePusherSubscribedChannels = [];
const startPusher = () => {
  return;
  pusher = new pusher_client_1.default('42a54e2785b3c81ee7b3', { cluster: 'mt1' });
};
const startPrivatePusher = () => {
  return;
  privatePusher = new pusher_client_1.default(process.env.PROD_PUSHER_KEY || '', {
    cluster: 'mt1',
    authEndpoint: 'https://api-mt1.pusher.com/auth',
    secret: process.env.PROD_PUSHER_SECRET || '',
  });
};
const pusherListenToChatChannel = (channelId, callBack) => {
  return;
  console.log(channelId, subscribedChatChannels);
  if (subscribedChatChannels.includes(parseInt(channelId.toString())))
    return console.log('Already connected to this channel');
  subscribedChatChannels.push(parseInt(channelId.toString()));
  if (!pusher) startPusher();
  let channel = pusher.subscribe('public-channel_' + channelId);
  channel.bind('onChat', (data) => {
    callBack.forEach((fun) => {
      data.message.comments.forEach((chatObj) => {
        fun({
          type: 'chat',
          data: chatObj,
        });
      });
    });
  });
  channel.bind('onBroadcastEnd', () => {
    console.log('Unsubbed from channel: ', channelId);
    pusher.unsubscribe('public-channel_' + channelId);
    subscribedChatChannels = subscribedChatChannels.filter(
      (channelIdElem) => channelIdElem !== channelId,
    );
  });
};
exports.pusherListenToChatChannel = pusherListenToChatChannel;
const connectToPrivatePusherSilenceChannel = (userId, callBack) => {
  return false;
  console.log(userId, privatePusherSubscribedChannels);
  if (privatePusherSubscribedChannels.includes(parseInt(userId.toString()))) {
    console.log('Already connected to this channel');
    return false;
  }
  privatePusherSubscribedChannels.push(parseInt(userId.toString()));
  if (!privatePusher) startPrivatePusher();
  const channel = privatePusher.subscribe('private-channel_' + userId);
  channel.bind('onSilence', function (data) {
    data.broadcasterId = userId;
    data.type = 'silence';
    callBack(data);
  });
  channel.bind('onBroadcastEnd', () => {
    console.log('Unsubbed from channel: ', userId);
    privatePusher.unsubscribe('public-channel_' + userId);
    privatePusherSubscribedChannels = privatePusherSubscribedChannels.filter(
      (channelIdElem) => channelIdElem !== userId,
    );
  });
  channel.bind('onBroadcastDisconnect', () => {
    console.log('Unsubbed from channel: ', userId);
    privatePusher.unsubscribe('public-channel_' + userId);
    privatePusherSubscribedChannels = privatePusherSubscribedChannels.filter(
      (channelIdElem) => channelIdElem !== userId,
    );
  });
  return true;
};
const addToPusherSilencer = async (req, res) => {
  return;
  const { userId } = await (0, userIdVerifier_1.getUserIdFromToken)(req);
  if (!userId) {
    return res.status(400).send({
      error: true,
      message: 'Error in userId',
    });
  }
  const result = connectToPrivatePusherSilenceChannel(userId, onSilenceCallBack);
  if (!result)
    return res.status(200).send({
      error: false,
      message: 'Already Added',
    });
  return res.status(200).send({
    error: false,
    message: 'Added',
  });
};
exports.addToPusherSilencer = addToPusherSilencer;
const onSilenceCallBack = (input) => {
  return;
  console.log('Sending to', (0, crypto_1.encrypt)(input.broadcasterId));
  database_1.database.sendFreeIoMessage(
    input.broadcasterId +
      (0, crypto_1.encrypt)(input.broadcasterId).iv +
      (0, crypto_1.encrypt)(input.broadcasterId).content,
    input,
  );
  console.log(input);
};
const testPusher = (userId) => {
  return;
  const pusherTest = new pusher_client_1.default(process.env.PROD_PUSHER_KEY || '', {
    cluster: 'mt1',
    authEndpoint: 'https://api-mt1.pusher.com/auth',
    secret: process.env.PROD_PUSHER_SECRET || '',
  });
  const channel = pusherTest.subscribe('private-channel_' + userId);
  channel.bind('onSilence', function (data) {
    console.log('Received event:', data);
  });
};
exports.testPusher = testPusher;
//# sourceMappingURL=pusher.js.map
