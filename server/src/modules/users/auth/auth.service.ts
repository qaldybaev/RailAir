import {
  BadRequestException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { LoginDto, RegisterDto } from './dtos';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { JwtHelper } from 'src/helpers';
import { GoogleRegisterDto } from './dtos/validateSocialUser.dto';
import { MailService } from '../mail';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtHelper,
    private mail: MailService,
  ) { }

  async onModuleInit() {
    await this.seedUser();
  }

  async register(payload: RegisterDto) {
    const foundedUser = await this.prisma.user.findFirst({
      where: { email: payload.email },
    });

    if (foundedUser) {
      throw new BadRequestException("Bunday email'lik foydalanuvchi mavjud!");
    }

    const founded = await this.prisma.user.findFirst({
      where: { phoneNumber: payload.phoneNumber },
    });

    if (founded) {
      throw new BadRequestException(
        "Bunday nomer bilan foydalanuvchi royhattan o'tkan!",
      );
    }
    const passwordHash = await bcrypt.hash(payload.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        password: passwordHash,
        provider:payload.provider || "local",
        role: Role.USER,
        isBlocked: false,
      },
    });

    return {
      message: 'Muvaffaqiyatli royxatdan otdi ✅',
      data: newUser,
    };
  }
  async validateSocialUser(dto: GoogleRegisterDto) {
    let user = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: '',
          phoneNumber: dto.phoneNumber ?? '',
          provider: dto.provider,
          providerId: dto.providerId,
          role: dto.role,
          isBlocked: false,
        },
      });
    }

    return user;
  }

  async login(payload: LoginDto) {
    const foundedUser = await this.prisma.user.findFirst({
      where: { email: payload.email },
    });

    if (!foundedUser) {
      throw new BadRequestException(
        "Bunday email'lik foydalanuvchi mavjud emas!",
      );
    }
    if (foundedUser.isBlocked) {
      throw new BadRequestException('Sizning profilingiz bloklangan ❌');
    }
    if (!foundedUser || !foundedUser.password) {
      throw new UnauthorizedException('Foydalanuvchi topilmadi yoki parol yoq');
    }

    const isMatch = await bcrypt.compare(
      payload.password,
      foundedUser.password,
    );

    if (!isMatch) {
      throw new BadRequestException('Parol xato kiritildi!');
    }

    const { token } = await this.jwtService.generateToken({
      id: foundedUser.id,
      role: foundedUser.role,
    });
    const { refreshToken } = await this.jwtService.generateRefreshToken({
      id: foundedUser.id,
      role: foundedUser.role,
    });

    return {
      message: 'Muvaffaqiyatli kirildi ✅',
      data: {
        token,
        refreshToken,
        user: foundedUser,
      },
    };
  }

  async seedUser() {
    const defultUser = [
      {
        name: 'Nurken',
        email: 'nurkenqaldybaev2001@gmail.com',
        password: '123456',
        phoneNumber: '+998941234569',
        role: Role.ADMIN,
      },
    ];

    for (let user of defultUser) {
      const foundedUser = await this.prisma.user.findFirst({
        where: { email: user.email },
      });

      if (!foundedUser) {
        const passwordHash = bcrypt.hashSync(user.password);
        await this.prisma.user.create({
          data: {
            name: user.name,
            role: user.role,
            email: user.email,
            phoneNumber: user.phoneNumber,
            provider: 'local',
            password: passwordHash,
            isBlocked: false,
          },
        });
      }
      console.log('Admin yaratildi✅');
    }
  }

  async forgotPassword({ email }: { email: string }) {
    const user = await this.prisma.user.findFirst({ where: { email } });

    if (!user) {
      throw new BadRequestException('Foydalanuvchi topilmadi');
    }
    return await this.sendOtp(email);
  }


  async resetPassword({ email, code, newPassword }: { email: string; code: string; newPassword: string; }) {
    
    await this.verifyOtp(email, code);


    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    return {
      message: 'Parolingiz muvaffaqiyatli yangilandi ✅',
    };
  }


  async sendOtp(email: string) {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recentOtps = await this.prisma.otpCode.findMany({
      where: {
        email,
        createdAt: { gte: tenMinutesAgo },
      },
    });

    if (recentOtps.length >= 5) {
      const lastOtpTime = recentOtps[recentOtps.length - 1].createdAt;
      const blockedUntil = new Date(lastOtpTime.getTime() + 15 * 60 * 1000);

      if (blockedUntil > new Date()) {
        const minutesLeft = Math.ceil(
          (blockedUntil.getTime() - Date.now()) / 60000,
        );
        throw new BadRequestException(
          `Siz juda kop kod soradingiz. Iltimos, ${minutesLeft} daqiqadan keyin qayta urinib koring.`,
        );
      }
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 1 * 60 * 1000);

    await this.prisma.otpCode.create({
      data: { email, code, expiresAt },
    });

    await this.mail.sendMail({
      to: email,
      subject: 'Tasdiqlash kodi',
      text: `Sizning tasdiqlash kodingiz: ${code}`,
    });

    return { message: 'Kod emailingizga yuborildi' };
  }

  async verifyOtp(email: string, code: string) {
    const now = new Date();
    const otpRecord = await this.prisma.otpCode.findFirst({
      where: {
        email,
        code,
        expiresAt: {
          gt: now,
        },
      },
    });

    if (!otpRecord) {
      throw new BadRequestException('Kod notogri yoki muddati otgan');
    }
    await this.prisma.otpCode.delete({
      where: { id: otpRecord.id },
    });

    return { message: 'Kod tasdiqlandi' };
  }
}
