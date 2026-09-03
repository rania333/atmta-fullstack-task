import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from '../../permissions/entities/permission.entity.js';

@Entity('actions')
export class Action {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  action: string;

  @OneToMany(() => Permission, (p) => p.action)
  permissions: Permission[];
}
