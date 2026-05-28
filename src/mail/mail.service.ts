import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

import { EventsService } from '../events/events.service';
import { EventStatus, EventType } from '../events/entities/event.entity';
import { welcomeTemplate } from './templates/welcome.template';
import { passwordResetTemplate } from './templates/password-reset.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend;
  private readonly from: string;
  private readonly appUrl: string;

  constructor(
    configService: ConfigService,
    private readonly eventsService: EventsService,
  ) {
    this.resend  = new Resend(configService.get<string>('RESEND_API_KEY')!);
    this.from    = configService.get<string>('MAIL_FROM')!;
    this.appUrl  = configService.get<string>('APP_URL')!;
  }

  async sendWelcome(to: string, nickname: string, verifyToken: string, userId?: string): Promise<void> {
    this.logger.log(`Sending welcome email to ${to}`);

    try {
      const { error } = await this.resend.emails.send({
        from:    `Ricoll <${this.from}>`,
        to:      [to],
        subject: 'Bienvenido a Ricoll',
        html:    welcomeTemplate({
          nickname,
          email:      to,
          verifyLink: `${this.appUrl}/verify-email?token=${verifyToken}`,
        }),
      });

      if (error) throw new Error(error.message);

      await this.eventsService.log({
        type:      EventType.EMAIL,
        subtype:   'welcome',
        userId,
        recipient: to,
        status:    EventStatus.SENT,
      });
    } catch (err: any) {
      await this.eventsService.log({
        type:         EventType.EMAIL,
        subtype:      'welcome',
        userId,
        recipient:    to,
        status:       EventStatus.FAILED,
        errorMessage: err.message,
      });
      throw err;
    }
  }

  async sendPasswordReset(to: string, nickname: string, resetToken: string, userId?: string): Promise<void> {
    this.logger.log(`Sending password reset email to ${to}`);

    try {
      const { error } = await this.resend.emails.send({
        from:    `Ricoll <${this.from}>`,
        to:      [to],
        subject: 'Recuperar contraseña — Ricoll',
        html:    passwordResetTemplate({
          nickname,
          email:     to,
          resetLink: `${this.appUrl}/reset-password?token=${resetToken}`,
        }),
      });

      if (error) throw new Error(error.message);

      await this.eventsService.log({
        type:      EventType.EMAIL,
        subtype:   'password_reset',
        userId,
        recipient: to,
        status:    EventStatus.SENT,
      });
    } catch (err: any) {
      await this.eventsService.log({
        type:         EventType.EMAIL,
        subtype:      'password_reset',
        userId,
        recipient:    to,
        status:       EventStatus.FAILED,
        errorMessage: err.message,
      });
      throw err;
    }
  }
}
