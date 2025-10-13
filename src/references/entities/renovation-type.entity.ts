import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('renovation_types')
export class RenovationType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
