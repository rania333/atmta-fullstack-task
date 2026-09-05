import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity.js';
import { Repository } from 'typeorm';
import { IBaseRes } from '../../@shared/models/base-api-response.model.js';
import { IPermission } from './models/permissions.model.js';
import { ACTION } from '../actions/models/actions.model.js';

@Injectable()
export class PermissionsService {
    constructor(@InjectRepository(Permission) private readonly permissionRepo: Repository<Permission> ) {}
    async getAll(): Promise<IBaseRes<IPermission[]>> {
        // 1. Get all permission
        const permissions = await this.permissionRepo.find({
            relations: { module: true, action: true
            }
        });

        // 2. Format the response
        const modules = new Map<number, IPermission>();
        for (const permission of permissions) {
            const module = permission.module;
            if (!modules.has(module.id)) {
                modules.set(module.id, {
                    id: module.id,
                    name: module.name,
                    displayName: module.displayName,
                    permissions: [],
                });
            }

            modules.get(module.id)!.permissions.push({
                id: permission.id,
                action: permission.action.name as ACTION,
            });
        }

        return {
                statusCode: 200,
                message: 'Permissions retrieved successfully',
                data: Array.from(modules.values()),
            };
        }
}
