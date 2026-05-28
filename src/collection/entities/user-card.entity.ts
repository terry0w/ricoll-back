import { Column, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm'

@Entity('user_cards')
@Unique(['userId', 'productId'])
export class UserCard {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string

  @Column({ name: 'product_id', type: 'int' })
  productId!: number

  @Column({ type: 'int', default: 1 })
  quantity!: number

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date
}
