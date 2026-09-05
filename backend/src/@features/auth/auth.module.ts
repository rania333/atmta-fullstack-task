import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UsersModule } from '../users/users.module.js';
import { JwtModule } from '@nestjs/jwt';
import type { JwtSignOptions } from '@nestjs/jwt';
import { JwtGuard } from '../../@core/guards/jwt.guard.js';
import { PermissionGuard } from '../../@core/guards/permission.guard.js';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
   imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
            expiresIn: configService.get<JwtSignOptions['expiresIn']>('JWT_EXPIRES_IN') || '1h',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard, PermissionGuard],
  exports: [JwtModule, forwardRef(() => UsersModule), JwtGuard, PermissionGuard]
})
export class AuthModule {}
