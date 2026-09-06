import { apiFetch } from '@/@shared/libs/api';
import { IBaseReq, IBaseRes } from '@/@shared/libs/base-api.types';
import { ICreateUserReq, IUpdateUserReq, IUser } from './users.types';
import { buildQueryParams } from '@/@shared/libs/query-params';
import { IUserDetails } from '../roles/roles.types';

export const usersService = {
  getUsers(params: IBaseReq) {
    const query = buildQueryParams({ ...params });
    return apiFetch<IBaseRes<IUser[]>>(
      `/users${query ? `?${query}` : ''}`,
    );
  },

  getUser(userId: number) {
    return apiFetch<IBaseRes<IUserDetails>>(`/users/${userId}`);
  },

  updateStatus(userId: number, isActive: boolean) {
    return apiFetch<IBaseRes<IUserDetails>>(`/users/${userId}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ isActive }),
      },
    );
  },

  createUser(data: ICreateUserReq) {
    return apiFetch<IBaseRes<IUserDetails>>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updateUser(userId: number, data: IUpdateUserReq) {
    return apiFetch(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
