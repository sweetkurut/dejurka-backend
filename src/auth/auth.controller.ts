// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Регистрация
  @Post('register')
  async register(@Body() createUserDto: any) {
    return this.authService.register(createUserDto);
  }

  // Логин
  @Post('login')
  async login(@Body() loginDto: any) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) {
      return { message: 'Неверные учетные данные' };
    }
    return this.authService.login(user);
  }
}
