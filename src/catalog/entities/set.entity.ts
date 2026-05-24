import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sets')
export class CardSet {
  @PrimaryColumn({ length: 10 })
  code!: string;

  @Column({ name: 'set_name', length: 50 })
  setName!: string;

  @Column({ length: 100 })
  label!: string;

  @Column({ name: 'sort_order' })
  sortOrder!: number;
}
