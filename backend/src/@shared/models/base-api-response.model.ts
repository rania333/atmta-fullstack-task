export interface IBaseRes<T = any> {
    data: T,
    messgae: string[] | string,
    statusCode: number,
    meta?: {
        page: number,
        limit: number, 
        total: number, 
        totalPages: number
    }
    error?: string,
}