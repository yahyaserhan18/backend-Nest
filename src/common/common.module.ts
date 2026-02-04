import { Global, Module } from '@nestjs/common';
import { TraceContextService } from './trace-context.service';
import { TraceLoggerService } from './trace-logger.service';

@Global()
@Module({
  providers: [TraceContextService, TraceLoggerService],
  exports: [TraceContextService, TraceLoggerService],
})
export class CommonModule {}
