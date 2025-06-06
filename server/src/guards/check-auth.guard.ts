import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { PROTECTED_KEY } from 'src/decorators';
import { JwtHelper } from 'src/helpers';

@Injectable()
export class CheckAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtHelper: JwtHelper,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isProtected = this.reflector.getAllAndOverride<boolean>(
      PROTECTED_KEY,
      [context.getHandler(), context.getClass()],
    );

    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    if (!isProtected) {
      req.role = Role.USER;
      return true;
    }

    const authHeader = req.headers['authorization'];
    const refreshToken = req.headers['x-refresh-token'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new BadRequestException(
        "Authorization headerda Bearer token bo'lishi kerak",
      );
    }

    const accessToken = authHeader.split(' ')[1];

    try {
      const data = await this.jwtHelper.verifyToken(accessToken);

      req.role = data.role;
      req.userId = data.id;

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException && refreshToken) {
        try {
          const refreshData = await this.jwtHelper.verifyToken(refreshToken);

          const { token: newAccessToken } = await this.jwtHelper.generateToken({
            id: refreshData.id,
            role: refreshData.role,
          });

          const { refreshToken: newRefreshToken } =
            await this.jwtHelper.generateRefreshToken({
              id: refreshData.id,
              role: refreshData.role,
            });

          res.setHeader('Authorization', `Bearer ${newAccessToken}`);
          res.setHeader('x-refresh-token', newRefreshToken);

          req.role = refreshData.role;
          req.userId = refreshData.id;

          return true;
        } catch {
          throw new UnauthorizedException(
            "Refresh token noto'g'ri yoki muddati tugagan",
          );
        }
      }

      throw error;
    }
  }
}
