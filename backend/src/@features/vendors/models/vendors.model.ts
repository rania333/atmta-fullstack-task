import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsOptional, Matches, IsNumber, IsBoolean, IsInt, Min } from "class-validator";

export class ICreateVendorReq {
    @IsString()
    @IsNotEmpty()
    nameAr: string;

    @IsString()
    @IsNotEmpty()
    nameEn: string;

    @IsString()
    @IsNotEmpty()
    about: string;

    @IsOptional()
    @IsString()
    logo?: string;

    @IsString()
    @Matches(/^\d{10}$/, {
        message: 'CR number must contain exactly 10 digits',
    })
    crNumber: string;

    @IsString()
    @Matches(/^(05\d{8}|\+9665\d{8})$/, {
        message:
        'Mobile must be in 05XXXXXXXX or +9665XXXXXXXX format',
    })
    mobile: string;

    @IsNumber()
    categoryId: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

}

export class IUpdateVendorReq extends PartialType(ICreateVendorReq) {

}

export class IGetVendorReq { 
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
    categoryId?: number;
}


// Response
export interface IVendor {
    id: number,
    nameAr: string,
    nameEn: string,
    about: string,
    logo: string | null,
    crNumber: string,
    mobile: string,
    isActive: boolean,
    category: {
        id: number,
        nameAr: string,
        nameEn: string
    },
    createdBy: string,
    updatedBy: string | null,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null
}
