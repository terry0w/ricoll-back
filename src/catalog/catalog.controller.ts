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
      limit ? +limit : 50,
      offset ? +offset : 0,
    );
  }

  @Get(':id/:subType')
  findOne(@Param('id') id: string, @Param('subType') subType: string) {
    return this.catalogService.findOne(+id, subType);
  }
}
