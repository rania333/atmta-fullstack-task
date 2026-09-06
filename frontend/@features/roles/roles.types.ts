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

export interface ICreateRoleReq {
  name: string;
  permissionIds: number[];
}

export interface IUpdateRoleVariables {
  roleId: number;
  data: IUpdateRoleReq;
}
export interface IUpdateRoleReq {
  name: string;
  permissionIds: number[];
}