import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('series')
export class Series {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: false })
  is_elite: boolean;
}
