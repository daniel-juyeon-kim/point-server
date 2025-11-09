import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

enum PointType {
  EARN = 'EARN',
  SPEND = 'SPEND',
}

@Entity()
export class PointHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: PointType })
  type: PointType;

  @Column()
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
