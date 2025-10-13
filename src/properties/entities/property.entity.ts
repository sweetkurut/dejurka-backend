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
import { User } from '../../users/entities/user.entity';
import { Series } from '../../references/entities/series.entity';
import { RenovationType } from '../../references/entities/renovation-type.entity';
import { District } from '../../references/entities/district.entity';
import { RoomCount } from '../../references/entities/room-count.entity';
import { DocumentEntity } from '../../references/entities/document.entity';
import { HeatingType } from '../../references/entities/heating-type.entity';
import { FurnitureType } from '../../references/entities/furniture-type.entity';

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
