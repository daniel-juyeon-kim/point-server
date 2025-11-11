import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

export enum PointType {
  EARN = 'EARN',
  SPEND = 'SPEND',
}

@Entity()
export class PointHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'simple-enum', enum: PointType })
  type: PointType;

  @Column()
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;
}
