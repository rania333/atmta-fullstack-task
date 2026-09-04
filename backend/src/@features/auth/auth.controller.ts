import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { ILoginReq } from './auth.dto.js';

@Controller('auth')
export class AuthController {
    constructor( private readonly authService: AuthService ) {}

    @Post('login')
    login(@Body() data: ILoginReq) { 
        return this.authService.login(data);
    }
}
