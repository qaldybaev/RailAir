import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/decorators';


@Injectable()
export class CheckRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    if (!roles || !Array.isArray(roles)) {
      return true;
    }
    
    if (!request.role) {
      throw new NotAcceptableException("Foydalanuvchi roli aniqlanmadi");
    }


    if (!roles.includes(request.role)) {
      throw new NotAcceptableException("Sizda ruhsat yo'q");
    }

    return true;
  }
}
