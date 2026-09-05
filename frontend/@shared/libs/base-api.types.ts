export interface IBaseRes<T = any> {
    statusCode: number;
    message: string;
    data: T;
} 
