export interface IRolePermission {
  id: number;
  module: string;
  action: string;
}

export interface IRolesRes {
  id: number;
  name: string;
  permissions: IRolePermission[];
}

export interface IUserDetails {
  id: number;
  name: string;
  email: string;
  phone: string;
  photo: string | null;
  isActive: boolean;
  roles: IRole[];
  directPermissions: string[];
  effectivePermissions: string[];
}

export interface IRole {
  id: number;
  name: string;
}