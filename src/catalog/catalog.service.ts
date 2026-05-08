import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/catalog.entity';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  findAll(limit = 50, offset = 0) {
    return this.productRepo.find({ take: limit, skip: offset });
  }

  findOne(id: number, subTypeName: string) {
    return this.productRepo.findOneBy({ productId: id, subTypeName });
  }
}
