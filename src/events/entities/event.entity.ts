import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum EventType {
  EMAIL        = 'email',
  NOTIFICATION = 'notification',
}

export enum EventStatus {
  SENT   = 'sent',
  FAILED = 'failed',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: EventType })
  type!: EventType;

  @Column({ type: 'varchar' })
  subtype!: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId!: string | null;

  @Column({ type: 'varchar' })
  recipient!: string;

  @Column({ type: 'enum', enum: EventStatus })
  status!: EventStatus;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
