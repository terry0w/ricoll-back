import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsPublic } from '../common/decorators/is-public.decorator';
import type { TokenUser } from '../common/types/token-user.type';
import { AddResultRqDto } from './dto/add-result-rq.dto';
import { CreateDeckRqDto } from './dto/create-deck-rq.dto';
import { DecksService } from './decks.service';

@Controller('decks')
@ApiTags('decks')
@ApiBearerAuth()
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Post()
  create(@CurrentUser() user: TokenUser, @Body() dto: CreateDeckRqDto) {
    return this.decksService.create(user.sub, dto);
  }

  @Get('me')
  findMine(@CurrentUser() user: TokenUser) {
    return this.decksService.findAllByUser(user.sub);
  }

  @Get('public')
  @IsPublic()
  findPublic() {
    return this.decksService.findPublic();
  }

  @Get(':id')
  findOne(@CurrentUser() user: TokenUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.decksService.findOne(user.sub, id);
  }

  @Put(':id')
  update(
    @CurrentUser() user: TokenUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateDeckRqDto,
    @Query('note') note?: string,
    @Query('skipVersion') skipVersion?: string,
  ) {
    return this.decksService.update(user.sub, id, dto, note, skipVersion === 'true');
  }

  @Patch(':id/public')
  setPublic(
    @CurrentUser() user: TokenUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body('public') isPublic: boolean,
  ) {
    return this.decksService.setPublic(user.sub, id, isPublic);
  }

  @Delete(':id')
  remove(@CurrentUser() user: TokenUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.decksService.remove(user.sub, id);
  }

  @Get(':id/versions')
  getVersions(@CurrentUser() user: TokenUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.decksService.getVersions(user.sub, id);
  }

  @Post(':id/results')
  addResult(
    @CurrentUser() user: TokenUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddResultRqDto,
  ) {
    return this.decksService.addResult(user.sub, id, dto);
  }

  @Get(':id/results')
  getResults(@CurrentUser() user: TokenUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.decksService.getResults(user.sub, id);
  }
}
