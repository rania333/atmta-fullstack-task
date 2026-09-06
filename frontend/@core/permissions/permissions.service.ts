import { apiFetch } from '@/@shared/libs/api';
import { IBaseRes } from '@/@shared/libs/base-api.types';
import { IPermissionRes } from './permissions.types';

export const permissionsService = {
  getPermissions() {
    return apiFetch<IBaseRes<IPermissionRes[]>>('/permissions');
  },
};
