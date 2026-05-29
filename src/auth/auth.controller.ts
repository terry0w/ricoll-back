import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsPublic } from '../common/decorators/is-public.decorator';
import type { TokenUser } from '../common/types/token-user.type';
import type { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthRsDto } from './dto/auth-rs.dto';
import { ForgotPasswordRqDto } from './dto/forgot-password-rq.dto';
import { LoginRqDto } from './dto/login-rq.dto';
import { RegisterRqDto } from './dto/register-rq.dto';
import { ResetPasswordRqDto } from './dto/reset-password-rq.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

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

  @Get('google')
  @IsPublic()
  @UseGuards(AuthGuard('google'))
  googleAuth(): void { /* Passport redirige a Google automáticamente */ }

  @Get('google/callback')
  @IsPublic()
  @UseGuards(AuthGuard('google'))
  googleCallback(@Req() req: { user: User }, @Res() res: Response): void {
    const { token } = this.authService.loginWithGoogle(req.user);
    const frontendUrl = this.configService.get<string>('APP_URL')!;
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }

  @Get('me')
  @ApiBearerAuth()
  me(@CurrentUser() user: TokenUser): TokenUser {
    return user;
  }
}
