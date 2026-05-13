import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  findAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.catalogService.findAll(
      limit ? +limit : 100,
      offset ? +offset : 0,
    );
  }

  @Get('cards')
  getCards(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.catalogService.getCards(
      limit ? +limit : 100,
      offset ? +offset : 0,
    );
  }

  @Get('cards-and-variants')
  getCardsAndVariants(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.catalogService.getCardsAndVariants(
      limit ? +limit : 100,
      offset ? +offset : 0,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogService.findOne(+id);
  }
}
