import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEffect } from './models/user.model.js';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}
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

}

