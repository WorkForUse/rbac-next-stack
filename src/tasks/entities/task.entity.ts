import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  status: string; // 'pending', 'in_progress', 'completed'

  @ManyToOne(() => User)
  assignedTo: User;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
