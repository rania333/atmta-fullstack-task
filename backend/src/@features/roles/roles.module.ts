import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission } from '../role-permission/entities/rolePermission.entity.js';
import { Role } from './entities/roles.entity.js';
import { RolesController } from './roles.controller.js';
import { RolesService } from './roles.service.js';
import { Permission } from '../permissions/entities/permission.entity.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Role, RolePermission, Permission]), AuthModule
    ],
    controllers: [RolesController],
    providers: [RolesService]
})
export class RolesModule {}
