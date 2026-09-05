import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/categories.entity.js';
import { Repository } from 'typeorm';
import { ICategory, ICreateCategoryReq, IGetCategoryReq, IUpdateCategoryReq } from './models/category.model.js';
import { IBaseRes } from '../../@shared/models/base-api-response.model.js';
import { User } from '../users/entities/user.entity.js';

@Injectable()
export class CategoriesService {
    constructor(@InjectRepository(Category) private readonly categoriesRep: Repository<Category>,
        @InjectRepository(User) private readonly userRepo: Repository<User> ){}

    async create(data: ICreateCategoryReq, userId: number): Promise<IBaseRes<ICategory>> {
        // 1. Check if user exist
        const user = await this.userRepo.findOne({ where: { id: userId } })
        if(!user) {
            throw new NotFoundException('User not found');
        }


        // 2. Check if parent category exist
        let parentCategory: Category | null = null;
        if(data?.parentId) {
            parentCategory = await this.categoriesRep.findOne({ where: { id: data?.parentId } });
            if(!parentCategory) throw new NotFoundException('Category not exist');
        }

        // 3. Add the category
        const category = this.categoriesRep.create({
            nameAr: data.nameAr,
            nameEn: data.nameEn,
            parent: parentCategory,
        });

        const addedCategory = await this.categoriesRep.save(category);

        return {
            data: addedCategory,
            statusCode: 201,
            message: 'A Category is created successfully',
        };


    }

    async getAll(data: IGetCategoryReq): Promise<IBaseRes<ICategory[]>> {
        // 1. Extract the data
        const { page = 1, limit = 10, key, parentCategoryId } = data;

        // 2. Build the relationship
        let query = this.categoriesRep.createQueryBuilder('category')
            .leftJoinAndSelect('category.parent', 'parent')
            .addSelect( // Get count of childs
                (subQuery) => {
                return subQuery
                    .select('COUNT(child.id)')
                    .from(Category, 'child')
                    .where('child.parent_id = category.id');
                },
                'childrenCount',
            );

        // 3. Filter key if exist
        if(key) {
            query.andWhere(`(
                category.nameAr LIKE :key
                OR category.nameEn LIKE :key
            )`, {
                key: `%${key}%`,
            })
        }

        // 4. Filter by parent category if exist
        if(parentCategoryId) {
            query.andWhere(`parent.id = :categoryId`, {categoryId: parentCategoryId});
        }

        // 5. Get count
        const total = await query.getCount();

        // 6. Pagination & order
        query.skip((page - 1) * limit).take(limit);

        // 7.  Execute the query and get the results
        const { entities, raw } = await query.getRawAndEntities();
        // 8. Prepare res
        const categories = entities.map((category, index) => ({
            ...category,
            childrenCount: Number(raw[index].childrenCount),
        }));
        const res: IBaseRes<ICategory[]> = {
            statusCode: 200,
            message: 'All Categories are retrieved successfully',
            data: categories,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) } 
        }

        return res;

    }

    async getById(id: number): Promise<IBaseRes<ICategory>> {
        const category = await this.categoriesRep.findOne({
            where: { id },
            relations: { parent: true, children: true, vendors: true }
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return {
            data: category,
            message: 'A Category is retrieved Successfully',
            statusCode: 200
        };
    }

    async getChildCategories(id: number): Promise<IBaseRes<ICategory[]>> {
       // 1.Check if category exist
        const category = await this.categoriesRep.findOne({ where: { id } });
        if (!category) {
            throw new NotFoundException('Category not found');
        }

        // 2. Build query and get count 
        const query = this.categoriesRep.createQueryBuilder('category')
            .addSelect(
            (subQuery) =>
                subQuery
                .select('COUNT(child.id)')
                .from(Category, 'child')
                .where('child.parent_id = category.id'),
            'childrenCount',
            )
            .where('category.parent_id = :id', { id })
            .orderBy('category.id', 'ASC');

        const { entities, raw } = await query.getRawAndEntities();

        // 3. Map calculated count
        const children = entities.map((category, index) => ({
            ...category,
            childrenCount: Number(raw[index].childrenCount),
        }));

        return {
            statusCode: 200,
            message: 'Category children retrieved successfully',
            data: children,
        };
    }

    async update(id: number, data: IUpdateCategoryReq): Promise<IBaseRes<ICategory>> {
        // 1. Check if category exist
        const category = await this.categoriesRep.findOne({ where: { id }, relations: { parent: true } });
        if(!category) {
            throw new NotFoundException('Category not found');
        }

        // 2. Handle parent category changes
        if(data?.parentId) {
            // 2.1 Prevent self parent
            if(data.parentId == category.id ) { 
                throw new BadRequestException('Category cannot be its own parent');
            }

            // 2.2 Check if parent exist
            const parent = await this.categoriesRep.findOne({ where: { id: data?.parentId } });
            if(!parent) {
                throw new NotFoundException('Parent category not found')
            }

            // 2.3 Check if parent is one of its child
            const createsCycle = await this.isDescendant( id,data.parentId );
            if (createsCycle) {
                throw new BadRequestException('Cannot move category under one of its descendants');
            }
            category.parent = parent;
        }

        // 3. Override the props with new ones
        const { parentId, ...rest } = data;
        Object.assign(category, rest);

        // 4. Save the updated data in DB
        const updatedCategory = await this.categoriesRep.save(category);

        return {
            statusCode: 200,
            message: 'Category updated successfully',
            data: updatedCategory,
        };

    }

    async delete(id: number) {
        // 1. Check category 
        const category = await this.categoriesRep.findOne({
            where: { id },
            relations: { children: true, vendors: true},
        });
                
        if (!category) {
            throw new NotFoundException('Category not found');
        }

        // 2. Cannot delete category with children
        if (category.children.length) {
            throw new BadRequestException('Category cannot be deleted because it has child categories');
        }

        // 3. Cannot delete category used by vendors
        if (category.vendors.length) {
            throw new BadRequestException('Category cannot be deleted because it has vendors');
        }

        // 4. Delete category [Hard remove]
        await this.categoriesRep.remove(category);

        return {
            statusCode: 200,
            message: 'Category deleted successfully',
        };
    }


    /**
     * To prevent assign childCategoryId as parent
     * @param categoryId the categoryId itself
     * @param possibleDescendantId The parentCategoryId
     * @returns 
     */
    private async isDescendant(categoryId: number, possibleDescendantId: number ): Promise<boolean> {
        // 1. Get the parentId (May be descendant)
        let current = await this.categoriesRep.findOne({
            where: { id: possibleDescendantId },
            relations: { parent: true }
        });

        // Recursion
        while (current?.parent) {
            if (current.parent.id === categoryId) return true
            
            // Get the up category and so on
            current = await this.categoriesRep.findOne({
                where: { id: current.parent.id },
                relations: { parent: true }
            });
        }
        return false;
    }

}
