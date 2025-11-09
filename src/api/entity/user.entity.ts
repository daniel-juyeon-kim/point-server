import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { PointHistory } from './point-history.entity';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  password: string;

  @Column()
  point: number;

  @OneToMany(() => PointHistory, (history) => history.user, { nullable: true })
  pointHistories: PointHistory[];
}
