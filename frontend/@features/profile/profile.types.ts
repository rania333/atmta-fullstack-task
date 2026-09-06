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
  createdVendors?: IProfileVendor[];
}

export interface IProfileVendor {
  id: number;
  nameAr: string;
  nameEn: string;
  about: string;
  logo: string | null;
  crNumber: string;
  mobile: string;
  isActive: boolean;
  category: IProfileVendorCategory;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface IProfileVendorCategory {
  id: number;
  nameAr: string;
  nameEn: string;
}