import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../@core/guards/jwt.guard.js';
import { PermissionGuard } from '../../@core/guards/permission.guard.js';
import { RequirePermission } from '../../@core/decorators/require-permission.decorator.js';
import { ACTION } from '../actions/models/actions.model.js';
import { ICreateUserReq, IGetUserReq, IUpdateStatusReq, IUpdateUserPermissionsReq, IUpdateUserReq } from './models/user.model.js';
import { UsersService } from './users.service.js';

@UseGuards(JwtGuard, PermissionGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}

    @Post()
    @RequirePermission('users', ACTION.CREATE)
    create(@Body() data: ICreateUserReq) {
        return this.userService.create(data);
    }

    @Get()
    @RequirePermission('users', ACTION.READ)
    getAll( @Query() data: IGetUserReq) {
        return this.userService.getAll(data);
    }

    @Get(':id/profile')
    @RequirePermission('users', ACTION.READ)
    getProfile(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.userService.getProfile(id);
    }

    @Get(':id')
    @RequirePermission('users', ACTION.READ)
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getById(id);
    }
    @Patch(':id/status')
    @RequirePermission('users', ACTION.UPDATE)
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: IUpdateStatusReq,
    ) {
        return this.userService.updateStatus( id, data.isActive );
    }

    @Patch(':id/permissions')
    @RequirePermission('users', ACTION.UPDATE)
    updateDirectPermissions(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: IUpdateUserPermissionsReq,
    ) {
        return this.userService.updateDirectPermissions( id, data );
    }

    @Patch(':id')
    @RequirePermission('users', ACTION.UPDATE)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: IUpdateUserReq,
    ) {
        return this.userService.update(id, data);
    }


}
