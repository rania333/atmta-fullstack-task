import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Vendor } from "../../vendors/entities/vendors.entity.js";

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nameAr: string;

    @Column()
    nameEn: string;

    @ManyToOne(() => Category, (c) => c.children,
    {
      nullable: true,
      onDelete: 'RESTRICT' // Prevent deletion if there are child categories
    })
    @JoinColumn({ name: 'parent_id' })
    parent: Relation<Category> | null;

    @OneToMany(() => Category, (c) => c.parent)
    children: Category[];

    @OneToMany(() => Vendor, (v) => v.category )
    vendors: Relation<Vendor[]> | [];

    childrenCount?: number;
}