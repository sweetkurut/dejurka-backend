import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { District, DocumentEntity } from 'src/references/entities';
import { User } from 'src/users/entities/user.entity';

export enum PropertyObjectType {
  HOUSE = 'house',
  LAND = 'land',
  COMMERCIAL = 'commercial',
}

@Entity('property_objects')
export class PropertyObject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('float')
  price_visible: number;

  // 👀 только admin
  @Column('float', { nullable: true })
  price_hidden: number;

  @Column()
  owner_phone: string;

  @Column('simple-array', { nullable: true })
  photos: string[];

  @ManyToOne(() => District, { eager: true, nullable: true })
  district: District;

  @ManyToOne(() => DocumentEntity, { eager: true, nullable: true })
  document_type: DocumentEntity;

  @Column({ type: 'enum', enum: PropertyObjectType })
  type: PropertyObjectType;

  @ManyToOne(() => User, { eager: true })
  created_by: User;

  @CreateDateColumn()
  created_at: Date;
}
