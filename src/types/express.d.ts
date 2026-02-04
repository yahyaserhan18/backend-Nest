import type { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      /** Correlation/trace ID for the current request (set by TraceIdMiddleware). */
      traceId?: string;
    }
  }
}

export {};
