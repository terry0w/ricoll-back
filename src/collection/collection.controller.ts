import { Body, Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { CurrentUser } from '../common/decorators/current-user.decorator'
import type { TokenUser } from '../common/types/token-user.type'
import { CollectionService } from './collection.service'
import { PatchEntryDto } from './dto/patch-entry.dto'

@Controller('collection')
@ApiTags('collection')
@ApiBearerAuth()
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get()
  getCollection(@CurrentUser() user: TokenUser) {
    return this.collectionService.getCollection(user.sub)
  }

  @Patch(':productId')
  patchEntry(
    @CurrentUser() user: TokenUser,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: PatchEntryDto,
  ) {
    return this.collectionService.patchEntry(user.sub, productId, dto.subTypeName, dto.delta)
  }
}
