import { Column, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm'

@Entity('user_cards')
@Unique(['userId', 'productId', 'subTypeName'])
export class UserCard {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string

  @Column({ name: 'product_id', type: 'int' })
  productId!: number

  @Column({ name: 'sub_type_name', length: 20, default: 'Normal' })
  subTypeName!: string

  @Column({ type: 'int', default: 1 })
  quantity!: number

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date
}
