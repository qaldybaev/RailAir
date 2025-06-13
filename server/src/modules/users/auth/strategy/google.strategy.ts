import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { JwtHelper } from 'src/helpers';
import { Role } from '@prisma/client';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly userService: AuthService,
    private jwtService: JwtHelper,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: any,
    refreshToken: any,
    profile: any,
    done: any,
  ): Promise<any> {
    const email = profile._json.email;
    const name = profile.displayName;
    const providerId = profile.id;

    const user = await this.userService.validateSocialUser({
      name,
      email,
      phoneNumber: '',
      password: '',
      provider: 'google',
      role: Role.USER,
      providerId,
    });

    const token = await this.jwtService.generateToken({
      id: user.id,
      role: user.role,
    });

    const rToken = await this.jwtService.generateRefreshToken({
      id: user.id,
      role: user.role,
    });

    return done(null, {
      user,
      accessToken: token,
      refreshToken: rToken,
    });
  }
}
