import { Module } from '@nestjs/common';
import { SystemModule } from './entities/system-module.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([SystemModule])],
})
export class SystemModulesModule {}
