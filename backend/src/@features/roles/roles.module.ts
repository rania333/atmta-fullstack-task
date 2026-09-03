import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission } from '../role-permission/entities/rolePermission.entity.js';
import { Role } from './entities/roles.entity.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Role, RolePermission])
    ]
})
export class RolesModule {}
