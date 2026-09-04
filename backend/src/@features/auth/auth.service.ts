import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ILoginReq, ILoginRes } from './auth.dto.js';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly _jwtService: JwtService) {}
    async login(data: ILoginReq): Promise<ILoginRes> {
        const user = await this.usersService.findByEmail(data.email);
        if(!user) {
            throw new UnauthorizedException('Invalid email or password');
        }
        if(!user.isActive) {
            throw new UnauthorizedException('User is not active');
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const tokenPayload = {
            sub: user.id,
            email: user.email
        };
        
        const accessToken = await this._jwtService.signAsync(tokenPayload);
        return {
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        };
    }
}
