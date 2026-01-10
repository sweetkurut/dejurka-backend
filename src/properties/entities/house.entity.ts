// src/properties/entities/house.entity.ts
import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { PropertyObject } from './property-object.entity';

@Entity('house_details')
export class House {
  @OneToOne(() => PropertyObject, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id', referencedColumnName: 'id' })
  property: PropertyObject;

  @PrimaryColumn('uuid')
  property_id: string;

  @Column('float')
  house_area: number;

  @Column('float')
  land_area: number;

  @Column({ nullable: true })
  communications: string;
}
