import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermission } from '../user-permission/entities/userPermission.entity.js';
import { UserRole } from '../user-role/entities/userRole.entity.js';
import { User } from './entities/user.entity.js';
import { UsersService } from './users.service.js';
import { Role } from '../roles/entities/roles.entity.js';
import { UsersController } from './users.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { Permission } from '../permissions/entities/permission.entity.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([ User, UserRole, UserPermission, Role, Permission ]),
        forwardRef(() => AuthModule),
  ],
    providers: [UsersService],
    exports: [UsersService],
    controllers: [UsersController], // Export UsersService to make it available for other modules

})
export class UsersModule {}
