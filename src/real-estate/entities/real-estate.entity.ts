// src/real-estate/real-estate.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Series } from './series.entity';

@Entity()
export class RealEstate {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;


  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Series, (series) => series.realEstates)
  series: Series;

  @Column({ nullable: true })
  buildingCompanyName: string;

  @Column({ nullable: true })
  residentialComplexName: string;

  @Column({ nullable: true })
  section: string;

  @Column({ nullable: true })
  corner: boolean;

  @Column({ nullable: true })
  renovation: string;

  @Column({ nullable: true })
  district: string;

  @Column()
  exactAddress: string;

  @Column()
  numberOfRooms: number;

  @Column()
  totalArea: number;
  
  @Column()
  floor: number;

  @Column({ nullable: true })
  documentation: string;

  @Column()
  heating: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true })
  furniture: string;

  @Column('decimal')
  priceVisible: number;

  @Column('decimal')
  priceHidden: number;

  @Column('simple-array', { nullable: true })
  photos: string[];

  @ManyToOne(() => User, (user) => user.realEstates, { nullable: true })
  @JoinColumn()
  user: User;
}
