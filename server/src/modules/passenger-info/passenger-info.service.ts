import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePassengerInfoDto } from './dto/create-passenger-info.dto';
import { UpdatePassengerInfoDto } from './dto/update-passenger-info.dto';
import { PrismaService } from 'src/prisma';

@Injectable()
export class PassengerInfoService {
  constructor(private prisma: PrismaService) { }
  async create(payload: CreatePassengerInfoDto) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: payload.ticketId },
    });

    if (!ticket) {
      throw new NotFoundException('Chipta topilmadi');
    }

    const newUser = await this.prisma.passengerInfo.create({
      data: {
        fullName: payload.fullName,
        passport: payload.passport,
        birthDate: payload.birthDate,
        gender: payload.gender,
        ticketId: payload.ticketId,
      },
    });
    await this.prisma.ticket.update({
      where: { id: payload.ticketId },
      data: { passengerInfoId: newUser.id }
    });

    return {
      message: "yaratildi",
      data: newUser
    }
  }

  async findAll() {
    const passengerInfos = await this.prisma.passengerInfo.findMany({ include: { ticket: true } });
    return {
      message: "Barcha foydalanuvchilar pasport ma'lumotlari",
      data: passengerInfos,
    };
  }

  async findOne(id: number) {
    const passengerInfo = await this.prisma.passengerInfo.findUnique({
      where: { id },
    });

    if (!passengerInfo) {
      throw new NotFoundException(`Pasport: ${id} topilmadi`);
    }

    return passengerInfo;
  }

  async update(id: number, payload: UpdatePassengerInfoDto) {
    const passengerInfo = await this.prisma.passengerInfo.findUnique({
      where: { id },
    });

    if (!passengerInfo) {
      throw new NotFoundException(`Pasport: ${id} topilmadi`);
    }

    const updatedPassengerInfo = await this.prisma.passengerInfo.update({
      where: { id },
      data: payload,
    });

    return {
      message: "Yangilandi",
      data: updatedPassengerInfo,
    };
  }

  async remove(id: number) {
    const passengerInfo = await this.prisma.passengerInfo.findUnique({
      where: { id },
    });

    if (!passengerInfo) {
      throw new NotFoundException(`Pasport: ${id} topilmadi`);
    }

    await this.prisma.passengerInfo.delete({ where: { id } });

    return {
      message: "O'chirildi",
    };
  }
}
