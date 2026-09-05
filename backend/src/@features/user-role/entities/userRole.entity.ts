import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
  Unique,
} from 'typeorm';
import { Role } from '../../roles/entities/roles.entity.js';
import { User } from '../../users/entities/user.entity.js';

@Entity('user_roles')
@Unique(['user', 'role'])
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => Role, (r) => r.userRoles,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'role_id' })
  role: Relation<Role>;

  @ManyToOne(
    () => User,
    (u) => u.userRoles,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;
}
