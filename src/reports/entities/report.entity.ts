import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  type: string; // 'daily', 'weekly', 'monthly'

  @ManyToOne(() => User)
  author: User;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
