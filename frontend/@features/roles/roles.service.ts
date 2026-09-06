import { apiFetch } from '@/@shared/libs/api';
import { IBaseRes } from '@/@shared/libs/base-api.types';
import { IRolesRes } from './roles.types';

export const rolesService = {
  getRoles() {
    return apiFetch<IBaseRes<IRolesRes[]>>('/roles');
  },
};
