import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreatePassengerInfoDto } from './dto/create-passenger-info.dto';
import { UpdatePassengerInfoDto } from './dto/update-passenger-info.dto';

@Injectable()
export class PassengerInfoService {
  constructor(private prisma: PrismaService) { }

  async create(payload: CreatePassengerInfoDto) {
    const pasport = await this.prisma.passengerInfo.findUnique({ where: { passport: payload.passport } })
    if(pasport){
      throw new BadRequestException("Bunday pasport bilan foydalanuvichi royhattan o'tgan")
    }
    console.log(payload)
    if (!payload.userId) {
      throw new BadRequestException("Foydalanuvchi ID topilmadi");
    }

    const newPassenger = await this.prisma.passengerInfo.create({
      data: {
        fullName: payload.fullName,
        passport: payload.passport,
        birthDate: payload.birthDate,
        gender: payload.gender,
        userId: payload.userId,
      },
    });

    return {
      message: "Yolovchi ma'lumotlari yaratildi",
      data: newPassenger,
    };
  }

  async findAll() {
    const all = await this.prisma.passengerInfo.findMany();
    return {
      message: "Barcha yolovchi ma'lumotlari",
      data: all,
    };
  }

  async findOne(id: number) {
    const found = await this.prisma.passengerInfo.findUnique({
      where: { id },
    });

    if (!found) {
      throw new NotFoundException(`ID: ${id} bilan yolovchi topilmadi`);
    }

    return {
      message: "Topildi",
      data: found,
    };
  }

  async update(id: number, payload: UpdatePassengerInfoDto) {
    const exists = await this.prisma.passengerInfo.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException(`ID: ${id} bilan yolovchi topilmadi`);
    }

    const updated = await this.prisma.passengerInfo.update({
      where: { id },
      data: payload,
    });

    return {
      message: "Yangilandi",
      data: updated,
    };
  }

  async remove(id: number) {
    const exists = await this.prisma.passengerInfo.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException(`ID: ${id} bilan yo‘lovchi topilmadi`);
    }

    await this.prisma.passengerInfo.delete({ where: { id } });

    return {
      message: "Ochirildi",
    };
  }
}
