import { AsyncLocalStorage } from 'node:async_hooks';

export interface TraceStore {
  traceId: string;
}

/**
 * AsyncLocalStorage used to propagate traceId through the request lifecycle
 * so services and logging can access it without passing the request object.
 */
export const traceStorage = new AsyncLocalStorage<TraceStore>();
