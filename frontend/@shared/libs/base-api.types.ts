export interface IBaseRes<T = unknown> {
    statusCode: number;
    message: string | string[];
    data: T;
    meta: IPagination | null
} 


export interface IPagination {
    page: number,
    limit: number,
    total: number,
    totalPages: number
}

export interface IBaseReq {
    page: number,
    limit: number,
    key?: string,
    parentCategoryId?: number,
    categoryId?: number
}
