import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { traceStorage } from '../common/trace-context';

const X_TRACE_ID = 'X-Trace-Id';

@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const traceId = randomUUID();
    req.traceId = traceId;
    res.setHeader(X_TRACE_ID, traceId);
    traceStorage.run({ traceId }, () => next());
  }
}
