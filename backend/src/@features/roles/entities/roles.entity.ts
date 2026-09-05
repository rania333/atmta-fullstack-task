import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { RolePermission } from '../../role-permission/entities/rolePermission.entity.js';
import { UserRole } from '../../user-role/entities/userRole.entity.js';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(
    () => RolePermission,
    (rp) => rp.role,
  )
  rolePermissions: Relation<RolePermission[]>; // Navigation property, not a column, but a relation to RolePermission entity

  @OneToMany(
  () => UserRole,(ur) => ur.role)
  userRoles: Relation<UserRole[]>;
}
