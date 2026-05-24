import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { Card } from './entities/card.entity';
import { CardSet } from './entities/set.entity';
import { Variant } from './entities/variant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, Variant, CardSet])],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
