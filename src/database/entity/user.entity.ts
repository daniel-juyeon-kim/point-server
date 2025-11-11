import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { PointHistoryEntity } from './point-history.entity';

@Entity()
export class UserEntity {
  @ApiProperty({ description: '사용자 ID', example: 'testuser' })
  @PrimaryColumn()
  id: string;

  @ApiProperty({ description: '사용자 비밀번호', example: 'hashed_password' })
  @Column()
  password: string;

  @ApiProperty({ description: '사용자 포인트 잔액', example: 1000 })
  @Column({ default: 0 })
  point: number;

  @ApiProperty({
    type: () => [PointHistoryEntity],
    description: '사용자의 포인트 내역 목록',
  })
  @OneToMany(() => PointHistoryEntity, (history) => history.user, {
    nullable: true,
  })
  pointHistories: PointHistoryEntity[];
}
