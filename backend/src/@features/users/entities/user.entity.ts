import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { UserPermission } from '../../user-permission/entities/userPermission.entity.js';
import { UserRole } from '../../user-role/entities/userRole.entity.js';


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

  @Column({ nullable: true })
  photo: string;

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
}
