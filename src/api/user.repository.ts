import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entity/user.entity';

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
}
