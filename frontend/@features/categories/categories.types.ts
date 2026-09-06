export interface ICategoryParent {
  id: number;
  nameAr: string;
  nameEn: string;
}

export interface ICategoryRes {
  id: number;
  nameAr: string;
  nameEn: string;
  parent: ICategoryParent | null;
  childrenCount?: number;
}
export interface ICreateCategoryReq {
  nameAr: string;
  nameEn: string;
  parentId?: number;
}

export interface IUpdateCategoryParams {
  categoryId: number;
  data: ICreateCategoryReq;
}
