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