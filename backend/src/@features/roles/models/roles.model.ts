import { IRolePermission } from "../../role-permission/models/rolePermission.model.js";
import type { RolePermissions } from '../../permissions/models/permissions.model.js';

export interface IRole {
    name: string;
    permissions: RolePermissions;
    rolePermissions: IRolePermission[];
}
