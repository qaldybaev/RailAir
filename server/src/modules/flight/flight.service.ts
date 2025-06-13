import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { PrismaService } from 'src/prisma';
import * as path from 'node:path';
import * as fs from 'fs/promises';

@Injectable()
export class FlightService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) { }

  async onModuleInit() {
      await this.seedFlight()
  }

  async create(payload: CreateFlightDto) {
    const departureDate = new Date(payload.departureTime);
    const arrivalDate = new Date(payload.arrivalTime);

    const newReys = await this.prisma.flight.create({
      data: {
        from: payload.from,
        to: payload.to,
        price: payload.price,
        arrivalTime: arrivalDate,
        departureTime: departureDate,
        seatCount: payload.seatCount,
        airline: payload.airline,
        availableSeats: payload.availableSeats,
      },
    });

    return {
      message: 'Yangi reys qo‘shildi',
      data: newReys,
    };
  }

  async findAll() {
    const reys = await this.prisma.flight.findMany();

    return {
      message: 'Barcha reyslar ro‘yxati',
      data: reys,
    };
  }

  async search(from: string, to: string, date?: string) {
    if (!from || !to) {
      throw new NotFoundException("'from' va 'to' qiymatlari kiritilishi shart");
    }

    const filters: any = {
      from: {
        contains: from,
        mode: 'insensitive',
      },
      to: {
        contains: to,
        mode: 'insensitive',
      },
    };

    if (date) {
      const startDate = new Date(`${date}T00:00:00`);
      const endDate = new Date(`${date}T23:59:59`);

      filters.departureTime = {
        gte: startDate,
        lte: endDate,
      };
    }

    const flights = await this.prisma.flight.findMany({
      where: filters,
    });

    return flights;
  }

  async update(id: number, payload: UpdateFlightDto) {
    const reys = await this.prisma.flight.findUnique({ where: { id } });

    if (!reys) {
      throw new NotFoundException("Id bo'yicha reys topilmadi");
    }

    let departureDate = reys.departureTime;
    let arrivalDate = reys.arrivalTime;

    if (payload.departureTime) {
      departureDate = new Date(payload.departureTime);
    }

    if (payload.arrivalTime) {
      arrivalDate = new Date(payload.arrivalTime);
    }

    const updateReys = await this.prisma.flight.update({
      where: { id },
      data: {
        from: payload.from ?? reys.from,
        to: payload.to ?? reys.to,
        price: payload.price ?? reys.price,
        departureTime: departureDate,
        arrivalTime: arrivalDate,
        seatCount: payload.seatCount ?? reys.seatCount,
        airline: payload.airline ?? reys.airline,
        availableSeats: payload.availableSeats ?? reys.availableSeats,
      },
    });

    return {
      message: "Reys ma'lumotlari yangilandi",
      data: updateReys,
    };
  }

  async remove(id: number) {
    const reys = await this.prisma.flight.findUnique({ where: { id } });

    if (!reys) {
      throw new NotFoundException("Id bo'yicha reys topilmadi");
    }

    await this.prisma.flight.delete({ where: { id } });

    return {
      message: "Reys o'chirildi",
    };
  }

  async seedFlight() {
      const filePath = path.join(process.cwd(), "src", "data", "flight.json");
  
      const trainCount = await this.prisma.flight.count();
      if (trainCount > 0) {
        return;
      }
  
      try {
        const file = await fs.readFile(filePath, "utf-8");
        const trains = JSON.parse(file);
  
        await this.prisma.flight.createMany({ data: trains });
        console.log("Flight jadvaliga seeding muvaffaqiyatli bajarildi.");
      } catch (err) {
        console.error("Seedingda xatolik:", err);
  
      }
    }
}
