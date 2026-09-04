import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ILoginReq {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export interface ILoginRes {
    accessToken: string;
    user: {
        id: string | number;
        name: string;
        email: string;
    };
}
