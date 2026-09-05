import { apiFetch } from "@/@shared/libs/api";
import { ILoginReq, ILoginRes } from "./auth.types";

export const authService = {
  login(data: ILoginReq) {
    return apiFetch<ILoginRes>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};