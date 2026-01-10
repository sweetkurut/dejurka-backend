import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { PropertyObject } from './property-object.entity';

@Entity('commercial_details')
export class Commercial {
  @OneToOne(() => PropertyObject, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id', referencedColumnName: 'id' })
  property: PropertyObject;

  @PrimaryColumn('uuid')
  property_id: string;

  @Column('float')
  total_area: number;

  @Column()
  floors: number;

  @Column({ nullable: true })
  communications: string;
}
