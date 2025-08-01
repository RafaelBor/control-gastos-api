import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './auth.entity';

@Entity('email_verifications')
export class EmailVerificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  expiresAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.emailVerifications, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @Column({ default: false })
  used: boolean;
}