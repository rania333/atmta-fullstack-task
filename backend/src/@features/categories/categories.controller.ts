import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { RequirePermission } from '../../@core/decorators/require-permission.decorator.js';
import { ACTION } from '../actions/models/actions.model.js';
import { ICreateCategoryReq, IGetCategoryReq, IUpdateCategoryReq } from './models/category.model.js';
import { JwtGuard } from '../../@core/guards/jwt.guard.js';
import { PermissionGuard } from '../../@core/guards/permission.guard.js';

@Controller('categories')
@UseGuards(JwtGuard, PermissionGuard)
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService){}

    @Post()
    @RequirePermission('categories', ACTION.CREATE)
    create(@Body() data: ICreateCategoryReq, @Req() req: any) {
        return this.categoriesService.create(data, req.user.sub)
    }

    @Get()
    @RequirePermission('categories', ACTION.READ)
    getAll(@Query() query: IGetCategoryReq) {
        return this.categoriesService.getAll(query);
    }

    @Get(':id')
    @RequirePermission('categories', ACTION.READ)
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.getById(id);
    }

    @Get(':id/children')
    @RequirePermission('categories', ACTION.READ)
    getChildren(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.getChildCategories(id);
    }

    @Patch(':id')
    @RequirePermission('categories', ACTION.UPDATE)
    update(@Param('id', ParseIntPipe) id: number, @Body() data: IUpdateCategoryReq) {
        return this.categoriesService.update(id, data);
    }

    @Delete(':id')
    @RequirePermission('categories', ACTION.DELETE)
    delete( @Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.delete(id);
    }
}


