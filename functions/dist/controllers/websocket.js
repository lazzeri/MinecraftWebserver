'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.triggerWebsocketEvent = void 0;
const database_1 = require('./database');
const triggerWebsocketEvent = async (channelName, data) => {
  database_1.database.sendIoMessage('/' + channelName, { data });
};
exports.triggerWebsocketEvent = triggerWebsocketEvent;
//# sourceMappingURL=websocket.js.map
