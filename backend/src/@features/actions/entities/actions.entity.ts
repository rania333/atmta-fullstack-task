import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Permission } from '../../permissions/entities/permission.entity.js';

@Entity('actions')
export class Action {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Permission, (p) => p.action)
  permissions: Relation<Permission[]>;
}
