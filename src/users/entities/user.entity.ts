import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { Permission } from '../../permissions/entities/permission.entity';
import { Role } from '../../roles/entities/role.entity';

// User entity handles roles and the active/suspend/ban status
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @ManyToOne(() => Role)
  role: Role;

  @Column({ default: 'active' }) // active, suspended, banned
  status: string;

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[]; // Individual atoms assigned to this user [cite: 4, 9]
}