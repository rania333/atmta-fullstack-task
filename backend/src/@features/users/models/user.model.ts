import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export enum PermissionEffect {
  GRANT = 'grant',
  REVOKE = 'revoke',
}
export class ICreateUserReq {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @Type(() => Number)
  @IsInt({ each: true })
  roleIds: number[];
}

export class IUpdateUserReq extends PartialType(ICreateUserReq) {}
export class IUpdateStatusReq {
    @IsBoolean()
    isActive: boolean;
}

export class IUserPermissionItemReq {
    @Type(() => Number)
    @IsInt()
    permissionId: number;

    @IsEnum(PermissionEffect)
    effect: PermissionEffect;
}

export class IUpdateUserPermissionsReq {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => IUserPermissionItemReq)
    permissions: IUserPermissionItemReq[];
}
export class IGetUserReq {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  key?: string;
}

export interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
}

export interface IUserRes {
  id: number,
  name: string,
  email: string,
  phone: string,
  photo: string | null,
  isActive: boolean,
  roles: {id: number, name: string}[]
}

export interface IUserRoleResponse {
    id: number;
    name: string;
}

export interface IUserDirectPermissionResponse {
    id: number;
    module: string;
    action: string;
    effect: PermissionEffect;
}

export interface IUserDetailsResponse {
    id: number;
    name: string;
    email: string;
    phone: string;
    photo: string | null;
    isActive: boolean;

    roles: IUserRoleResponse[];

    directPermissions: IUserDirectPermissionResponse[];

    effectivePermissions: string[];
}

export interface IUserProfileVendorRes{
    id: number;
    nameAr: string;
    nameEn: string;
    crNumber: string;
    mobile: string;
    isActive: boolean;
    category: {
        id: number;
        nameAr: string;
        nameEn: string;
    };
    createdAt: Date;
}

export interface IUserProfileRes extends IUserDetailsResponse {
    createdVendors: IUserProfileVendorRes[];
}