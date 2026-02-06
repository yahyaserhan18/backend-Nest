import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const raw = config.get<string>('JWT_ACCESS_EXPIRES_IN', '15m');
        const match = raw.match(/^(\d+)([smhd])$/);
        const mult: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
        const seconds = match ? parseInt(match[1], 10) * (mult[match[2] ?? 'm'] ?? 60) : 900;
        return {
          secret: config.get<string>('JWT_ACCESS_SECRET'),
          signOptions: { expiresIn: seconds },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [AuthService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
