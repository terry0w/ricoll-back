import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsPublic } from '../common/decorators/is-public.decorator';
import type { TokenUser } from '../common/types/token-user.type';
import { AuthService } from './auth.service';
import { AuthRsDto } from './dto/auth-rs.dto';
import { ForgotPasswordRqDto } from './dto/forgot-password-rq.dto';
import { LoginRqDto } from './dto/login-rq.dto';
import { RegisterRqDto } from './dto/register-rq.dto';
import { ResetPasswordRqDto } from './dto/reset-password-rq.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @IsPublic()
  register(@Body() body: RegisterRqDto): Promise<AuthRsDto> {
    return this.authService.register(body);
  }

  @Post('login')
  @IsPublic()
  login(@Body() body: LoginRqDto): Promise<AuthRsDto> {
    return this.authService.login(body);
  }

  @Get('verify-email')
  @IsPublic()
  verifyEmail(@Query('token') token: string): Promise<{ message: string }> {
    return this.authService.verifyEmail(token);
  }

  @Post('forgot-password')
  @IsPublic()
  forgotPassword(@Body() body: ForgotPasswordRqDto): Promise<{ message: string }> {
    return this.authService.forgotPassword(body);
  }

  @Post('reset-password')
  @IsPublic()
  resetPassword(@Body() body: ResetPasswordRqDto): Promise<{ message: string }> {
    return this.authService.resetPassword(body);
  }

  @Get('me')
  @ApiBearerAuth()
  me(@CurrentUser() user: TokenUser): TokenUser {
    return user;
  }
}
