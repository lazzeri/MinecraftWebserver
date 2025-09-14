/// <reference types="node" />
interface DatabaseInterface {
  [key: string]: any;
  listenToChannel: (channel: string, callBack: (msg: any) => void) => Promise<void>;
  sendIoMessage: (channel: string, data: any) => Promise<void>;
  sendFreeIoMessage: (channel: string, data: any) => Promise<void>;
  startDatabase: () => Promise<boolean>;
  makeRawQuery: (queryString: string) => Promise<{
    error: boolean;
    message: any;
  }>;
  uploadData: (
    dataBaseName: string,
    data: any,
  ) => Promise<{
    error: boolean;
    message: string;
  }>;
  getData: (
    dataBaseName: string,
    query: any,
  ) => Promise<{
    error: boolean;
    message: any;
  }>;
  getOneData: (
    dataBaseName: string,
    query: any,
  ) => Promise<{
    error: boolean;
    message: any;
  }>;
  updateData: (
    dataBaseName: string,
    query: any,
    data: any,
    userId?: string,
  ) => Promise<{
    error: boolean;
    message: any;
  }>;
  deleteData: (
    dataBaseName: string,
    query: any,
  ) => Promise<{
    error: boolean;
    message: string;
  }>;
  countData: (
    dataBaseName: string,
    query: any,
  ) => Promise<{
    error: boolean;
    message: number;
  }>;
}
declare const database: DatabaseInterface;
declare const app: import('express-serve-static-core').Express;
declare const httpServer: import('http').Server<
  typeof import('http').IncomingMessage,
  typeof import('http').ServerResponse
>;
export { database, httpServer, app };
//# sourceMappingURL=database.d.ts.map
