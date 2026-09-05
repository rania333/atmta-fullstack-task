import { ACTION } from "../../actions/models/actions.model.js";

export const PERMISSIONS = {
  USERS: {
    CREATE: 'users.create',
    READ: 'users.read',
    UPDATE: 'users.update',
    DELETE: 'users.delete',
  },
  ROLES: {
    CREATE: 'roles.create',
    READ: 'roles.read',
    UPDATE: 'roles.update',
    DELETE: 'roles.delete',
  },
  CATEGORIES: {
    CREATE: 'categories.create',
    READ: 'categories.read',
    UPDATE: 'categories.update',
    DELETE: 'categories.delete',
  },
  VENDORS: {
    CREATE: 'vendors.create',
    READ: 'vendors.read',
    UPDATE: 'vendors.update',
    DELETE: 'vendors.delete',
    EXPORT: 'vendors.export',
  },
} as const;

type PermissionGroup = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
type Values<T> = T extends unknown ? T[keyof T] : never;

export type PermissionKey = Values<PermissionGroup>;
export type RolePermissions = 'ALL' | PermissionKey[];



export interface IPermission {
  id: number,
  name: string, // Module name
  displayName: string,
  permissions: {id: number, action: ACTION} []
}