import { PrimaryGeneratedColumn, Column, OneToMany, Entity, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { Role } from '../enum/role.enum';
import { Sale } from 'src/sales/entities/sale.entity';
import { RealEstate } from 'src/real-estate/entities/real-estate.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;


  @UpdateDateColumn()
  updated_at: Date;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Admin,
  })
  role: Role;

  @OneToMany(() => Sale, (sale) => sale.user)
  sales: Sale[];

  // Дополнительные поля для профиля
  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  experience: number;

  @Column({ nullable: true })
  passportDetails: string;

  @Column({ nullable: true })
  address: string;

  @Column({ default: 0 })
  salesCount: number;

  @OneToMany(() => RealEstate, (realEstate) => realEstate.user)
  realEstates: RealEstate[];
}
