import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/categories.entity.js';
import { User } from '../../users/entities/user.entity.js';


@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nameAr: string;

  @Column()
  nameEn: string;

  @Column({ type: 'text' })
  about: string;

  @Column({ type: 'text', nullable: true })
  logo: string | null;

  @Column({ unique: false })
  crNumber: string;

  @Column()
  mobile: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Category,(c) => c.vendors,
    {
      nullable: false,
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({ name: 'category_id' })
  category: Relation<Category>;

  @ManyToOne(() => User, (u) => u.createdVendors,
    {
      nullable: false,
      onDelete: 'RESTRICT',
    },
  )

  @JoinColumn({ name: 'created_by' })
  createdBy: Relation<User>;

  @ManyToOne(() => User, (u) => u.updatedVendors,
    {
      nullable: true,
      onDelete: 'SET NULL',
    },
  )
  @JoinColumn({ name: 'updated_by' })
  updatedBy: Relation<User | null>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}
