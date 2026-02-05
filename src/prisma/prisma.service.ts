import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { getDatabaseUrl } from '../config/database-url';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly configService: ConfigService) {
    const env = {
      DATABASE_URL: configService.get<string>('DATABASE_URL'),
      DB_HOST: configService.get<string>('DB_HOST'),
      DB_PORT: configService.get<string>('DB_PORT'),
      DB_USERNAME: configService.get<string>('DB_USERNAME'),
      DB_PASSWORD: configService.get<string>('DB_PASSWORD'),
      DB_NAME: configService.get<string>('DB_NAME'),
    };
    const connectionString = getDatabaseUrl(env);
    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
