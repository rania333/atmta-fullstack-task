import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
  Unique,
} from 'typeorm';
import { SystemModule } from '../../system-modules/entities/system-module.entity.js';
import { Action } from '../../actions/entities/actions.entity.js';

@Entity('permissions')
@Unique(['module', 'action'])
export class Permission { // Module  + Action
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SystemModule, (m) => m.permissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'module_id' })
  module: Relation<SystemModule>;

  @ManyToOne(() => Action, (a) => a.permissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'action_id' })
  action: Relation<Action>;
}
