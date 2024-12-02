import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { Role } from '../enum/role.enum';

export class CreateUserDto {


  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsNumber()
  @IsOptional()
  experience?: number;

  @IsString()
  @IsOptional()
  passportDetails?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsOptional()
  salesCount?: number;
}
