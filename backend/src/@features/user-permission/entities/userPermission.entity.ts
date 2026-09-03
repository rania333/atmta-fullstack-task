
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Permission } from '../../permissions/entities/permission.entity.js';
import { PermissionEffect } from '../../users/models/user.model.js';


@Entity('user_permissions')
@Unique(['user', 'permission'])
export class UserPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => User,
    (u) => u.userPermissions,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @ManyToOne(
    () => Permission,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'permission_id' })
  permission: Relation<Permission>;

  @Column({
    type: 'text',
    enum: PermissionEffect,
  })
  effect: PermissionEffect;
}
