import { IRole } from "../../roles/models/roles.model.js";

export interface IRolePermission {
    role: IRole;
    permission: string;
}