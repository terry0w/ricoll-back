import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EventsModule } from '../events/events.module';
import { MailService } from './mail.service';

@Module({
  imports:   [ConfigModule, EventsModule],
  providers: [MailService],
  exports:   [MailService],
})
export class MailModule {}
