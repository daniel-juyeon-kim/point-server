import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/database/repository/user.repository';
import { PartialUserSession } from 'src/domain/user-session.interface';
import { DataSource } from 'typeorm';

@Injectable()
export class UserSessionGuard implements CanActivate {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<{ session: PartialUserSession }>();
    const { userId } = req.session;

    if (!userId) {
      return false;
    }

    return this.userRepository.existBy(this.dataSource.manager, userId);
  }
}
