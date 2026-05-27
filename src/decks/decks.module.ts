import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DecksController } from './decks.controller';
import { DecksService } from './decks.service';
import { DeckResult } from './entities/deck-result.entity';
import { DeckVersion } from './entities/deck-version.entity';
import { Deck } from './entities/deck.entity';

@Module({
  imports:     [TypeOrmModule.forFeature([Deck, DeckVersion, DeckResult])],
  controllers: [DecksController],
  providers:   [DecksService],
})
export class DecksModule {}
