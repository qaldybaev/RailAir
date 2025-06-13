import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma';
import * as bcrypt from "bcryptjs"
import { UpdateMyProfileDto } from './dto/update.profile.dto';
import { FsHelper, JwtHelper } from 'src/helpers';



@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService, private fsService: FsHelper) { }
  async create(payload: CreateUserDto) {
    const foundedUser = await this.prisma.user.findFirst({ where: { email: payload.email } })

    if (foundedUser) {
      throw new BadRequestException("Bunday email'lik foydalanuvchi mavjud!")
    }

    const founded = await this.prisma.user.findFirst({ where: { phoneNumber: payload.phoneNumber } })

    if (founded) {
      throw new BadRequestException("Bunday nomer bilan foydalanuvchi royhattan o'tkan!")
    }
    const passwordHash = await bcrypt.hash(payload.password, 10)

    const newUser = await this.prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        password: passwordHash,
        role: payload.role,
        isBlocked: payload.isBlocked
      }
    })

    return {
      message: "Yangi foydalanuvchi yaratildi",
      data: newUser
    }
  }

  async findAll() {
    return await this.prisma.user.findMany({ include: { ticket: true } })
  }

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { ticket: true },
    });

    if (!user) {
      throw new NotFoundException("Foydalanuvchi topilmadi");
    }
    console.log(user)
    return {
      message: "Foydalanuvchi ma'lumotlari",
      data: user,
    };
  }

  async updateMe(id: number, payload: UpdateMyProfileDto, image: Express.Multer.File) {
  const user = await this.prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundException("Foydalanuvchi topilmadi");

  let passwordHash = user.password;
  if (payload.password) {
    passwordHash = await bcrypt.hash(payload.password, 10);
  }

  const existingUser = await this.prisma.user.findFirst({
    where: {
      OR: [
        { email: payload.email },
        { phoneNumber: payload.phoneNumber }
      ],
      NOT: { id }
    }
  });
  if (existingUser) {
    throw new ConflictException("Bu email yoki telefon raqami band");
  }

  let fileUrl = user.imageUrl;
  if (image) {
    if (user.imageUrl) {
      const oldPath = user.imageUrl
      if (oldPath) {
        await this.fsService.deleteFile(oldPath);
      }
    }

    const filePath = await this.fsService.uploadFile(image);
    fileUrl = filePath.fileUrl;
  }

  const updated = await this.prisma.user.update({
    where: { id },
    data: {
      name: payload.name,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      imageUrl: fileUrl,
      password: passwordHash,
    }
  });

  return {
    message: "Profil yangilandi ✅",
    data: updated,
  };
}

async deleteProfileImage(userId: number) {
  const user = await this.prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new NotFoundException("Foydalanuvchi topilmadi");
  }

  if (!user.imageUrl) {
    throw new BadRequestException("Foydalanuvchining rasmi mavjud emas");
  }
  await this.fsService.deleteFile(user.imageUrl);

  const updatedUser = await this.prisma.user.update({
    where: { id: userId },
    data: { imageUrl: null },
  });

  return {
    message: "Rasm muvaffaqiyatli o'chirildi ✅",
    data: updatedUser,
  };
}

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } })

    if (!user) {
      throw new NotFoundException("Id boyicha foydalanuvchi topilmadi")
    }

    await this.prisma.user.delete({ where: { id } })

    return {
      message: "ochirildi"
    }
  }
}
