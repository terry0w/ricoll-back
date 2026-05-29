import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID:     configService.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL:  configService.get<string>('GOOGLE_CALLBACK_URL')!,
      scope: ['email', 'profile'],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile): Promise<User> {
    const email    = profile.emails?.[0]?.value;
    const username = profile.displayName ?? profile.id;

    // Si ya existe por googleId, devolvemos directamente
    const byGoogleId = await this.usersService.findByGoogleId(profile.id);
    if (byGoogleId) return byGoogleId;

    // Si existe por email (cuenta local), vinculamos el googleId
    if (email) {
      const byEmail = await this.usersService.findByEmail(email);
      if (byEmail) {
        return this.usersService.linkGoogleId(byEmail, profile.id);
      }
    }

    // Usuario nuevo — lo creamos sin contraseña
    return this.usersService.createFromGoogle(email ?? `${profile.id}@google`, username, profile.id);
  }
}
