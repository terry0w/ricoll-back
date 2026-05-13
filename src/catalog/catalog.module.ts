import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { Product } from './entities/catalog.entity';
import { Variant } from './entities/variant.entity';
import { CardSet } from './entities/set.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Variant, CardSet])],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
