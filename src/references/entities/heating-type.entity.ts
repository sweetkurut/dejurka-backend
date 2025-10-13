import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('heating_types')
export class HeatingType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
