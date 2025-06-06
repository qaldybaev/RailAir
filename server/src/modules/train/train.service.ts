import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { PrismaService } from 'src/prisma';

@Injectable()
export class TrainService {
  constructor(private prisma: PrismaService) { }
  async create(payload: CreateTrainDto) {
    const newReys = await this.prisma.train.create({
      data: {
        from: payload.from,
        to: payload.to,
        price: payload.price,
        arrivalTime: payload.arrivalTime,
        departureTime: payload.departureTime,
        seatCount: payload.seatCount,
        trainNumber: payload.trainNumber,
        availableSeats: payload.availableSeats,
      },
    });
    return {
      message: 'Yangi reys qoshildi',
      data: newReys,
    };
  }

  async findAll() {
    const reys = await this.prisma.train.findMany();

    return {
      message: 'Barcha resylar royxati',
      data: reys,
    };
  }

  async update(id: number, payload: UpdateTrainDto) {
    const reys = await this.prisma.train.findUnique({ where: { id } })

    if (!reys) {
      throw new NotFoundException('Id boyicha reys topilmadi')
    }

    const updateReys = await this.prisma.train.update({
      where: { id },
      data: {
        from: payload.from,
        to: payload.to,
        price: payload.price,
        arrivalTime: payload.arrivalTime,
        departureTime: payload.departureTime,
        seatCount: payload.seatCount,
        trainNumber: payload.trainNumber,
        availableSeats: payload.availableSeats,
      },
    });

    return {
      message: "Reys malumotlari yangilandi",
      data: updateReys
    }
  }

  async remove(id: number) {
    const reys = await this.prisma.train.findUnique({ where: { id } })

    if (!reys) {
      throw new NotFoundException('Id boyicha reys topilmadi')
    }

    await this.prisma.train.delete({ where: { id } })

    return {
      message: "Reys ochirildi"
    }
  }
}
