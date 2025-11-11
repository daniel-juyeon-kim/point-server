import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { PointHistoryEntity } from './point-history.entity';

@Entity()
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  point: number;

  @OneToMany(() => PointHistoryEntity, (history) => history.user, {
    nullable: true,
  })
  pointHistories: PointHistoryEntity[];
}
