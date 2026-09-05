import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity.js';
import { PermissionsService } from './permissions.service.js';
import { PermissionsController } from './permissions.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
    imports: [TypeOrmModule.forFeature([Permission]), AuthModule],
    providers: [PermissionsService],
    controllers: [PermissionsController],
})
export class PermissionsModule {}
