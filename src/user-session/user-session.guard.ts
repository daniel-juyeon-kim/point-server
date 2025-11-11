import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class UserSessionGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Express.Request>();

    const sessionStore = req.sessionStore;
    const sid = req.session.id;

    return new Promise<boolean>((resolve) => {
      sessionStore.get(sid, (err, session) => {
        if (err) {
          return resolve(false);
        } else if (session === null) {
          return resolve(false);
        }

        resolve(true);
      });
    });
  }
}
