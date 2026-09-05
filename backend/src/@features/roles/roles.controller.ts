import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { RequirePermission } from '../../@core/decorators/require-permission.decorator.js';
import { ICreateRoleReq, IUpdateRoleReq } from './models/roles.model.js';
import { RolesService } from './roles.service.js';
import { ACTION } from '../actions/models/actions.model.js';
import { JwtGuard } from '../../@core/guards/jwt.guard.js';
import { PermissionGuard } from '../../@core/guards/permission.guard.js';

@UseGuards(JwtGuard, PermissionGuard)
@Controller('roles')
export class RolesController {
    constructor(private readonly roleService: RolesService) {}
    @Post()
    @RequirePermission('roles', ACTION.CREATE)
    create(@Body() data: ICreateRoleReq) {
        return this.roleService.create(data);
    }

    @Get()
    @RequirePermission('roles', ACTION.READ)
    getAll() {
        return this.roleService.getAll();
    }

    @Get(':id')
    @RequirePermission('roles', ACTION.READ)
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.roleService.getById(id);
    }

    @Patch(':id')
    @RequirePermission('roles', ACTION.UPDATE)
    update(@Param('id', ParseIntPipe) id: number,@Body() data: IUpdateRoleReq,
    ) {
        return this.roleService.update(id, data);
    }

    @Delete(':id')
    @RequirePermission('roles', ACTION.DELETE)
    delete(@Param('id', ParseIntPipe) id: number,
    ) {
        return this.roleService.remove(id);
    }
}
