'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.app = exports.httpServer = exports.database = void 0;
const rate_limiter_flexible_1 = require('rate-limiter-flexible');
const express_1 = __importDefault(require('express'));
const socket_io_1 = require('socket.io');
const http_1 = require('http');
const database = {};
exports.database = database;
const app = (0, express_1.default)();
exports.app = app;
const httpServer = (0, http_1.createServer)(app);
exports.httpServer = httpServer;
const io = new socket_io_1.Server(httpServer, {});
const rateLimiter = new rate_limiter_flexible_1.RateLimiterMemory({
  points: 2,
  duration: 1,
});
database.listenToChannel = async (channel, callBack) => {
  io.on('connection', (socket) => {
    socket.on(channel, (msg) => {
      callBack(msg);
    });
  });
};
database.sendIoMessage = async function (channel, data) {
  try {
    await rateLimiter.consume(channel);
    io.emit(channel, data);
  } catch (rejRes) {
    console.log('To many io messages for: ', channel);
  }
};
database.sendFreeIoMessage = async function (channel, data) {
  io.emit(channel, data);
};
database.uploadData = function (dataBaseName, data) {
  return new Promise(async (resolve) => {
    try {
      const userModel = database[dataBaseName];
      const dataSet = userModel.build(data);
      await dataSet.save();
      resolve({
        error: false,
        message: 'Uploaded Data to database',
      });
    } catch (e) {
      console.log(e);
      resolve({
        error: true,
        message: 'Error in uploading Data',
      });
    }
  });
};
database.getData = function (dataBaseName, query) {
  return new Promise(async (resolve) => {
    try {
      const userModel = database[dataBaseName];
      const data = await userModel.findAll(query);
      resolve({
        error: false,
        message: data,
      });
    } catch (e) {
      console.log(e);
      resolve({
        error: true,
        message: 'Error in getting Data',
      });
    }
  });
};
database.getOneData = function (dataBaseName, query) {
  return new Promise(async (resolve) => {
    try {
      const userModel = database[dataBaseName];
      const data = await userModel.findOne(query);
      resolve({
        error: false,
        message: data,
      });
    } catch (e) {
      console.log(e);
      resolve({
        error: true,
        message: 'Error in getting Data',
      });
    }
  });
};
database.updateData = function (dataBaseName, query, data, userId) {
  return new Promise(async (resolve) => {
    try {
      const userModel = database[dataBaseName];
      const obj = await userModel.findOne(query);
      if (obj) {
        if (dataBaseName === 'likeathon' || dataBaseName === 'websocket') {
          let combinedData = {
            ...JSON.parse(obj.data),
            ...JSON.parse(data.data),
          };
          data.data = JSON.stringify(combinedData);
          if (dataBaseName === 'websocket') {
            database.sendIoMessage(userId + '/' + data.obsTool, combinedData);
          }
        }
        await obj.update(data);
        resolve({
          error: false,
          message: data,
        });
      } else {
        await userModel.create(data);
        resolve({
          error: false,
          message: data,
        });
      }
    } catch (e) {
      console.log(e);
      resolve({
        error: true,
        message: 'Error in updating data',
      });
    }
  });
};
database.deleteData = function (dataBaseName, query) {
  return new Promise(async (resolve) => {
    try {
      const userModel = database[dataBaseName];
      await userModel.destroy(query);
      resolve({
        error: false,
        message: 'Succesfully deleted Entries.',
      });
    } catch (e) {
      console.log(e);
      resolve({
        error: true,
        message: 'Error into deleting the data',
      });
    }
  });
};
database.countData = function (dataBaseName, query) {
  return new Promise(async (resolve) => {
    try {
      const userModel = database[dataBaseName];
      const count = await userModel.count(query);
      resolve({
        error: false,
        message: count,
      });
    } catch (e) {
      console.log(e);
      resolve({
        error: true,
        message: 0,
      });
    }
  });
};
//# sourceMappingURL=database.js.map
