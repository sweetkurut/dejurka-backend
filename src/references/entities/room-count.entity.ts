import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('room_counts')
export class RoomCount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  count: number;
}
