import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DecksController } from './decks.controller';
import { DecksService } from './decks.service';
import { DeckEvent } from './entities/deck-event.entity';
import { DeckVersion } from './entities/deck-version.entity';
import { Deck } from './entities/deck.entity';
import { GameEvent } from './entities/game-event.entity';

@Module({
  imports:     [TypeOrmModule.forFeature([Deck, DeckVersion, DeckEvent, GameEvent])],
  controllers: [DecksController],
  providers:   [DecksService],
})
export class DecksModule {}
