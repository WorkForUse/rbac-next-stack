import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string; // e.g., "USER_BANNED", "PERMISSION_GRANTED"

  @Column()
  performedBy: string; // Admin/Manager ID

  @Column({ nullable: true })
  userId: string; // Affected user ID

  @Column('text', { nullable: true })
  details: string; // JSON details or description..............

  @Column({ nullable: true })
  resourceId: string; // e.g., lead ID, user ID effected

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}