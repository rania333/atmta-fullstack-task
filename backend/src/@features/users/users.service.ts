import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}
    findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { email },
        });
    }

}

