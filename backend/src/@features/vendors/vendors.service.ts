import { BadRequestException, ForbiddenException, Injectable, MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { ICreateVendorReq, IGetVendorReq, IUpdateVendorReq, IVendor } from './models/vendors.model.js';
import { Vendor } from './entities/vendors.entity.js';
import { Category } from '../categories/entities/categories.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity.js';
import { IBaseRes } from '../../@shared/models/base-api-response.model.js';

@Injectable()
export class VendorsService {

    constructor(
        @InjectRepository(Vendor) private readonly vendorsRepo: Repository<Vendor>, 
        @InjectRepository(Category) private readonly categoriesRepo: Repository<Category>,
        @InjectRepository(User) private readonly userRepo: Repository<User>) {}

    async create(data: ICreateVendorReq, userId: string): Promise<IBaseRes<IVendor>> {

        // 1. Check if the category exists
        const category = await this.categoriesRepo.findOneBy({ id: data.categoryId });
        if (!category) {
            throw new NotFoundException('Category not found');
        }

        // 2. Check if the CR number is duplicated
        const isCrNumberDuplicated = await this.vendorsRepo.findOne({ where: { crNumber: data.crNumber, deletedAt: IsNull() } });
        if (isCrNumberDuplicated) {
            throw new BadRequestException('CR number already exists');
        }

        // 3. Check if the user exists
        const user = await this.userRepo.findOneBy({ id: parseInt(userId) });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // 4. Noramlize the mobile number to the format +9665XXXXXXXX
        const normalizedMobile = this.normalizeSaudiMobile(data.mobile);
        
        // 5. Create the vendor
        const vendor = this.vendorsRepo.create({
            nameAr: data.nameAr,
            nameEn: data.nameEn,
            about: data.about,
            logo: data.logo ?? null,
            crNumber: data.crNumber,
            mobile: normalizedMobile,
            isActive: data.isActive ?? true,
            category,
            createdBy: user,
            updatedBy: null,
        });

        const savedVendor = await this.vendorsRepo.save(vendor);

        // 6. Return the saved vendor with the related category and user info
        const { category: categoryInfo, createdBy, updatedBy, ...vendorData } = savedVendor;
        return {
            data: {
                ...vendorData,
                category: categoryInfo,
                createdBy: createdBy.name,
                updatedBy: updatedBy?.name ?? null
            },
            statusCode: 201,
            messgae: 'A Vendor is created successfully'

        };
    }

    async getAll(query: IGetVendorReq): Promise<IBaseRes<IVendor[]>> {
        // 1. Extract the data
        const { page = 1, limit = 10, key, categoryId } = query;

        // 2. Make the relationships (vendor.alias)
        const queryBuilder = this.vendorsRepo.createQueryBuilder('vendor') 
            .leftJoinAndSelect('vendor.category', 'category')
            .leftJoinAndSelect('vendor.createdBy', 'createdBy')
            .leftJoinAndSelect('vendor.updatedBy', 'updatedBy');

        // 3.1 Filter by key if provided in name and CR cols
        if (key) {
            queryBuilder.andWhere(
                `(
                    vendor.nameAr LIKE :key
                    OR vendor.nameEn LIKE :key
                    OR vendor.crNumber LIKE :key
                )`,
                {
                    key: `%${key}%`,
                },
            );
        }

        // 3.2 Filter by categoryId if provided
        if (categoryId) {
            queryBuilder.andWhere(
                'category.id = :categoryId',
                {
                    categoryId,
                },
            );
        }

        // 4. Pagination and ordering
        queryBuilder.skip((page - 1) * limit).take(limit)
        .orderBy('vendor.createdAt', 'DESC');

        // 5. Execute the query and get the results
        const [vendors, total] = await queryBuilder.getManyAndCount();

        // 6. Prepare res
        const res: IBaseRes<IVendor[]> = {
            statusCode: 200,
            messgae: 'All vendors are retrieved successfully',
            data: vendors.map(el => ({
                ...el,
                createdBy: el.createdBy.name,
                updatedBy: el.updatedBy?.name ?? null,
            })),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) } 
        }

        return res
    }

    async getById(id: number): Promise<IBaseRes<IVendor>> {
        const vendor = await this.vendorsRepo.findOne({ 
            where: { id }, relations: {
                category: true,
                createdBy: true,
                updatedBy: true,
                }})
        if(!vendor) {
            throw new NotFoundException('Vendor not found');
        }

        return {
            data: { ...vendor, createdBy: vendor?.createdBy?.name, updatedBy: vendor?.updatedBy?.name ?? ''},
            statusCode: 200,
            messgae: 'A Vendor is retreived successfully'
        }
    }

    async update(id: number, data: IUpdateVendorReq, userId: string): Promise<IBaseRes<IVendor>> {
        // 1. Check if user exist
        const user = await this.userRepo.findOneBy({ id: parseInt(userId) });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // 2. Check if the vendor is exist
        const vendor = await this.vendorsRepo.findOne({ where: { id }, 
            relations: { category: true, createdBy: true, updatedBy: true } })
        if(!vendor) {
            throw new NotFoundException('Vendor not found');
        }

        // 3. Check CR duplication
        if (data.crNumber && data.crNumber !== vendor.crNumber) {
            const existingVendor = await this.vendorsRepo.findOne({
                where: {
                    crNumber: data.crNumber,
                    deletedAt: IsNull(),
                },
            });

            if (existingVendor) {
                throw new BadRequestException('CR number already exists');
            }
        }

        // 4. Check the user that updates vendor the one who's created it
        if( vendor?.createdBy?.id != +userId ) {
            throw new ForbiddenException('You are not allowed to modify this vendor');
        }

        // 5. Check that category exist
        if (data.categoryId) {
            const category = await this.categoriesRepo.findOneBy({ id: data.categoryId });
            if (!category) {
                throw new NotFoundException('Category not found');
            }

            vendor.category = category;
        }

        // 6. Override values
        const { mobile, ...rest } = data;
        Object.assign(vendor, rest);

        if (mobile) vendor.mobile = this.normalizeSaudiMobile(mobile);
        vendor.updatedBy = user;


        return {
            data: { ...vendor, createdBy: vendor?.createdBy?.name, updatedBy: vendor?.updatedBy?.name ?? '' },
            messgae: 'A Vendor is updated successfully',
            statusCode: 200
        }
        
    }

    async delete(id: number, userId: string): Promise<IBaseRes> {
        // 1. Check if user exist
        const user = await this.userRepo.findOneBy({ id: parseInt(userId) });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // 2. Check if the vendor is exist
        const vendor = await this.vendorsRepo.findOne({ where: { id } })
        if(!vendor) {
            throw new NotFoundException('Vendor not found');
        }

        // 3. Check the user that updates vendor the one who's created it
        if( vendor?.createdBy?.id != +userId ) {
            throw new ForbiddenException('You are not allowed to modify this vendor');
        }

        // 4. Remove the vendor
        await this.vendorsRepo.softRemove(vendor);
        return {
            data: null,
            messgae: 'A Vendor is deleted successfully',
            statusCode: 200
        }
    }

  
  
  private normalizeSaudiMobile( mobile: string): string {
    if (mobile.startsWith('05')) return `+966${mobile.substring(1)}`
    return mobile }
}
