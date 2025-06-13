import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
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

    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (!accessToken) {
      if (!refreshToken) {
        throw new UnauthorizedException('Access token mavjud emas');
      }

      try {
        const refreshData =
          await this.jwtHelper.verifyRefreshToken(refreshToken);

        const { token: newAccessToken } = await this.jwtHelper.generateToken({
          id: refreshData.id,
          role: refreshData.role,
        });

        const { refreshToken: newRefreshToken } =
          await this.jwtHelper.generateRefreshToken({
            id: refreshData.id,
            role: refreshData.role,
          });

        res.cookie('accessToken', newAccessToken, {
          maxAge: 1000 * 60 * 15,
          sameSite: 'lax',
          secure: false,
        });

        res.cookie('refreshToken', newRefreshToken, {
          maxAge: 1000 * 60 * 60 * 24 * 7,
          sameSite: 'lax',
          secure: false,
        });

        req.role = refreshData.role;
        req.userId = refreshData.id;

        return true;
      } catch {
        throw new UnauthorizedException(
          "Refresh token noto'g'ri yoki muddati tugagan",
        );
      }
    }
    try {
      const data = await this.jwtHelper.verifyToken(accessToken);

      req.role = data.role;
      req.userId = data.id;

      return true;
    } catch {
      if (!refreshToken) {
        throw new UnauthorizedException(
          "Access token noto'g'ri yoki muddati tugagan",
        );
      }

      try {
        const refreshData =
          await this.jwtHelper.verifyRefreshToken(refreshToken);

        const { token: newAccessToken } = await this.jwtHelper.generateToken({
          id: refreshData.id,
          role: refreshData.role,
        });

        const { refreshToken: newRefreshToken } =
          await this.jwtHelper.generateRefreshToken({
            id: refreshData.id,
            role: refreshData.role,
          });

        res.cookie('accessToken', newAccessToken, {
          maxAge: 1000 * 60 * 15,
          sameSite: 'lax',
          secure: false,
        });

        res.cookie('refreshToken', newRefreshToken, {
          maxAge: 1000 * 60 * 60 * 24 * 7,
          sameSite: 'lax',
          secure: false,
        });

        req.role = refreshData.role;
        req.userId = refreshData.id;

        return true;
      } catch {
        throw new UnauthorizedException(
          "Refresh token noto'g'ri yoki muddati tugagan",
        );
      }
    }
  }
}
