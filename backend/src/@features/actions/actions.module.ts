import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from './entities/actions.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([Action])],
})
export class ActionsModule {}
