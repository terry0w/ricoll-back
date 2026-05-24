import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FilterOptionsRsDto } from './dto/filter-options-rs.dto';
import { GetCardsRqDto } from './dto/get-cards-rq.dto';
import { Card } from './entities/card.entity';
import { Variant } from './entities/variant.entity';

@Injectable()
export class CatalogService {
  private readonly logger = new Logger(CatalogService.name);

  constructor(
    @InjectRepository(Card)
    private readonly cardRepo: Repository<Card>,
    @InjectRepository(Variant)
    private readonly variantRepo: Repository<Variant>,
  ) {}

  // Standard card ordering: by set → number prefix letter → number → suffix
  private static readonly CARD_ORDER = `
    ORDER BY s.sort_order,
             regexp_replace(ext_number, '^([A-Za-z]*).*', '\\1'),
             CAST(regexp_replace(ext_number, '^[A-Za-z]*(\\d+).*', '\\1') AS INT),
             regexp_replace(ext_number, '^[A-Za-z]*\\d+([a-z]*).*', '\\1')`;

  // Builds a parameterized WHERE clause from active filters
  private buildWhereClause(dto: GetCardsRqDto): { where: string; params: unknown[] } {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (dto.name) {
      params.push(`%${dto.name}%`);
      conditions.push(`c.name ILIKE $${params.length}`);
    }
    if (dto.rarity) {
      params.push(dto.rarity);
      conditions.push(`c.ext_rarity = $${params.length}`);
    }
    if (dto.domain) {
      params.push(dto.domain);
      conditions.push(`c.ext_domain = $${params.length}`);
    }
    if (dto.cardType) {
      params.push(dto.cardType);
      conditions.push(`c.ext_card_type = $${params.length}`);
    }
    if (dto.setName) {
      params.push(dto.setName);
      conditions.push(`c.set_name = $${params.length}`);
    }

    return {
      where: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
      params,
    };
  }

  findAll(dto: GetCardsRqDto): Promise<Card[]> {
    this.logger.log(`Fetching catalog — limit: ${dto.limit}, offset: ${dto.offset}`);
    return this.cardRepo.find({ take: dto.limit, skip: dto.offset });
  }

  findOne(id: number): Promise<Card | null> {
    this.logger.log(`Fetching card id: ${id}`);
    return this.cardRepo.findOneBy({ productId: id });
  }

  getCards(dto: GetCardsRqDto): Promise<Card[]> {
    this.logger.log(`Fetching cards — limit: ${dto.limit}, offset: ${dto.offset}`);
    const { where, params } = this.buildWhereClause(dto);
    const limitIdx  = params.length + 1;
    const offsetIdx = params.length + 2;

    return this.cardRepo.query(
      `SELECT c.* FROM cards c
       INNER JOIN sets s ON s.set_name = c.set_name
       ${where}
       ${CatalogService.CARD_ORDER}
       LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      [...params, dto.limit ?? 100, dto.offset ?? 0],
    );
  }

  async getCardsCount(dto: GetCardsRqDto): Promise<{ total: number }> {
    this.logger.log('Counting cards with active filters');
    const { where, params } = this.buildWhereClause(dto);

    const result = await this.cardRepo.query(
      `SELECT COUNT(*) AS total FROM cards c
       INNER JOIN sets s ON s.set_name = c.set_name
       ${where}`,
      params,
    );
    return { total: Number(result[0].total) };
  }

  async getFilterOptions(): Promise<FilterOptionsRsDto> {
    this.logger.log('Fetching filter options');

    const [rarities, domains, cardTypes, sets] = await Promise.all([
      this.cardRepo.query(
        `SELECT DISTINCT ext_rarity AS rarity FROM cards WHERE ext_rarity IS NOT NULL ORDER BY ext_rarity`,
      ),
      this.cardRepo.query(
        `SELECT DISTINCT ext_domain AS domain FROM cards WHERE ext_domain IS NOT NULL ORDER BY ext_domain`,
      ),
      this.cardRepo.query(
        `SELECT DISTINCT ext_card_type AS "cardType" FROM cards WHERE ext_card_type IS NOT NULL ORDER BY ext_card_type`,
      ),
      this.cardRepo.query(
        `SELECT code, set_name AS "setName", label FROM sets ORDER BY sort_order`,
      ),
    ]);

    return {
      rarities: rarities.map((r: { rarity: string }) => r.rarity),
      domains:  domains.map((d: { domain: string }) => d.domain),
      cardTypes: cardTypes.map((c: { cardType: string }) => c.cardType),
      sets,
    };
  }

  getCardsAndVariants(dto: GetCardsRqDto): Promise<Variant[]> {
    this.logger.log(`Fetching cards with variants — limit: ${dto.limit}, offset: ${dto.offset}`);
    return this.variantRepo.query(
      `SELECT v.* FROM variants v
       INNER JOIN sets s ON s.set_name = v.set_name
       ${CatalogService.CARD_ORDER}, v.sub_type_name
       LIMIT $1 OFFSET $2`,
      [dto.limit ?? 100, dto.offset ?? 0],
    );
  }
}
