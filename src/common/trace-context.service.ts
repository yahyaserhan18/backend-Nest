import { Injectable } from '@nestjs/common';
import { traceStorage } from './trace-context';

/**
 * Provides access to the current request's trace ID from anywhere in the
 * request lifecycle (e.g. in services) without passing the request object.
 * Uses AsyncLocalStorage populated by TraceIdMiddleware.
 */
@Injectable()
export class TraceContextService {
  /**
   * Returns the trace ID for the current request, or undefined if called
   * outside a request context (e.g. during bootstrap or a background job).
   */
  getTraceId(): string | undefined {
    return traceStorage.getStore()?.traceId;
  }
}
