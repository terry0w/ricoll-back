import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { IsPublic } from '../common/decorators/is-public.decorator';
import { CatalogService } from './catalog.service';
import { FilterOptionsRsDto } from './dto/filter-options-rs.dto';
import { GetCardsRqDto } from './dto/get-cards-rq.dto';
import { Card } from './entities/card.entity';
import { Variant } from './entities/variant.entity';

@Controller('catalog')
@ApiTags('catalog')
@IsPublic()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  findAll(@Query() query: GetCardsRqDto): Promise<Card[]> {
    return this.catalogService.findAll(query);
  }

  @Get('cards')
  getCards(@Query() query: GetCardsRqDto): Promise<Card[]> {
    return this.catalogService.getCards(query);
  }

  @Get('cards-and-variants')
  getCardsAndVariants(@Query() query: GetCardsRqDto): Promise<Variant[]> {
    return this.catalogService.getCardsAndVariants(query);
  }

  // Devuelve el total de cartas que coinciden con los filtros (para calcular páginas)
  @Get('count')
  getCardsCount(@Query() query: GetCardsRqDto): Promise<{ total: number }> {
    return this.catalogService.getCardsCount(query);
  }

  // Devuelve los valores únicos para poblar los desplegables del frontend
  @Get('filter-options')
  getFilterOptions(): Promise<FilterOptionsRsDto> {
    return this.catalogService.getFilterOptions();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Card | null> {
    return this.catalogService.findOne(id);
  }
}
