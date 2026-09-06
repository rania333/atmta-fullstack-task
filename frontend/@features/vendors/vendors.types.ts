export interface IVendorCategory {
  id: number;
  nameAr: string;
  nameEn: string;
}

export interface IVendorRes {
  id: number;
  nameAr: string;
  nameEn: string;
  about: string;
  logo: string | null;
  crNumber: string;
  mobile: string;
  isActive: boolean;
  category: IVendorCategory;

  createdBy: string;
  updatedBy: string | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ICreateVendorReq {
  nameAr: string;
  nameEn: string;
  about: string;
  logo?: string;
  crNumber: string;
  mobile: string;
  categoryId?: number;
  isActive?: boolean;
}

export interface IUpdateVendorParams {
  vendorId: number;
  data: ICreateVendorReq;
}