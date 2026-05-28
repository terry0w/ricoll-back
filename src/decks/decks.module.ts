import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Card } from '../catalog/entities/card.entity';
import { User } from '../users/entities/user.entity';
import { DecksController } from './decks.controller';
import { DecksService } from './decks.service';
import { DeckEvent } from './entities/deck-event.entity';
import { DeckVersion } from './entities/deck-version.entity';
import { Deck } from './entities/deck.entity';
import { GameEvent } from './entities/game-event.entity';

@Module({
  imports:     [TypeOrmModule.forFeature([Deck, DeckVersion, DeckEvent, GameEvent, User, Card])],
  controllers: [DecksController],
  providers:   [DecksService],
})
export class DecksModule {}
