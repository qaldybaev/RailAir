import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { AuthService } from '../auth.service';
import { JwtHelper } from 'src/helpers';
import { Role } from '@prisma/client';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(
        private readonly userService: AuthService,
        private readonly jwtService: JwtHelper,
    ) {
        super({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL,
            scope: ['email', 'public_profile'],
            profileFields: ['id', 'emails', 'name', 'displayName'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: Function,
    ): Promise<any> {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const providerId = profile.id;

        const user = await this.userService.validateSocialUser({
            name,
            email,
            phoneNumber: "",
            password: '',
            provider: 'facebook',
            role: Role.USER,
            providerId,
        });

        const token = await this.jwtService.generateToken({
            id: user.id,
            role: user.role,
        });
        console.log(user)

        return done(null, {
            user,
            accessToken: token,
        });
    }
}
