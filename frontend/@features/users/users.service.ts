import { apiFetch } from '@/@shared/libs/api';
import { IBaseReq, IBaseRes } from '@/@shared/libs/base-api.types';
import { IUser } from './users.types';
import { buildQueryParams } from '@/@shared/libs/query-params';

export const usersService = {
  getUsers(params: IBaseReq) {
    const query = buildQueryParams({ ...params });
    return apiFetch<IBaseRes<IUser[]>>(
      `/users${query ? `?${query}` : ''}`,
    );
  },
};
