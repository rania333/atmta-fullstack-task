import { apiFetch } from '@/@shared/libs/api';
import { IBaseRes } from '@/@shared/libs/base-api.types';
import { ICreateRoleReq, IRolesRes, IUpdateRoleReq } from './roles.types';

export const rolesService = {
  getRoles() {
    return apiFetch<IBaseRes<IRolesRes[]>>('/roles');
  },

  getRole(roleId: number) {
    return apiFetch<IBaseRes<IRolesRes>>( `/roles/${roleId}` )
  },

  deleteRole(roleId: number) {
    return apiFetch(`/roles/${roleId}`, {
      method: 'DELETE'
    });
  },

  createRole(data: ICreateRoleReq) {
    return apiFetch('/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updateRole(roleId: number, data: IUpdateRoleReq) {
    return apiFetch(`/roles/${roleId}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },
};
