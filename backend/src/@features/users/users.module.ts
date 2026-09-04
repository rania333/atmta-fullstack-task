import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermission } from '../user-permission/entities/userPermission.entity.js';
import { UserRole } from '../user-role/entities/userRole.entity.js';
import { User } from './entities/user.entity.js';
import { UsersService } from './users.service.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([ User, UserRole, UserPermission ]),
  ],
    providers: [UsersService],
    exports: [UsersService], // Export UsersService to make it available for other modules

})
export class UsersModule {}
