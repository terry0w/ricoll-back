import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CollectionController } from './collection.controller'
import { CollectionService } from './collection.service'
import { UserCard } from './entities/user-card.entity'

@Module({
  imports:     [TypeOrmModule.forFeature([UserCard])],
  controllers: [CollectionController],
  providers:   [CollectionService],
})
export class CollectionModule {}
