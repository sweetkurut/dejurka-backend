import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { PropertyObject } from './property-object.entity';

@Entity('land_details')
export class Land {
  @OneToOne(() => PropertyObject, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id', referencedColumnName: 'id' })
  property: PropertyObject;

  @PrimaryColumn('uuid')
  property_id: number;

  @Column('float')
  land_area: number;

  @Column({ nullable: true })
  communications: string;
}
