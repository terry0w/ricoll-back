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
import { AddEventRqDto } from './dto/add-event-rq.dto';
import { CreateDeckRqDto } from './dto/create-deck-rq.dto';
import { GetPublicDecksRqDto } from './dto/get-public-decks-rq.dto';
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
  findPublic(@Query() query: GetPublicDecksRqDto) {
    return this.decksService.findPublic(query);
  }

  @Get('public/:id')
  @IsPublic()
  findPublicOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.decksService.findPublicOne(id);
  }

  @Get('public/:id/versions')
  @IsPublic()
  getPublicVersions(@Param('id', ParseUUIDPipe) id: string) {
    return this.decksService.getPublicVersions(id);
  }

  @Get('public/:id/events')
  @IsPublic()
  getPublicEvents(@Param('id', ParseUUIDPipe) id: string) {
    return this.decksService.getPublicEvents(id);
  }

  @Get('game-events/all')
  @IsPublic()
  getGameEvents() {
    return this.decksService.findAllGameEvents();
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

  @Post(':id/events')
  addEvent(
    @CurrentUser() user: TokenUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddEventRqDto,
  ) {
    return this.decksService.addEvent(user.sub, id, dto);
  }

  @Get(':id/events')
  getEvents(@CurrentUser() user: TokenUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.decksService.getEvents(user.sub, id);
  }

  @Patch(':id/events/:eventId')
  updateEvent(
    @CurrentUser() user: TokenUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Body() dto: AddEventRqDto,
  ) {
    return this.decksService.updateEvent(user.sub, id, eventId, dto);
  }
}
