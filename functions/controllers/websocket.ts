import { database } from './database';

export const triggerWebsocketEvent = async (channelName: string, data: any): Promise<void> => {
  database.sendFreeIoMessage('/' + channelName, { data });
};
