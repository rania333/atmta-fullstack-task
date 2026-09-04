export class ILoginReq {
    email: string;
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