import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { TokenUser } from '../common/types/token-user.type';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthRsDto } from './dto/auth-rs.dto';
import { LoginRqDto } from './dto/login-rq.dto';
import { RegisterRqDto } from './dto/register-rq.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterRqDto): Promise<AuthRsDto> {
    this.logger.log(`Registering user: ${dto.email}`);
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('El email ya está registrado');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user   = await this.usersService.create(dto.email, dto.username, hashed);
    return this.buildResponse(user);
  }

  async login(dto: LoginRqDto): Promise<AuthRsDto> {
    this.logger.log(`Login attempt: ${dto.email}`);
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Credenciales incorrectas');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciales incorrectas');

    return this.buildResponse(user);
  }

  private buildResponse(user: User): AuthRsDto {
    const payload: TokenUser = { sub: user.id, email: user.email, username: user.username };
    return { token: this.jwtService.sign(payload), user: payload };
  }
}
