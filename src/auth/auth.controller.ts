import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsPublic } from '../common/decorators/is-public.decorator';
import type { TokenUser } from '../common/types/token-user.type';
import { AuthService } from './auth.service';
import { AuthRsDto } from './dto/auth-rs.dto';
import { LoginRqDto } from './dto/login-rq.dto';
import { RegisterRqDto } from './dto/register-rq.dto';

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

  @Get('me')
  @ApiBearerAuth()
  me(@CurrentUser() user: TokenUser): TokenUser {
    return user;
  }
}
