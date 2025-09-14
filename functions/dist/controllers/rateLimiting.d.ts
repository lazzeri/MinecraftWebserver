import { Request, Response, NextFunction } from 'express';
declare const startRateLimitDataCollector: () => void;
declare const minuteRateLimiterMiddleware: (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;
export { minuteRateLimiterMiddleware, startRateLimitDataCollector };
//# sourceMappingURL=rateLimiting.d.ts.map
