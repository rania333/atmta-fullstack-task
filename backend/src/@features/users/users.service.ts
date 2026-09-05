import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreateUserReq, IGetUserReq, IUpdateUserPermissionsReq, IUpdateUserReq, IUserDetailsResponse, IUserProfileRes, IUserRes, PermissionEffect } from './models/user.model.js';
import { Role } from '../roles/entities/roles.entity.js';
import { UserRole } from '../user-role/entities/userRole.entity.js';
import { IBaseRes } from '../../@shared/models/base-api-response.model.js';
import { Permission } from '../permissions/entities/permission.entity.js';
import { UserPermission } from '../user-permission/entities/userPermission.entity.js';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
        @InjectRepository(UserRole) private readonly userRoleRepo: Repository<UserRole>,
        @InjectRepository(Permission) private readonly permissionRepo: Repository<Permission>,
        @InjectRepository(UserPermission) private readonly userPermissionRepo: Repository<UserPermission>) {}
    
    findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { email },
        });
    }

    async getEffectivePermissions(userId: number): Promise<string[]> {
        const user = await this.userRepository.findOne({ 
            where: { id: userId },
            relations: { // Path to load the permissions through roles and role permissions
                userRoles: {
                    role: {
                        rolePermissions: {
                            permission: {
                                module: true,
                                action: true,
                            },
                        },
                    },
                },
                userPermissions: { // Direct user permissions
                    permission: {
                        module: true,
                        action: true,
                    },
                },

            }
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const effectivePermissions = new Set<string>();
        // Process role-based permissions
        user.userRoles.forEach(userRole => {
            userRole.role.rolePermissions.forEach(rolePermission => {
                const permission = rolePermission.permission;
                const permissionCode = `${permission.module.name}.${permission.action.name}`; 
                effectivePermissions.add(permissionCode);
            });
        })

        // Process direct user permissions
        user.userPermissions.forEach(userPermission => {
            const permission = userPermission.permission;
            const permissionCode = `${permission.module.name}.${permission.action.name}`;
            if (userPermission.effect === PermissionEffect.GRANT) {
                effectivePermissions.add(permissionCode);
            } else if (userPermission.effect === PermissionEffect.REVOKE) {
                effectivePermissions.delete(permissionCode);
            }
        })
        return [...effectivePermissions];
    }


    // CRUD
    async create(data: ICreateUserReq): Promise<IBaseRes<IUserRes>> {
        // 1. Check duplicate email
        const existingUser = await this.userRepository.findOne({
            where: { email: data.email }
        });

        if (existingUser) {
            throw new BadRequestException( 'Email already exists');
        }

        // 2. Check all roles exist
        const roles = await this.roleRepo.find({
            where: { id: In(data.roleIds) },
        });

        if (roles.length !== data.roleIds.length) {
            throw new BadRequestException( 'One or more roles do not exist');
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(data.password, 12);

        // 4. Create user
        const user = this.userRepository.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            phone: data.phone,
            photo: data.photo ?? null,
            isActive: true,
        });

        const savedUser = await this.userRepository.save(user);

        // 5. Create user-role relations
        const userRoles = roles.map((role) =>
            this.userRoleRepo.create({
                user: savedUser, role,
            }),
        );

        await this.userRoleRepo.save(userRoles);

        return {
            statusCode: 201,
            message: 'User created successfully',
            data: {...savedUser,     
                roles: roles.map((role) => ({ id: role.id, name: role.name })),
            },
        };
    }

    async getAll(data: IGetUserReq): Promise<IBaseRes<IUserRes[]>> {
        // 1. Extract data
        const { page = 1, limit = 10, key } = data;

        // 2. Build query
        const query = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.userRoles', 'userRole')
            .leftJoinAndSelect('userRole.role', 'role');
        
        // 3. Check the search if exist
        if (key) {
            query.andWhere(
                `(
                    user.name LIKE :search
                    OR user.email LIKE :search
                    OR user.phone LIKE :search
                )`,
                {
                    search: `%${key}%`,
                },
            );
        }

        // 4. Pagination & Order
        query.skip((page - 1) * limit).take(limit)
            .orderBy('user.id', 'DESC');

        // 5. Excute the query
        const [users, total] = await query.getManyAndCount();

        const result = users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            photo: user.photo,
            isActive: user.isActive,
            roles: user.userRoles.map((userRole) => ({
                id: userRole.role.id,
                name: userRole.role.name,
            })),
        }));

        return {
            statusCode: 200,
            message: 'Users retrieved successfully',
            data: result,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getById(id: number): Promise<IBaseRes<IUserDetailsResponse>> {
        // 1. Check if user exist
        const user = await this.userRepository.findOne({
            where: { id },
            relations: {
                userRoles: {
                    role: true,
                },
                userPermissions: {
                    permission: {
                        module: true,
                        action: true,
                    }
                }
            }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // 2. Get the effective permission
        const effectivePermissions = await this.getEffectivePermissions(id);

        return {
            statusCode: 200,
            message: 'User retrieved successfully',
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                photo: user.photo,
                isActive: user.isActive,
                roles: user.userRoles.map((userRole) => ({
                    id: userRole.role.id,
                    name: userRole.role.name,
                })),
                directPermissions: user.userPermissions.map(
                    (up) => ({
                        id: up.permission.id,
                        module: up.permission.module.name,
                        action: up.permission.action.name,
                        effect: up.effect,
                    }),
                ),

                effectivePermissions,
            },
        };
    }

    async update( id: number, data: IUpdateUserReq ): Promise<IBaseRes<IUserDetailsResponse>> {
        // 1. Check if user exist
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // 2. email duplication
        if (data.email && data.email !== user.email) {
            const existingUser = await this.userRepository.findOne({ where: { email: data.email } });
            if (existingUser) {
                throw new BadRequestException('Email already exists');
            }
            user.email = data.email;
        }

        // 3. Override fields
        const { password, ...rest } = data;
        Object.assign(user, rest)

        // 4. password
        if (data.password !== undefined) {
            user.password = await bcrypt.hash( data.password, 12 );
        }

        //5. roles
        if (data.roleIds) {
            const roles = await this.roleRepo.find({
                where: { id: In(data.roleIds) }
            });

            if (roles.length !== data.roleIds.length) {
                throw new BadRequestException( 'One or more roles do not exist' );
            }

            // Get the superAdmin role
            const superAdminRole = await this.roleRepo.findOne({
                where: { name: 'Super Admin' },
            });

            const removingSuperAdmin = superAdminRole && !data.roleIds.includes(superAdminRole.id);

            // Prevent removing superAdmin
            if ( removingSuperAdmin && await this.isLastActiveSuperAdmin(user.id)) {
                throw new BadRequestException(
                    'The last active Super Admin cannot be demoted',
                );
            }

            // delete old role relations
            await this.userRoleRepo.delete({
                user: { id: user.id }
            });

            // create new role relations
            const newUserRoles = roles.map((role) =>
                this.userRoleRepo.create({
                    user: { id: user.id },
                    role: { id: role.id },
                }),
            );

            await this.userRoleRepo.save(newUserRoles);
        }

        await this.userRepository.save(user);

        return this.getById(id);
    }

    async updateStatus(id: number, isActive: boolean ): Promise<IBaseRes<IUserDetailsResponse>> {
        // 1. Check if user exist
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // 2. Prevent deactivate last superAdmin
        if ( isActive === false && user.isActive === true && await this.isLastActiveSuperAdmin(id)) {
            throw new BadRequestException(
                'The last active Super Admin cannot be deactivated',
            );
        }

        user.isActive = isActive;

        await this.userRepository.save(user);
        return this.getById(id);
    }

    async updateDirectPermissions( userId: number, data: IUpdateUserPermissionsReq): Promise<IBaseRes<IUserDetailsResponse>> {
        // 1. Check if user exist
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // 2. Extract the IDs only
        const permissionIds = data.permissions.map(item => item.permissionId);
        
        const uniquePermissionIds = new Set(permissionIds); // Remove duplication
        if (uniquePermissionIds.size !== permissionIds.length) {
            throw new BadRequestException( 'Duplicate permissions are not allowed');
        }

        // 3. Check if all permissions are exist
        const permissions = await this.permissionRepo.find({
            where: { id: In(permissionIds) },
        });

        if (permissions.length !== permissionIds.length) {
            throw new BadRequestException('One or more permissions do not exist');
        }

        // 4. Remove all old permissions
        await this.userPermissionRepo.delete({
            user: { id: userId },
        });


        // 5. Map the req to proper format that fits entity
        const userPermissions = data.permissions.map((item) =>
            this.userPermissionRepo.create({
                user: { id: userId },
                permission: { id: item.permissionId },
                effect: item.effect,
            }),
        );

        await this.userPermissionRepo.save(userPermissions);

        return this.getById(userId);
    }

    async getProfile( id: number): Promise<IBaseRes<IUserProfileRes>> {
        // 1. Check if user exist
        const user = await this.userRepository.findOne({
            where: { id },
            relations: {
                userRoles: {
                    role: true,
                },
                userPermissions: {
                    permission: {
                        module: true,
                        action: true,
                    },
                },
                createdVendors: {
                    category: true,
                },
            },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // 2. Get the effective permission
        const effectivePermissions = await this.getEffectivePermissions(id);

        const { password, ...userWithoutPassword } = user;
        return {
            statusCode: 200,
            message: 'User profile retrieved successfully',
            data: { ...userWithoutPassword, 
                roles: user.userRoles.map((userRole) => ({
                    id: userRole.role.id,
                    name: userRole.role.name,
                })),
                directPermissions: user.userPermissions.map(
                    (userPermission) => ({
                        id: userPermission.permission.id,
                        module: userPermission.permission.module.name,
                        action: userPermission.permission.action.name,
                        effect: userPermission.effect,
                    }),
                ),
                effectivePermissions,
                createdVendors: user.createdVendors.map((vendor) => ({ ...vendor,
                    category: {
                        id: vendor.category.id,
                        nameAr: vendor.category.nameAr,
                        nameEn: vendor.category.nameEn,
                    },
                    createdAt: vendor.createdAt,
                })),
            },
        };
    }

    /**
     * Check if the updated role is last super admin
     * @param userId 
     * @returns 
     */
    private async isLastActiveSuperAdmin(userId: number): Promise<boolean> {
        // 1. Get the role
        const superAdminRole = await this.roleRepo.findOne({
            where: { name: 'Super Admin' },
        });
        if (!superAdminRole) return false

        // 2. If current user has superAdmin
        const currentUserHasSuperAdmin = await this.userRoleRepo.exists({
            where: {
                user: { id: userId },
                role: { id: superAdminRole.id },
            },
        });
        if (!currentUserHasSuperAdmin) return false;

        // 3. Build the query
        const activeSuperAdminsCount = await this.userRoleRepo
            .createQueryBuilder('userRole')
            .innerJoin('userRole.user', 'user')
            .innerJoin('userRole.role', 'role')
            .where('role.id = :roleId', {
                roleId: superAdminRole.id,
            })
            .andWhere('user.isActive = :isActive', {
                isActive: true,
            })
            .getCount();

        return activeSuperAdminsCount === 1;
    }

}

