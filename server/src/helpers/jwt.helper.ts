import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Role } from '@prisma/client';

@Injectable()
export class JwtHelper {
  constructor(private jwt: JwtService) {}

  async generateToken(payload: { id: number; role: Role }) {
    const token = await this.jwt.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    });

    return { token };
  }

  async verifyToken(token: string) {
    try {
      const decodedData = await this.jwt.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
      return decodedData;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ForbiddenException('Access token muddati tugagan');
      }

      if (error instanceof JsonWebTokenError) {
        throw new BadRequestException('Access token formati notogri');
      }

      throw new InternalServerErrorException(
        'Access token tekshiruvda xatolik',
      );
    }
  }

  async generateRefreshToken(payload: { id: number; role: Role }) {
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    });

    return { refreshToken };
  }

  async verifyRefreshToken(token: string) {
    try {
      const decoded = await this.jwt.verifyAsync(token, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      return decoded;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ForbiddenException('Refresh token muddati tugagan');
      }

      if (error instanceof JsonWebTokenError) {
        throw new BadRequestException('Refresh token formati notogri');
      }

      throw new InternalServerErrorException(
        'Refresh token tekshiruvda xatolik',
      );
    }
  }
}
