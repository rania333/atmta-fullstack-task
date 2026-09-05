import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/categories.entity.js';
import { CategoriesService } from './categories.service.js';
import { CategoriesController } from './categories.controller.js';
import { User } from '../users/entities/user.entity.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
    imports: [TypeOrmModule.forFeature([Category, User]), AuthModule],
    providers: [CategoriesService],
    controllers: [CategoriesController],
})
export class CategoriesModule {}
