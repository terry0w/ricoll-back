import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum MatchResult {
  WIN  = 'win',
  LOSS = 'loss',
  DRAW = 'draw',
}

@Entity('deck_results')
export class DeckResult {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'deck_id', type: 'uuid' })
  deckId!: string;

  @Column({ name: 'version_id', type: 'uuid' })
  versionId!: string;

  @Column({ name: 'opponent_legend_id', type: 'int' })
  opponentLegendId!: number;

  @Column({ type: 'enum', enum: MatchResult })
  result!: MatchResult;

  @Column({ name: 'games_won', type: 'smallint' })
  gamesWon!: number;

  @Column({ name: 'games_lost', type: 'smallint' })
  gamesLost!: number;

  @Column({ name: 'played_at', type: 'timestamptz' })
  playedAt!: Date;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
