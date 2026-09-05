export interface IBaseRes<T = any> {
    data: T,
    message: string[] | string,
    statusCode: number,
    meta?: {
        page: number,
        limit: number, 
        total: number, 
        totalPages: number
    }
    error?: string,
}