import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UsersModule } from '../users/users.module.js';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from '../../@core/guards/jwt.guard.js';
import { PermissionGuard } from '../../@core/guards/permission.guard.js';

@Module({
   imports: [
    UsersModule,
    JwtModule.register({
      secret: 'temporary-secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard, PermissionGuard],
  exports: [PermissionGuard]
})
export class AuthModule {}
