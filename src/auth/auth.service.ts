import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';
import { RegisterDto } from './dto/create-register.dto';
import { LoginDto } from './dto/update-login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exist = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exist) throw new ConflictException('Пользователь уже существует');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      full_name: dto.full_name,
      email: dto.email,
      password: hashed,
      role: dto.role || UserRole.AGENT,
    });

    await this.userRepo.save(user);
    const tokens = await this.getTokens(user.id, user.email, user.role);
    return { user, ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Неверный логин или пароль');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Неверный логин или пароль');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    return { user, ...tokens };
  }

  // async getTokens(id: string, email: string, role: string) {
  //   const payload = { id, email, role };

  //   const accessToken = await this.jwtService.signAsync(payload, {
  //     secret: process.env.JWT_SECRET,
  //     expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  //   });

  //   const refreshToken = await this.jwtService.signAsync(payload, {
  //     secret: process.env.JWT_REFRESH_SECRET,
  //     expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  //   });

  //   return { accessToken, refreshToken };
  // }

  async getTokens(id: string, email: string, role: string) {
    const payload = { id, email, role };

    // 1. Создайте объект опций с явным приведением типов
    const accessTokenOptions = {
      // Убедитесь, что secret существует и приведите его к string
      secret: process.env.JWT_SECRET as string,
      // Убедитесь, что expiresIn существует и приведите его к типу 'any'
      // или 'string', чтобы обойти строгую проверку StringValue
      expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any,
    };

    const accessToken = await this.jwtService.signAsync(
      payload,
      accessTokenOptions,
    );

    // 2. Аналогично для refreshToken
    const refreshTokenOptions = {
      secret: process.env.JWT_REFRESH_SECRET as string,
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
    };

    const refreshToken = await this.jwtService.signAsync(
      payload,
      refreshTokenOptions,
    );

    return { accessToken, refreshToken };
  }

  async refreshTokens(id: string, email: string, role: string) {
    return this.getTokens(id, email, role);
  }
}
