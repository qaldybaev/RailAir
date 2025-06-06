import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { PrismaService } from 'src/prisma';

@Injectable()
export class FlightService {
  constructor(private readonly prisma: PrismaService) { }
  async create(payload: CreateFlightDto) {
    const newReys = await this.prisma.flight.create({
      data: {
        from: payload.from,
        to: payload.to,
        price: payload.price,
        arrivalTime: payload.arrivalTime,
        departureTime: payload.departureTime,
        seatCount: payload.seatCount,
        airline: payload.airline,
        availableSeats: payload.availableSeats,
      },
    });
    return {
      message: 'Yangi reys qoshildi',
      data: newReys,
    };
  }

  async findAll() {
    const reys = await this.prisma.flight.findMany();

    return {
      message: 'Barcha resylar royxati',
      data: reys,
    };
  }

  async update(id: number, payload: UpdateFlightDto) {
    const reys = await this.prisma.flight.findUnique({ where: { id } })

    if (!reys) {
      throw new NotFoundException('Id boyicha reys topilmadi')
    }

    const updateReys = await this.prisma.flight.update({
      where: { id },
      data: {
        from: payload.from,
        to: payload.to,
        price: payload.price,
        arrivalTime: payload.arrivalTime,
        departureTime: payload.departureTime,
        seatCount: payload.seatCount,
        airline: payload.airline,
        availableSeats: payload.availableSeats,
      },
    });

    return {
      message: "Reys malumotlari yangilandi",
      data: updateReys
    }
  }

  async remove(id: number) {
    const reys = await this.prisma.flight.findUnique({ where: { id } })

    if (!reys) {
      throw new NotFoundException('Id boyicha reys topilmadi')
    }

    await this.prisma.flight.delete({ where: { id } })

    return {
      message: "Reys ochirildi"
    }
  }
}
