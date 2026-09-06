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