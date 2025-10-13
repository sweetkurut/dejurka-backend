import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('furniture_types')
export class FurnitureType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
