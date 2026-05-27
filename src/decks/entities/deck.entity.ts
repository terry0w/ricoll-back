import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface DeckCardEntry {
  cardId:   number;
  quantity: number;
}


@Entity('decks')
export class Deck {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ default: false })
  public!: boolean;

  @Column({ default: false })
  legal!: boolean;

  @Column({ name: 'current_version', type: 'smallint', default: 1 })
  currentVersion!: number;

  @Column({ name: 'win_rate', type: 'decimal', precision: 5, scale: 2, nullable: true })
  winRate!: number | null;

  @Column({ name: 'legend_id', type: 'int' })
  legendId!: number;

  @Column({ name: 'chosen_champion_id', type: 'int', nullable: true })
  chosenChampionId!: number | null;

  @Column({ name: 'main_deck', type: 'jsonb', default: '[]' })
  mainDeck!: DeckCardEntry[];

  @Column({ type: 'jsonb', default: '[]' })
  runes!: DeckCardEntry[];

  @Column({ type: 'jsonb', default: '[]' })
  battlefields!: number[];

  @Column({ type: 'jsonb', default: '[]' })
  sideboard!: DeckCardEntry[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
