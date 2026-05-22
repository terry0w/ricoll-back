import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/catalog.entity';
import { Variant } from './entities/variant.entity';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Variant)
    private readonly variantRepo: Repository<Variant>,
  ) {}

  findAll(limit = 50, offset = 0) {
    return this.productRepo.find({ take: limit, skip: offset });
  }

  findOne(id: number) {
    return this.productRepo.findOneBy({ productId: id });
  }

  private static readonly CARD_ORDER = `
    ORDER BY s.sort_order,
             regexp_replace(ext_number, '^([A-Za-z]*).*', '\\1'),
             CAST(regexp_replace(ext_number, '^[A-Za-z]*(\\d+).*', '\\1') AS INT),
             regexp_replace(ext_number, '^[A-Za-z]*\\d+([a-z]*).*', '\\1')`;
             

  getCards(limit = 100, offset = 0) {
    return this.productRepo.query(
      `SELECT c.* FROM cards c
       INNER JOIN sets s ON s.set_name = c.set_name
       ${CatalogService.CARD_ORDER}
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
  }

  getCardsAndVariants(limit = 100, offset = 0) {
    return this.variantRepo.query(
      `SELECT v.* FROM variants v
       INNER JOIN sets s ON s.set_name = v.set_name
       ${CatalogService.CARD_ORDER}, v.sub_type_name
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
  }
}
