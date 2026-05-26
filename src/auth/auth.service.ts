import { BadRequestException, ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import { MailService } from '../mail/mail.service';
import { TokenUser } from '../common/types/token-user.type';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthRsDto } from './dto/auth-rs.dto';
import { ForgotPasswordRqDto } from './dto/forgot-password-rq.dto';
import { LoginRqDto } from './dto/login-rq.dto';
import { RegisterRqDto } from './dto/register-rq.dto';
import { ResetPasswordRqDto } from './dto/reset-password-rq.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterRqDto): Promise<AuthRsDto> {
    this.logger.log(`Registering user: ${dto.email}`);
    const [byEmail, byNick] = await Promise.all([
      this.usersService.findByEmail(dto.email),
      this.usersService.findByNickname(dto.nickname),
    ]);
    if (byEmail) throw new ConflictException('El email ya está registrado');
    if (byNick)  throw new ConflictException('El nickname ya está en uso');

    const [hashed, verificationToken] = await Promise.all([
      bcrypt.hash(dto.password, 10),
      Promise.resolve(randomBytes(32).toString('hex')),
    ]);

    const user = await this.usersService.create(dto.email, dto.username, dto.nickname, hashed, verificationToken);

    // Fire-and-forget — don't block registration if email fails
    this.mailService.sendWelcome(user.email, user.nickname!, verificationToken, user.id).catch((err) =>
      this.logger.error(`Failed to send welcome email to ${user.email}: ${err.message}`),
    );

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

  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.usersService.findByVerificationToken(token);
    if (!user) throw new BadRequestException('Token de verificación inválido');
    if (user.verifiedAt) return { message: 'La cuenta ya estaba verificada' };

    user.verifiedAt        = new Date();
    user.verificationToken = null;
    await this.usersService.save(user);

    this.logger.log(`User verified: ${user.email}`);
    return { message: 'Cuenta verificada correctamente' };
  }

  async forgotPassword(dto: ForgotPasswordRqDto): Promise<{ message: string }> {
    const user = await this.usersService.findByEmailOrNickname(dto.identifier);

    // Always return the same message to avoid user enumeration
    const ok = { message: 'Si el usuario existe, recibirá un correo con las instrucciones' };
    if (!user) return ok;

    const resetToken = randomBytes(32).toString('hex');
    user.resetPasswordToken   = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    await this.usersService.save(user);

    this.mailService.sendPasswordReset(user.email, user.nickname!, resetToken, user.id).catch((err) =>
      this.logger.error(`Failed to send reset email to ${user.email}: ${err.message}`),
    );

    return ok;
  }

  async resetPassword(dto: ResetPasswordRqDto): Promise<{ message: string }> {
    const user = await this.usersService.findByResetToken(dto.token);
    if (!user) throw new BadRequestException('Token inválido o ya utilizado');

    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('El enlace ha caducado. Solicita uno nuevo');
    }

    user.password             = await bcrypt.hash(dto.password, 10);
    user.resetPasswordToken   = null;
    user.resetPasswordExpires = null;
    await this.usersService.save(user);

    this.logger.log(`Password reset for: ${user.email}`);
    return { message: 'Contraseña actualizada correctamente' };
  }

  private buildResponse(user: User): AuthRsDto {
    const payload: TokenUser = { sub: user.id, email: user.email, username: user.username, nickname: user.nickname! };
    return { token: this.jwtService.sign(payload), user: payload };
  }
}
