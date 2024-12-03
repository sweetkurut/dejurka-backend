import { RealEstate } from "src/real-estate/entities/real-estate.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Furniture {

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string

  @OneToMany(() => RealEstate, (furniture) => furniture.furniture)
  realEstates: RealEstate[]

}
