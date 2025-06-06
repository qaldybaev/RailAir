import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma';
import * as bcrypt from "bcryptjs"


@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }
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


  async update(id: number, payload: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } })

    if (!user) {
      throw new NotFoundException("Id boyicha foydalanuvchi topilmadi")
    }

    let passwordHash = user.password
    if (payload.password) {
      passwordHash = await bcrypt.hash(payload.password, 10)
    }

    const updateUser = await this.prisma.user.update({
      where: { id }, data: {
        name: payload.name,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        password: passwordHash,
        role: payload.role,
        isBlocked: payload.isBlocked
      }
    })
    return {
      message: "Foydalanuvchi muvaffaqiyatli yangilandi ✅",
      data: updateUser,
    }
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
