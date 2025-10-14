import { District, DocumentEntity, FurnitureType, HeatingType, RenovationType, RoomCount, Series } from 'src/references/entities';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CornerType {
  CORNER = 'угловая',
  NOT_CORNER = 'не угловая',
}

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.properties, { eager: true })
  created_by: User;

  @ManyToOne(() => Series, { eager: true })
  series: Series;

  @ManyToOne(() => District, { eager: true })
  district: District;

  @ManyToOne(() => RenovationType, { eager: true })
  renovation_type: RenovationType;

  @Column()
  floor_type: string;

  @ManyToOne(() => RoomCount, { eager: true })
  rooms_count: RoomCount;

  @Column('float')
  area_total: number;

  @Column({ type: 'enum', enum: CornerType, nullable: true })
  corner_type: CornerType;

  @ManyToMany(() => DocumentEntity, { eager: true })
  @JoinTable()
  documents: DocumentEntity[];

  @ManyToOne(() => HeatingType, { eager: true })
  heating_type: HeatingType;

  @ManyToOne(() => FurnitureType, { eager: true })
  furniture: FurnitureType;

  @Column()
  address: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('float')
  price_visible: number;

  @Column('float')
  price_hidden: number;

  @Column('simple-array', { nullable: true })
  photos: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
