import { IRole } from "../roles/roles.types";

export interface IUserRole {
  id: number;
  name: string;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  photo: string | null;
  isActive: boolean;
  roles: IUserRole[];
}

export interface IUserDetails {
  id: number;
  name: string;
  email: string;
  phone: string;
  photo: string | null;
  isActive: boolean;
  roles: IRole[];
  directPermissions: IDirectPermission[];
  effectivePermissions: string[];
}

export interface DirectPermission {
  id: number;
  module: string;
  action: string;
  effect: PermissionEffect;
}

export interface IUpdateUserStatusReq {
  userId: number;
  isActive: boolean;
}

export interface ICreateUserReq {
  name: string;
  email: string;
  password: string;
  phone: string;
  roleIds: number[];
}

export interface IUpdateUserReq {
  name: string;
  email: string;
  phone?: string;
  roleIds: number[];
}

export interface IUpdateUserParams {
  userId: number;
  data: IUpdateUserReq;
}

export type PermissionEffect = 'grant' | 'revoke';
export interface IDirectPermission {
  id: number;
  module: string;
  action: string;
  effect: PermissionEffect;
}
export interface IDirectPermissionInput {
  permissionId: number;
  effect: PermissionEffect;
}

export interface IUpdateDirectPermissionsReq {
  permissions: IDirectPermissionInput[];
}

export interface IUpdateDirectPermissionsParams {
  userId: number;
  permissions: {
    permissionId: number;
    effect: 'grant' | 'revoke';
  }[];
}
