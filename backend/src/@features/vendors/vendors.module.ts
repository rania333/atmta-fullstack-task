import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './entities/vendors.entity.js';
import { Category } from '../categories/entities/categories.entity.js';
import { User } from '../users/entities/user.entity.js';
import { VendorsController } from './vendors.controller.js';
import { VendorsService } from './vendors.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
    imports: [TypeOrmModule.forFeature([Vendor, Category, User]), AuthModule],
    controllers: [VendorsController],
    providers: [VendorsService],
})
export class VendorsModule {}
