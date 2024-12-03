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
import { Repair } from 'src/repair/entities/repair.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { Heating } from 'src/heating/entities/heating.entity';
import { Furniture } from 'src/furniture/entities/furniture.entity';
import { Documentation } from 'src/documentation/entities/documentation.entity';

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
  documentationName: string;

  // @Column()
  // heatingName: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true })
  furnitureName: string;

  @Column('decimal')
  priceVisible: number;

  @Column({ default: 0 })
  priceHidden: number;

  @Column('simple-array', { nullable: true })
  photos: string[];

  @ManyToOne(() => User, (user) => user.realEstates, { nullable: true })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Repair, (repair) => repair.realEstates, { nullable: true, eager: true })
  @JoinColumn()
  repair: Repair;


  @ManyToOne(() => Room, (room) => room.realEstates, {nullable: true, eager: true})
  @JoinColumn()
  room: Room

  @ManyToOne(() => Heating, (heating) => heating.realEstates, {nullable: true, eager: true})
  @JoinColumn()
  heating: Heating

  @ManyToOne(() => Furniture, (furniture) => furniture.realEstates, {nullable: true, eager: true})
  @JoinColumn()
  furniture: Furniture


  @ManyToOne(() => Documentation, (documentation) => documentation.documentation, {nullable: true, eager: true})
  @JoinColumn() 
  documentation: Documentation
}
