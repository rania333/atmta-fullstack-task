export interface ILoginReq {
  email: string;
  password: string;
}

export interface ILoginRes {
    accessToken: string,
    user: {
        id: number,
        name: string,
        email: string
    }
}