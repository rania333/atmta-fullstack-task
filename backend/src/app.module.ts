import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemModulesModule } from './@features/system-modules/system-modules.module.js';
import { PermissionsModule } from './@features/permissions/permissions.module.js';
import { ActionsModule } from './@features/actions/actions.module.js';
import { RolesModule } from './@features/roles/roles.module.js';
import { RolePermissionModule } from './@features/role-permission/role-permission.module.js';
import { UsersModule } from './@features/users/users.module.js';
import { UserRoleModule } from './@features/user-role/user-role.module.js';
import { UserPermissionModule } from './@features/user-permission/user-permission.module.js';
import { CategoriesModule } from './@features/categories/categories.module.js';
import { VendorsModule } from './@features/vendors/vendors.module.js';
import { AuthModule } from './@features/auth/auth.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    SystemModulesModule,
    PermissionsModule,
    ActionsModule,
    RolesModule,
    RolePermissionModule,
    UsersModule,
    UserRoleModule,
    UserPermissionModule,
    CategoriesModule,
    VendorsModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
