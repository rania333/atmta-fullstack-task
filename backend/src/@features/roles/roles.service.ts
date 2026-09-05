import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Role } from './entities/roles.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreateRoleReq, IRoleRes, IUpdateRoleReq } from './models/roles.model.js';
import { Permission } from '../permissions/entities/permission.entity.js';
import { RolePermission } from '../role-permission/entities/rolePermission.entity.js';
import { IBaseRes } from '../../@shared/models/base-api-response.model.js';

@Injectable()
export class RolesService {
    constructor(@InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission) private readonly permissionRepo: Repository<Permission>,
    @InjectRepository(RolePermission) private readonly rolePermissionsRepo: Repository<RolePermission>) {}

    async create(data: ICreateRoleReq): Promise<IBaseRes<IRoleRes>> {
        // 1. Check Duplications
        const roleIsExist = await this.roleRepo.findOne({ where: { name: data.name } });
        if(roleIsExist) {
            throw new BadRequestException('Role name already exists')
        }
        // 2. Check if permissions exist
        const permissions = await this.permissionRepo.find({ where: { id: In(data.permissionIds) }});
        if (permissions.length !== data.permissionIds.length) {
            throw new BadRequestException('One or more permissions do not exist')
        }
        // 4. Create role
        const role = this.roleRepo.create({ name: data.name });
        const savedRole = await this.roleRepo.save(role);

        // 5. Create role-permission relations
        const rolePermissions = permissions.map(
            (p) => this.rolePermissionsRepo.create({
                role: savedRole,
                permission: p
            }),
        );

        await this.rolePermissionsRepo.save(rolePermissions);

        return {
            statusCode: 201,
            message: 'Role created successfully',
            data: {
                id: savedRole.id,
                name: savedRole.name,
                permissions: permissions.map(
                    (permission) => permission.id,
                ),
            },
        };

    }

    async getAll(): Promise<IBaseRes<IRoleRes[]>> {
        // 1. Get all roles
        const roles = await this.roleRepo.find({
            relations: {
                rolePermissions: {
                    permission: { module: true, action: true} 
                },
            },
            order: { id: 'ASC'}
        });

        // 2. Format the res
        const data = roles.map((role) => ({
            id: role.id,
            name: role.name,
            permissions: role.rolePermissions.map((rolePermission) => ({
                id: rolePermission.permission.id,
                module: rolePermission.permission.module.name,
                action: rolePermission.permission.action.name,
            })),
        }));

        return {
            statusCode: 200,
            message: 'Roles retrieved successfully',
            data,
        };
    }

    async getById(id: number): Promise<IBaseRes<IRoleRes>> {
        // 1. Get the role
        const role = await this.roleRepo.findOne({
            where: { id },
            relations: {
                rolePermissions: {
                    permission: { module: true, action: true}
                }
            }
        });

        if (!role) {
            throw new NotFoundException('Role not found');
        }

        // 2. Format the response
        return {
            statusCode: 200,
            message: 'Role retrieved successfully',
            data: {
                id: role.id,
                name: role.name,

                permissions: role.rolePermissions.map((rolePermission) => ({
                    id: rolePermission.permission.id,
                    module: rolePermission.permission.module.name,
                    action: rolePermission.permission.action.name,
                })),
            },
        };
    }

    async update(id: number, data: IUpdateRoleReq): Promise<IBaseRes<IRoleRes>> {
        // 1. Check if the role exist or not
        const role = await this.roleRepo.findOne({
            where: { id }
        });

        if (!role) {
            throw new NotFoundException('Role not found');
        }

        // 2. Prevent duplication if exist
        if (data.name && data.name !== role.name) {
            const existingRole = await this.roleRepo.findOne({
                where: { name: data.name },
            });

            if (existingRole) {
                throw new BadRequestException('Role name already exists');
            }

            role.name = data.name;
        }

        // 3. Check permission exist
        if (data.permissionIds) {
            const permissions = await this.permissionRepo.find({
                where: { id: In(data.permissionIds)}
            });

            if (permissions.length !== data.permissionIds.length) {
                throw new BadRequestException(
                    'One or more permissions do not exist'
                );
            }

            // 4. Remove the old data from relationship table to add new ones
            await this.rolePermissionsRepo.delete({ role: { id: role.id }});

            const newRolePermissions = permissions.map((permission) =>
                this.rolePermissionsRepo.create({
                    role: { id: role.id },
                    permission: { id: permission.id },
                }),
            );

            // 5. Save the new one
            await this.rolePermissionsRepo.save(newRolePermissions);
        }

        await this.roleRepo.save(role);

        return this.getById(id);
    }

    async remove(id: number): Promise<IBaseRes<any>> {
        const role = await this.roleRepo.findOne({
            where: { id },
            relations: {
                userRoles: true,
            },
        });

        if (!role) {
            throw new NotFoundException('Role not found');
        }

        if (role.name === 'Super Admin') {
            throw new BadRequestException(
            'Super Admin role cannot be deleted',
            );
        }

        if (role.userRoles.length > 0) {
            throw new BadRequestException(
            'Role cannot be deleted because it is assigned to users',
            );
        }

        await this.roleRepo.remove(role);

        return {
            data: null,
            statusCode: 200,
            message: 'Role deleted successfully',
        };
    }
}
