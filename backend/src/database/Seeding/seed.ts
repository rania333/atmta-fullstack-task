// src/database/seeds/seed.ts

import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { seedActions } from './actions.seed.js';
import { seedModules } from './modules.seed.js';
import { seedPermissions } from './permissions.seed.js';
import { seedRoles } from './roles.seed.js';
import { seedUsers } from './users.seed.js';
import { Action } from '../../@features/actions/entities/actions.entity.js';
import { Category } from '../../@features/categories/entities/categories.entity.js';
import { Permission } from '../../@features/permissions/entities/permission.entity.js';
import { RolePermission } from '../../@features/role-permission/entities/rolePermission.entity.js';
import { Role } from '../../@features/roles/entities/roles.entity.js';
import { SystemModule } from '../../@features/system-modules/entities/system-module.entity.js';
import { UserPermission } from '../../@features/user-permission/entities/userPermission.entity.js';
import { UserRole } from '../../@features/user-role/entities/userRole.entity.js';
import { User } from '../../@features/users/entities/user.entity.js';
import { Vendor } from '../../@features/vendors/entities/vendors.entity.js';

const dataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'database.sqlite',
  entities: [
    Action,
    SystemModule,
    Permission,
    Role,
    RolePermission,
    User,
    UserRole,
    UserPermission,
    Category,
    Vendor,
  ],
  synchronize: true,
});

async function runSeed() {
  await dataSource.initialize();

  try {
    const actionRepo = dataSource.getRepository(Action);
    const moduleRepo = dataSource.getRepository(SystemModule);
    const permissionRepo = dataSource.getRepository(Permission);

    const roleRepo = dataSource.getRepository(Role);
    const rolePermissionRepo = dataSource.getRepository(RolePermission);

    const userRepo = dataSource.getRepository(User);
    const userRoleRepo = dataSource.getRepository(UserRole);

    await seedActions(actionRepo);

    await seedModules(moduleRepo);

    await seedPermissions(
      permissionRepo,
      actionRepo,
      moduleRepo,
    );

    await seedRoles(
      roleRepo,
      rolePermissionRepo,
      permissionRepo,
    );

    await seedUsers(
      userRepo,
      userRoleRepo,
      roleRepo,
    );

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Seed failed', error);
    process.exitCode = 1;
  } finally {
    await dataSource.destroy();
  }
}

void runSeed();
