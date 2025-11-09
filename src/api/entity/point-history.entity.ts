import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

enum PointType {
  EARN = 'EARN',
  SPEND = 'SPEND',
}

@Entity()
export class PointHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: PointType })
  type: PointType;

  @Column()
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;
}
