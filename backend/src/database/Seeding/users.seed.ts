import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import type { IUser } from '../../@features/users/models/user.model.js';
import { Role } from '../../@features/roles/entities/roles.entity.js';
import { UserRole } from '../../@features/user-role/entities/userRole.entity.js';
import { User } from '../../@features/users/entities/user.entity.js';

const users: IUser[] = [
  {
    name: 'Super Admin',
    email: 'superadmin@atmta.test',
    password: 'Admin123!',
    phone: '+966500000001',
    role: 'Super Admin',
  },
  {
    name: 'Vendor Manager',
    email: 'vendor@atmta.test',
    password: 'Vendor123!',
    phone: '+966500000002',
    role: 'Vendor Manager',
  },
  {
    name: 'Read Only User',
    email: 'viewer@atmta.test',
    password: 'Viewer123!',
    phone: '+966500000003',
    role: 'Viewer',
  },
  {
    name: 'No Vendors User',
    email: 'employee@atmta.test',
    password: 'Employee123!',
    phone: '+966500000004',
    role: 'Employee',
  },
];

export async function seedUsers(userRepo: Repository<User>, userRoleRepo: Repository<UserRole>, roleRepo: Repository<Role> ) {
    for (const userSeed of users) {
        // User
        let crntUser = await userRepo.findOne({ where: { email: userSeed.email } });
        if (!crntUser) {
            const hashedPassword = await bcrypt.hash(userSeed.password, 12);
            crntUser = userRepo.create({
                name: userSeed.name,
                email: userSeed.email,
                password: hashedPassword,
                phone: userSeed.phone,
                photo: null,
                isActive: true,
            });

            crntUser = await userRepo.save(crntUser);
        }

        // Role
        const role = await roleRepo.findOneByOrFail({ name: userSeed.role});
        const existingUserRole = await userRoleRepo.findOne({
            where: {
                user: { id: crntUser.id },
                role: { id: role.id },
            },
        });

        if (!existingUserRole) {
            const userRole = userRoleRepo.create({ user: crntUser, role});
            await userRoleRepo.save(userRole);
        }
    }
}
