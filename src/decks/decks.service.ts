import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Card } from '../catalog/entities/card.entity';
import { User } from '../users/entities/user.entity';
import { AddEventRqDto } from './dto/add-event-rq.dto';
import { CreateDeckRqDto } from './dto/create-deck-rq.dto';
import { GetPublicDecksRqDto } from './dto/get-public-decks-rq.dto';
import { DeckEvent } from './entities/deck-event.entity';
import { DeckVersion } from './entities/deck-version.entity';
import { Deck, DeckCardEntry } from './entities/deck.entity';
import { GAME_EVENT_SEEDS, GameEvent } from './entities/game-event.entity';

@Injectable()
export class DecksService implements OnModuleInit {
  constructor(
    @InjectRepository(Deck)
    private readonly deckRepo: Repository<Deck>,
    @InjectRepository(DeckVersion)
    private readonly versionRepo: Repository<DeckVersion>,
    @InjectRepository(DeckEvent)
    private readonly eventRepo: Repository<DeckEvent>,
    @InjectRepository(GameEvent)
    private readonly gameEventRepo: Repository<GameEvent>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Card)
    private readonly cardRepo: Repository<Card>,
  ) {}

  async onModuleInit() {
    const count = await this.gameEventRepo.count();
    if (count === 0) {
      await this.gameEventRepo.save(
        GAME_EVENT_SEEDS.map((s) => this.gameEventRepo.create(s)),
      );
    }
  }

  findAllGameEvents(): Promise<GameEvent[]> {
    return this.gameEventRepo.find({ order: { id: 'ASC' } });
  }

  async create(userId: string, dto: CreateDeckRqDto): Promise<Deck> {
    const mainDeck  = dto.mainDeck  ?? [];
    const sideboard = dto.sideboard ?? [];
    const legal     = this.checkLegal(mainDeck, dto.battlefields ?? [], dto.runes ?? []);

    if (dto.public && !legal) throw new BadRequestException('Un deck público debe ser legal');

    const deck = this.deckRepo.create({
      userId,
      name:             dto.name,
      public:           dto.public          ?? false,
      legal,
      legendId:         dto.legendId,
      chosenChampionId: dto.chosenChampionId ?? null,
      mainDeck,
      runes:            dto.runes            ?? {},
      battlefields:     dto.battlefields     ?? [],
      sideboard,
      currentVersion:   1,
    });

    const saved = await this.deckRepo.save(deck);
    await this.saveVersion(saved, null);
    return saved;
  }

  async update(userId: string, deckId: string, dto: CreateDeckRqDto, note?: string, skipVersion = false): Promise<Deck> {
    const deck      = await this.findOwned(userId, deckId);
    const mainDeck  = dto.mainDeck  ?? [];
    const sideboard = dto.sideboard ?? [];
    const legal     = this.checkLegal(mainDeck, dto.battlefields ?? [], dto.runes ?? []);

    if (dto.public && !legal) throw new BadRequestException('Un deck público debe ser legal');

    deck.name             = dto.name;
    deck.public           = dto.public           ?? false;
    deck.legal            = legal;
    deck.legendId         = dto.legendId;
    deck.chosenChampionId = dto.chosenChampionId ?? null;
    deck.mainDeck         = mainDeck;
    deck.runes            = dto.runes             ?? [];
    deck.battlefields     = dto.battlefields      ?? [];
    deck.sideboard        = sideboard;

    if (!skipVersion) deck.currentVersion += 1;

    const saved = await this.deckRepo.save(deck);
    if (!skipVersion) await this.saveVersion(saved, note ?? null);
    return saved;
  }

  async setPublic(userId: string, deckId: string, isPublic: boolean): Promise<Deck> {
    const deck = await this.findOwned(userId, deckId);
    if (isPublic && !deck.legal) throw new BadRequestException('Un deck público debe ser legal');
    deck.public = isPublic;
    return this.deckRepo.save(deck);
  }

  findAllByUser(userId: string): Promise<Deck[]> {
    return this.deckRepo.findBy({ userId });
  }

  async findPublic(dto: GetPublicDecksRqDto) {
    const qb = this.deckRepo.createQueryBuilder('d')
      .where('d.public = :pub AND d.legal = :leg', { pub: true, leg: true });

    if (dto.name)     qb.andWhere('d.name ILIKE :name',         { name: `%${dto.name}%` });
    if (dto.legendId) qb.andWhere('d.legend_id = :legendId',    { legendId: dto.legendId });

    const decks = await qb.orderBy('d.updated_at', 'DESC').getMany();
    if (!decks.length) return [];

    const userIds  = [...new Set(decks.map((d) => d.userId))];
    const users    = await this.userRepo.findBy({ id: In(userIds) });
    const nickMap  = new Map(users.map((u) => [u.id, u.nickname ?? u.username]));

    const allCardIds = [...new Set(decks.flatMap((d) => [
      ...d.mainDeck.map((e) => e.cardId),
      ...(Array.isArray(d.runes) ? d.runes.map((e) => e.cardId) : []),
      ...d.battlefields,
      ...(d.sideboard ?? []).map((e) => e.cardId),
    ]))];
    const cards    = await this.cardRepo.findBy({ productId: In(allCardIds) });
    const priceMap = new Map(cards.map((c) => [c.productId, Number(c.marketPrice ?? c.lowPrice ?? 0)]));

    return decks.map((d) => ({
      id:             d.id,
      name:           d.name,
      legendId:       d.legendId,
      winRate:        d.winRate !== null ? Number(d.winRate) : null,
      currentVersion: d.currentVersion,
      updatedAt:      d.updatedAt,
      authorNickname: nickMap.get(d.userId) ?? 'Desconocido',
      estimatedCost:  this.computeDeckCost(d, priceMap),
    }));
  }

  async findOne(userId: string, deckId: string): Promise<Deck & { authorNickname: string }> {
    const deck = await this.findOwned(userId, deckId);
    const user = await this.userRepo.findOne({ where: { id: userId } });
    return Object.assign(deck, { authorNickname: user?.nickname ?? user?.username ?? '' });
  }

  async getVersions(userId: string, deckId: string): Promise<DeckVersion[]> {
    await this.findOwned(userId, deckId);
    return this.versionRepo.findBy({ deckId });
  }

  async addEvent(userId: string, deckId: string, dto: AddEventRqDto): Promise<DeckEvent> {
    const deck = await this.findOwned(userId, deckId);

    const saved = await this.eventRepo.save(
      this.eventRepo.create({ deckId, gameEventId: dto.gameEventId, matches: dto.matches }),
    );

    await this.recalculateWinRate(deck);
    return this.eventRepo.findOne({ where: { id: saved.id }, relations: ['gameEvent'] }) as Promise<DeckEvent>;
  }

  async getEvents(userId: string, deckId: string): Promise<DeckEvent[]> {
    await this.findOwned(userId, deckId);
    return this.eventRepo.find({
      where:     { deckId },
      order:     { createdAt: 'DESC' },
      relations: ['gameEvent'],
    });
  }

  async updateEvent(userId: string, deckId: string, eventId: string, dto: AddEventRqDto): Promise<DeckEvent> {
    const deck  = await this.findOwned(userId, deckId);
    const event = await this.eventRepo.findOne({ where: { id: eventId, deckId } });
    if (!event) throw new NotFoundException('Evento no encontrado');
    event.gameEventId = dto.gameEventId;
    event.matches     = dto.matches;
    await this.eventRepo.save(event);
    await this.recalculateWinRate(deck);
    return this.eventRepo.findOne({ where: { id: eventId }, relations: ['gameEvent'] }) as Promise<DeckEvent>;
  }

  async remove(userId: string, deckId: string): Promise<void> {
    const deck = await this.findOwned(userId, deckId);
    await this.deckRepo.remove(deck);
  }

  // ── Private helpers ──────────────────────────────────────────────────────────

  private computeDeckCost(deck: Deck, priceMap: Map<number, number>): number | null {
    const entries = [
      ...deck.mainDeck,
      ...(Array.isArray(deck.runes) ? deck.runes : []),
      ...(deck.sideboard ?? []),
    ];
    let total  = 0;
    let hasAny = false;
    for (const e of entries) {
      const p = priceMap.get(e.cardId);
      if (p) { total += p * e.quantity; hasAny = true; }
    }
    for (const id of deck.battlefields) {
      const p = priceMap.get(id);
      if (p) { total += p; hasAny = true; }
    }
    return hasAny ? Math.round(total * 100) / 100 : null;
  }

  private async findOwned(userId: string, deckId: string): Promise<Deck> {
    const deck = await this.deckRepo.findOneBy({ id: deckId });
    if (!deck) throw new NotFoundException('Deck no encontrado');
    if (deck.userId !== userId) throw new ForbiddenException('No tienes acceso a este deck');
    return deck;
  }

  private checkLegal(mainDeck: DeckCardEntry[], battlefields: number[], runes: DeckCardEntry[]): boolean {
    if (mainDeck.length === 0) return false;
    const total = mainDeck.reduce((sum, e) => sum + e.quantity, 0);
    if (total !== 40) return false;
    if (mainDeck.some((e) => e.quantity > 3)) return false;
    if (battlefields.length !== 3) return false;
    if (new Set(battlefields).size !== 3) return false;
    const totalRunes = runes.reduce((s, e) => s + e.quantity, 0);
    if (totalRunes !== 12) return false;
    return true;
  }

  private async saveVersion(deck: Deck, note: string | null): Promise<DeckVersion> {
    const version = this.versionRepo.create({
      deckId:  deck.id,
      version: deck.currentVersion,
      note,
      snapshot: {
        legendId:         deck.legendId,
        chosenChampionId: deck.chosenChampionId,
        mainDeck:         deck.mainDeck,
        runes:            deck.runes,
        battlefields:     deck.battlefields,
        sideboard:        deck.sideboard,
      },
    });
    return this.versionRepo.save(version);
  }

  private async recalculateWinRate(deck: Deck): Promise<void> {
    const events = await this.eventRepo.findBy({ deckId: deck.id });
    if (events.length === 0) {
      deck.winRate = null;
    } else {
      const allRounds   = events.flatMap((e) => e.matches.flatMap((m) => m.rounds));
      const totalRounds = allRounds.length;
      const wins        = allRounds.filter((r) => r === 'win').length;
      const draws       = allRounds.filter((r) => r === 'draw').length;
      deck.winRate = parseFloat(((wins + draws * 0.5) / totalRounds * 100).toFixed(2));
    }
    await this.deckRepo.save(deck);
  }
}
