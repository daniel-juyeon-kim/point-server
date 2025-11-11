import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: '포인트 내역 ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    enum: PointType,
    description: '포인트 내역 타입 (적립 또는 차감)',
    example: PointType.EARN,
  })
  @Column({ type: 'simple-enum', enum: PointType })
  type: PointType;

  @ApiProperty({ description: '포인트 금액', example: 100 })
  @Column()
  amount: number;

  @ApiProperty({
    description: '내역 생성 시간',
    example: '2023-01-01T10:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: () => UserEntity, description: '관련 사용자 정보' })
  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;
}
