import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Event, EventStatus, EventType } from './entities/event.entity';

interface LogEventDto {
  type:          EventType;
  subtype:       string;
  userId?:       string;
  recipient:     string;
  status:        EventStatus;
  errorMessage?: string;
}

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
  ) {}

  log(dto: LogEventDto): Promise<Event> {
    const event = this.eventRepo.create({
      type:         dto.type,
      subtype:      dto.subtype,
      userId:       dto.userId ?? null,
      recipient:    dto.recipient,
      status:       dto.status,
      errorMessage: dto.errorMessage ?? null,
    });
    return this.eventRepo.save(event);
  }
}
