import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { ILoginReq } from './auth.dto.js';
import { JwtGuard } from '../../@core/guards/jwt.guard.js';
import { UsersService } from '../users/users.service.js';
import { RequirePermission } from '../../@core/decorators/require-permission.decorator.js';
import { PermissionGuard } from '../../@core/guards/permission.guard.js';

@Controller('auth')
export class AuthController {
    constructor( private readonly authService: AuthService, private readonly usersService: UsersService ) {}

    @Post('login')
    login(@Body() data: ILoginReq) { 
        return this.authService.login(data);
    }

    @Post('logout')
    @UseGuards(JwtGuard)
    logout() {
        return {
            statusCode: 200,
            message: 'Logged out successfully',
            data: null,
        };
    }

    // TODO: For testing
    @Get('my-permissions')
    @UseGuards(JwtGuard)
    getMyPermissions(@Req() request: any) {
        return this.usersService.getEffectivePermissions(
            request.user.sub,
        );
    }

    // TODO: For testing
    @Get('test-vendor-create')
    @UseGuards(JwtGuard, PermissionGuard)
    @RequirePermission('vendors', 'create')
    testVendorCreate() {
        return {
            message: 'You are allowed to create vendors',
        };
    }
}
