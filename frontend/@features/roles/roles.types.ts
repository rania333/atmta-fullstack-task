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


export interface IRole {
  id: number;
  name: string;
}