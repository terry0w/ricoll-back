import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/catalog.entity';
import { Variant } from './entities/variant.entity';
import { CardSet } from './entities/set.entity';

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

  getCards(limit = 100, offset = 0) {
    return this.productRepo
      .createQueryBuilder('c')
      .innerJoin(CardSet, 's', 's.setName = c.setName')
      .orderBy('s.sortOrder', 'ASC')
      .addOrderBy('c.productId', 'ASC')
      .take(limit)
      .skip(offset)
      .getMany();
  }

  getCardsAndVariants(limit = 100, offset = 0) {
    return this.variantRepo
      .createQueryBuilder('v')
      .innerJoin(CardSet, 's', 's.setName = v.setName')
      .orderBy('s.sortOrder', 'ASC')
      .addOrderBy('v.productId', 'ASC')
      .addOrderBy('v.subTypeName', 'ASC')
      .take(limit)
      .skip(offset)
      .getMany();
  }
}
