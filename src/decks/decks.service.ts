import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AddResultRqDto } from './dto/add-result-rq.dto';
import { CreateDeckRqDto } from './dto/create-deck-rq.dto';
import { DeckResult } from './entities/deck-result.entity';
import { DeckVersion } from './entities/deck-version.entity';
import { Deck, DeckCardEntry } from './entities/deck.entity';

@Injectable()
export class DecksService {
  constructor(
    @InjectRepository(Deck)
    private readonly deckRepo: Repository<Deck>,
    @InjectRepository(DeckVersion)
    private readonly versionRepo: Repository<DeckVersion>,
    @InjectRepository(DeckResult)
    private readonly resultRepo: Repository<DeckResult>,
  ) {}

  async create(userId: string, dto: CreateDeckRqDto): Promise<Deck> {
    const mainDeck  = dto.mainDeck  ?? [];
    const sideboard = dto.sideboard ?? [];

    const legal = this.checkLegal(mainDeck, dto.battlefields ?? [], dto.runes ?? []);

    if (dto.public && !legal) {
      throw new BadRequestException('Un deck público debe ser legal');
    }

    const deck = this.deckRepo.create({
      userId,
      name:              dto.name,
      public:            dto.public  ?? false,
      legal,
      legendId:          dto.legendId,
      chosenChampionId:  dto.chosenChampionId ?? null,
      mainDeck,
      runes:             dto.runes        ?? {},
      battlefields:      dto.battlefields ?? [],
      sideboard,
      currentVersion:    1,
    });

    const saved = await this.deckRepo.save(deck);
    await this.saveVersion(saved, null);
    return saved;
  }

  async update(userId: string, deckId: string, dto: CreateDeckRqDto, note?: string, skipVersion = false): Promise<Deck> {
    const deck = await this.findOwned(userId, deckId);

    const mainDeck  = dto.mainDeck  ?? [];
    const sideboard = dto.sideboard ?? [];
    const legal     = this.checkLegal(mainDeck, dto.battlefields ?? [], dto.runes ?? []);

    if (dto.public && !legal) {
      throw new BadRequestException('Un deck público debe ser legal');
    }

    deck.name             = dto.name;
    deck.public           = dto.public           ?? false;
    deck.legal            = legal;
    deck.legendId         = dto.legendId;
    deck.chosenChampionId = dto.chosenChampionId ?? null;
    deck.mainDeck         = mainDeck;
    deck.runes            = dto.runes             ?? [];
    deck.battlefields     = dto.battlefields      ?? [];
    deck.sideboard        = sideboard;

    if (!skipVersion) {
      deck.currentVersion += 1;
    }

    const saved = await this.deckRepo.save(deck);

    if (!skipVersion) {
      await this.saveVersion(saved, note ?? null);
    }

    return saved;
  }

  async setPublic(userId: string, deckId: string, isPublic: boolean): Promise<Deck> {
    const deck = await this.findOwned(userId, deckId);
    if (isPublic && !deck.legal) {
      throw new BadRequestException('Un deck público debe ser legal');
    }
    deck.public = isPublic;
    return this.deckRepo.save(deck);
  }

  findAllByUser(userId: string): Promise<Deck[]> {
    return this.deckRepo.findBy({ userId });
  }

  findPublic(): Promise<Deck[]> {
    return this.deckRepo.findBy({ public: true, legal: true });
  }

  async findOne(userId: string, deckId: string): Promise<Deck> {
    return this.findOwned(userId, deckId);
  }

  async getVersions(userId: string, deckId: string): Promise<DeckVersion[]> {
    await this.findOwned(userId, deckId);
    return this.versionRepo.findBy({ deckId });
  }

  async addResult(userId: string, deckId: string, dto: AddResultRqDto): Promise<DeckResult> {
    const deck = await this.findOwned(userId, deckId);

    const result = this.resultRepo.create({
      deckId,
      versionId:        dto.versionId,
      opponentLegendId: dto.opponentLegendId,
      result:           dto.result,
      gamesWon:         dto.gamesWon,
      gamesLost:        dto.gamesLost,
      playedAt:         new Date(dto.playedAt),
      notes:            dto.notes ?? null,
    });

    await this.resultRepo.save(result);
    await this.recalculateWinRate(deck);
    return result;
  }

  getResults(userId: string, deckId: string): Promise<DeckResult[]> {
    return this.findOwned(userId, deckId).then(() =>
      this.resultRepo.findBy({ deckId }),
    );
  }

  async remove(userId: string, deckId: string): Promise<void> {
    const deck = await this.findOwned(userId, deckId);
    await this.deckRepo.remove(deck);
  }

  // ── Private helpers ──────────────────────────────────────────────────────────

  private async findOwned(userId: string, deckId: string): Promise<Deck> {
    const deck = await this.deckRepo.findOneBy({ id: deckId });
    if (!deck) throw new NotFoundException('Deck no encontrado');
    if (deck.userId !== userId) throw new ForbiddenException('No tienes acceso a este deck');
    return deck;
  }

  private checkLegal(mainDeck: DeckCardEntry[], battlefields: number[], runes: DeckCardEntry[]): boolean {
    if (mainDeck.length === 0) return false;

    // 40 cartas exactas
    const total = mainDeck.reduce((sum, e) => sum + e.quantity, 0);
    if (total !== 40) return false;

    // Máximo 3 copias por carta
    if (mainDeck.some((e) => e.quantity > 3)) return false;

    // 3 battlefields
    if (battlefields.length !== 3) return false;

    // Sin battlefields repetidos
    if (new Set(battlefields).size !== 3) return false;

    // 12 runas exactas
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
    const results = await this.resultRepo.findBy({ deckId: deck.id });
    if (results.length === 0) {
      deck.winRate = null;
    } else {
      const wins  = results.filter((r) => r.result === 'win').length;
      const draws = results.filter((r) => r.result === 'draw').length;
      deck.winRate = parseFloat(((wins + draws * 0.5) / results.length * 100).toFixed(2));
    }
    await this.deckRepo.save(deck);
  }
}
