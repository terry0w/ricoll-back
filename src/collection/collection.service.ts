import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserCard } from './entities/user-card.entity'

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(UserCard)
    private readonly userCardRepo: Repository<UserCard>,
  ) {}

  getCollection(userId: string): Promise<UserCard[]> {
    return this.userCardRepo.findBy({ userId })
  }

  async patchEntry(userId: string, productId: number, delta: number): Promise<UserCard | null> {
    const entry = await this.userCardRepo.findOneBy({ userId, productId })

    if (entry) {
      entry.quantity = Math.max(0, entry.quantity + delta)
      if (entry.quantity === 0) {
        await this.userCardRepo.remove(entry)
        return null
      }
      return this.userCardRepo.save(entry)
    }

    if (delta <= 0) return null

    const created = this.userCardRepo.create({ userId, productId, quantity: delta })
    return this.userCardRepo.save(created)
  }
}
