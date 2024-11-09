// src/real-estate/series.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RealEstate } from './real-estate.entity';

@Entity()
export class Series {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => RealEstate, (realEstate) => realEstate.series)
  realEstates: RealEstate[];
}
