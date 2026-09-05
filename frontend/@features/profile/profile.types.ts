export interface IRole {
  id: number;
  name: string;
}

export interface IProfileRes {
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
