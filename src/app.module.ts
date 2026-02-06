import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppSeedService } from './app-seed.service';
import { AppService } from './app.service';
import { envValidationSchema } from './config/env.validation';
import { CommonModule } from './common/common.module';
import { TraceIdMiddleware } from './middleware/trace-id.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { CoursesModule } from './courses/courses.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: false,
        allowUnknown: true,
        convert: true,
      },
    }),
    PrismaModule,
    CommonModule,
    UsersModule,
    AuthModule,
    StudentsModule,
    TeachersModule,
    CoursesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TraceIdMiddleware,
    AppSeedService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TraceIdMiddleware).forRoutes('*path');
  }
}
