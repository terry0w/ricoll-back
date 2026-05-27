import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { DeckCardEntry } from './deck.entity';

export interface DeckSnapshot {
  legendId:          number;
  chosenChampionId:  number | null;
  mainDeck:          DeckCardEntry[];
  runes:             DeckCardEntry[];
  battlefields:      number[];
  sideboard:         DeckCardEntry[];
}

@Entity('deck_versions')
export class DeckVersion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'deck_id', type: 'uuid' })
  deckId!: string;

  @Column({ type: 'smallint' })
  version!: number;

  @Column({ type: 'jsonb' })
  snapshot!: DeckSnapshot;

  @Column({ type: 'varchar', length: 200, nullable: true })
  note!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
