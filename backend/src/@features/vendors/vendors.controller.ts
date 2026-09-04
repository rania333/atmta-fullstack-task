import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ICreateVendorReq, IGetVendorReq, IUpdateVendorReq } from './models/vendors.model.js';
import { RequirePermission } from '../../@core/decorators/require-permission.decorator.js';
import { JwtGuard } from '../../@core/guards/jwt.guard.js';
import { PermissionGuard } from '../../@core/guards/permission.guard.js';
import { VendorsService } from './vendors.service.js';
import { Action } from '../actions/entities/actions.entity.js';
import { ACTION } from '../actions/models/actions.model.js';

@Controller('vendors')
@UseGuards(JwtGuard, PermissionGuard)
export class VendorsController {
    constructor(private readonly vendorsService: VendorsService) {}

    @Post()
    @RequirePermission('vendors', ACTION.CREATE)
    create(@Body() data: ICreateVendorReq, @Req() req: any) {
        return this.vendorsService.create( data, req.user.sub );
    }

    @Get()
    @RequirePermission('vendors', ACTION.READ)
    getAll(@Query() query: IGetVendorReq) {
        return this.vendorsService.getAll(query);
    }

    @Get(':id')
    @RequirePermission('vendors', ACTION.READ)
    geyById(@Param('id', ParseIntPipe) id: number) {
        return this.vendorsService.getById(id);
    }

    @Patch(':id')
    @RequirePermission('vendors', ACTION.UPDATE)
    update(@Param('id', ParseIntPipe) id: number,
        @Body() data: IUpdateVendorReq, @Req() req: any
    ) {
        return this.vendorsService.update( id, data, req.user.sub );
    }

    @Delete(':id')
    @RequirePermission('vendors', 'delete')
    delete(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.vendorsService.delete(id, req.user.sub);
    }

}
