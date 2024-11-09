// src/sales/sale.entity.ts
import { RealEstate } from 'src/real-estate/entities/real-estate.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sales)
  user: User;

  @ManyToOne(() => RealEstate)
  realEstate: RealEstate;

  @Column()
  saleDate: Date;

  // Дополнительные поля по необходимости
}
