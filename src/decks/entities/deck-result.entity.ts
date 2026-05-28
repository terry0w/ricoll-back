import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { GameEvent } from './game-event.entity';

export type GameOutcome = 'win' | 'loss' | 'draw';

@Entity('deck_results')
export class DeckResult {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'deck_id', type: 'uuid' })
  deckId!: string;

  @Column({ name: 'game_event_id', type: 'int' })
  gameEventId!: number;

  @ManyToOne(() => GameEvent, { eager: true })
  @JoinColumn({ name: 'game_event_id' })
  gameEvent!: GameEvent;

  @Column({ type: 'jsonb' })
  games!: GameOutcome[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
