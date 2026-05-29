import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 100 })
  email!: string;

  @Column({ length: 50 })
  username!: string;

  @Column({ type: 'varchar', unique: true, length: 50, nullable: true })
  nickname!: string | null;

  @Column({ type: 'varchar', nullable: true })
  password!: string | null;

  @Column({ name: 'google_id', type: 'varchar', unique: true, nullable: true })
  googleId!: string | null;

  @Column({ type: 'varchar', nullable: true })
  verificationToken!: string | null;

  @Column({ name: 'verified_at', type: 'timestamptz', nullable: true })
  verifiedAt!: Date | null;

  @Column({ type: 'varchar', nullable: true })
  resetPasswordToken!: string | null;

  @Column({ name: 'reset_password_expires', type: 'timestamptz', nullable: true })
  resetPasswordExpires!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
