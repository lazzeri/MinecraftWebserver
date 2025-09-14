import { Request, Response } from 'express';
export declare const pusherListenToChatChannel: (
  channelId: number,
  callBack: ((data: any) => void)[],
) => void;
export declare const addToPusherSilencer: (req: Request, res: Response) => Promise<void>;
export declare const testPusher: (userId: number) => void;
//# sourceMappingURL=pusher.d.ts.map
