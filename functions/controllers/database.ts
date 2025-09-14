import { Sequelize } from 'sequelize';
import { environment } from './secrets';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';

// Database interface
interface DatabaseInterface {
  [key: string]: any;
  listenToChannel: (channel: string, callBack: (msg: any) => void) => Promise<void>;
  sendIoMessage: (channel: string, data: any) => Promise<void>;
  sendFreeIoMessage: (channel: string, data: any) => Promise<void>;
  startDatabase: () => Promise<boolean>;
  makeRawQuery: (queryString: string) => Promise<{ error: boolean; message: any }>;
  uploadData: (dataBaseName: string, data: any) => Promise<{ error: boolean; message: string }>;
  getData: (dataBaseName: string, query: any) => Promise<{ error: boolean; message: any }>;
  getOneData: (dataBaseName: string, query: any) => Promise<{ error: boolean; message: any }>;
  updateData: (
    dataBaseName: string,
    query: any,
    data: any,
    userId?: string,
  ) => Promise<{ error: boolean; message: any }>;
  deleteData: (dataBaseName: string, query: any) => Promise<{ error: boolean; message: string }>;
  countData: (dataBaseName: string, query: any) => Promise<{ error: boolean; message: number }>;
}

const database: DatabaseInterface = {} as DatabaseInterface;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

const rateLimiter = new RateLimiterMemory({
  points: 2, // 1 point
  duration: 1, // per second
});

database.listenToChannel = async (channel: string, callBack: (msg: any) => void): Promise<void> => {
  io.on('connection', (socket) => {
    socket.on(channel, (msg) => {
      callBack(msg);
    });
  });
};

database.sendIoMessage = async function (channel: string, data: any): Promise<void> {
  try {
    io.emit(channel, data);
  } catch (rejRes) {
    console.log('To many io messages for: ', channel);
  }
};

database.sendFreeIoMessage = async function (channel: string, data: any): Promise<void> {
  io.emit(channel, data);
};

database.uploadData = function (
  dataBaseName: string,
  data: any,
): Promise<{ error: boolean; message: string }> {
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

database.getData = function (
  dataBaseName: string,
  query: any,
): Promise<{ error: boolean; message: any }> {
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

database.getOneData = function (
  dataBaseName: string,
  query: any,
): Promise<{ error: boolean; message: any }> {
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

database.updateData = function (
  dataBaseName: string,
  query: any,
  data: any,
  userId?: string,
): Promise<{ error: boolean; message: any }> {
  return new Promise(async (resolve) => {
    try {
      const userModel = database[dataBaseName];
      const obj = await userModel.findOne(query);
      // If we have an object update it
      if (obj) {
        if (dataBaseName === 'likeathon' || dataBaseName === 'websocket') {
          //Check for data object, if it's in there update it, if not add it
          let combinedData = {
            ...JSON.parse(obj.data),
            ...JSON.parse(data.data),
          };
          data.data = JSON.stringify(combinedData);

          if (dataBaseName === 'websocket') {
            //Send websocket Data
            database.sendIoMessage(userId + '/' + data.obsTool, combinedData);
          }
        }

        await obj.update(data);
        resolve({
          error: false,
          message: data,
        });
      } else {
        // If not we create one
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

database.deleteData = function (
  dataBaseName: string,
  query: any,
): Promise<{ error: boolean; message: string }> {
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

database.countData = function (
  dataBaseName: string,
  query: any,
): Promise<{ error: boolean; message: number }> {
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

export { database, httpServer, app };
