import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "../../permissions/entities/permission.entity.js";

@Entity('modules')
export class SystemModule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  displayName: string;

  @OneToMany(() => Permission, (p) => p.module)
  permissions: Permission[];
}