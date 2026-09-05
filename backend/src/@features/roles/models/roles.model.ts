import { IRolePermission } from "../../role-permission/models/rolePermission.model.js";
import type { RolePermissions } from '../../permissions/models/permissions.model.js';
import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, IsInt, ArrayUnique } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class ICreateRoleReq {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @Type(() => Number)
    @IsInt({ each: true })
    permissionIds: number[];
}

export class IUpdateRoleReq extends PartialType(ICreateRoleReq) {}
export interface IRole {
    name: string;
    permissions: RolePermissions;
    rolePermissions: IRolePermission[];
}

export interface IRoleRes {
    id: number,
    name: string,
    permissions: number[] | {id: number, module: string, action: string}[]
}
