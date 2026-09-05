import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class ICreateCategoryReq {
    @IsString()
    @IsNotEmpty()
    nameAr: string;

    @IsString()
    @IsNotEmpty()
    nameEn: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    parentId?: number;
}

export class IUpdateCategoryReq extends PartialType(ICreateCategoryReq) {}
export class IGetCategoryReq { 
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit: number = 10;

    @IsOptional()
    @IsString()
    key?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    parentCategoryId?: number | null;
}



export interface ICategory {
    id: number,
    nameAr: string,
    nameEn: string,
    parent: {
        id: number,
        nameAr: string,
        nameEn: string
    } | null
}