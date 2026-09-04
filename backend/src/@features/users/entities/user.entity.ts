import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { UserPermission } from '../../user-permission/entities/userPermission.entity.js';
import { UserRole } from '../../user-role/entities/userRole.entity.js';
import { Vendor } from '../../vendors/entities/vendors.entity.js';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'text', nullable: true })
  photo: string | null;

  @Column()
  phone: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(
    () => UserRole,
    (ur) => ur.role,
  )
  userRoles: Relation<UserRole[]>;

  @OneToMany(
    () => UserPermission,
    (up) => up.user,
  )
  userPermissions: Relation<UserPermission[]>;

  @OneToMany(() => Vendor, (v) => v.createdBy)
  createdVendors: Relation<Vendor[]>;

  @OneToMany(() => Vendor, (v) => v.updatedBy)
  updatedVendors: Relation<Vendor[]>;
}
