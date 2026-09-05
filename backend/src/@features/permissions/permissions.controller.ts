import { Controller, Get, UseGuards } from '@nestjs/common';
import { RequirePermission } from '../../@core/decorators/require-permission.decorator.js';
import { JwtGuard } from '../../@core/guards/jwt.guard.js';
import { PermissionGuard } from '../../@core/guards/permission.guard.js';
import { ACTION } from '../actions/models/actions.model.js';
import { PermissionsService } from './permissions.service.js';

@UseGuards(JwtGuard, PermissionGuard)
@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) {}
    @Get()
    @RequirePermission('roles', ACTION.READ)
    getAll() {
        return this.permissionsService.getAll();
    }
}
