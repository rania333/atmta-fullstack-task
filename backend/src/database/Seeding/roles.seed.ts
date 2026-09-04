import type { IRole } from '../../@features/roles/models/roles.model.js';
import { PERMISSIONS } from '../../@features/permissions/models/permissions.model.js';
import { Repository } from "typeorm";
import { Permission } from "../../@features/permissions/entities/permission.entity.js";
import { RolePermission } from "../../@features/role-permission/entities/rolePermission.entity.js";
import { Role } from "../../@features/roles/entities/roles.entity.js";

export const roles: Pick<IRole, 'name' | 'permissions'>[] = [
  {
    name: 'Super Admin',
    permissions: 'ALL',
  },
  {
    name: 'Vendor Manager',
    permissions: Object.values(PERMISSIONS.VENDORS),
  },
  {
    name: 'Viewer',
    permissions: [
      PERMISSIONS.USERS.READ,
      PERMISSIONS.ROLES.READ,
      PERMISSIONS.CATEGORIES.READ,
      PERMISSIONS.VENDORS.READ,
    ],
  },
  {
    name: 'Employee',
    permissions: [
      PERMISSIONS.USERS.READ,
      PERMISSIONS.CATEGORIES.READ,
    ],
  },
];

export async function seedRoles(
  roleRepo: Repository<Role>,
  rolePermissionRepo: Repository<RolePermission>,
  permissionRepo: Repository<Permission>,
) {
  for (const roleSeed of roles) {
    let role = await roleRepo.findOne({ where: { name: roleSeed.name } });

    if (!role) {
      role = await roleRepo.save(roleRepo.create({ name: roleSeed.name }));
    }

    const permissions =
      roleSeed.permissions === 'ALL'
        ? await permissionRepo.find()
        : await Promise.all(
            roleSeed.permissions.map(async (permissionCode) => {
              const [moduleName, actionName] = permissionCode.split('.');

              return permissionRepo.findOne({
                where: {
                  module: { name: moduleName },
                  action: { name: actionName },
                },
                relations: {
                  module: true,
                  action: true,
                },
              });
            }),
          );

    for (const permission of permissions) {
      if (!permission) continue;

      const existingRolePermission = await rolePermissionRepo.findOne({
        where: {
          role: { id: role.id },
          permission: { id: permission.id },
        },
      });

      if (!existingRolePermission) {
        await rolePermissionRepo.save(
          rolePermissionRepo.create({ role, permission }),
        );
      }
    }
  }
}
