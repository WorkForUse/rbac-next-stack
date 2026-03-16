import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'in-progress' | 'completed';

  @Column({ type: 'date', nullable: true })
  dueDate: string;

  @Column({ nullable: true })
  dueTime: string;

  @Column({ default: 'medium', nullable: true })
  priority: 'low' | 'medium' | 'high';

  @Column({ default: 'Personal', nullable: true })
  category: string;

  @ManyToOne(() => User, { nullable: true })
  assignedTo?: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
