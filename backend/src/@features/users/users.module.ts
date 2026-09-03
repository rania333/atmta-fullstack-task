import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermission } from '../user-permission/entities/userPermission.entity.js';
import { UserRole } from '../user-role/entities/userRole.entity.js';
import { User } from './entities/user.entity.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([ User, UserRole, UserPermission ]),
  ],

})
export class UsersModule {}
