import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserDto } from '../../api/user/dto/user.dto';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UserRepository {
  private readonly entity = UserEntity;

  async insert(em: EntityManager, { id, password }: UserDto) {
    const user = new UserEntity();
    user.id = id;
    user.password = password;

    await em.insert(UserEntity, user);
  }

  existBy(em: EntityManager, userId: string) {
    return em.existsBy(this.entity, { id: userId });
  }

  async findPasswordById(em: EntityManager, id: string) {
    const user = await em.findOne(this.entity, {
      select: { password: true },
      where: { id },
    });

    if (user === null) {
      throw new NotFoundException(`ID가 '${id}'인 사용자를 찾을 수 없습니다.`);
    }

    return user.password;
  }

  async findPointById(em: EntityManager, id: string) {
    const user = await em.findOne(this.entity, {
      select: { point: true },
      where: { id },
    });

    return user?.point;
  }

  async updatePointById(em: EntityManager, id: string, point: number) {
    await em.update(this.entity, id, { point });
  }
}
