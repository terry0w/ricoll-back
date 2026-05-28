import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('game_events')
export class GameEvent {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: 'int', default: 0 })
  weight!: number;
}

export const GAME_EVENT_SEEDS = [
  { slug: 'friend_game',        name: 'Friend Game',              weight: 0 },
  { slug: 'casual_game',        name: 'Casual Game',              weight: 0 },
  { slug: 'online_game',        name: 'Online Game',              weight: 0 },
  { slug: 'competitive_online', name: 'Competitive Online Game',  weight: 0 },
  { slug: 'nexus_night',        name: 'Nexus Night',              weight: 0 },
  { slug: 'shop_tournament',    name: 'Shop Tournament',          weight: 0 },
  { slug: 'skirmish',           name: 'Skirmish',                 weight: 0 },
  { slug: 'regional_qualifier', name: 'Regional Qualifier',       weight: 0 },
];
