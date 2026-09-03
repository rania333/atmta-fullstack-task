import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './entities/vendors.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([Vendor])],
})
export class VendorsModule {}
