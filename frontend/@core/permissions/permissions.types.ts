export interface IPermissionAction {
  id: number;
  action: string;
}

export interface IPermissionRes {
  id: number;
  name: string;
  displayName: string;
  permissions: IPermissionAction[];
}
