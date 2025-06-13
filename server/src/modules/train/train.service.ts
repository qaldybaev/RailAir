import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { PrismaService } from 'src/prisma';
import * as path from 'node:path';
import * as fs from 'fs/promises';

@Injectable()
export class TrainService implements OnModuleInit {
  constructor(private prisma: PrismaService) { }

  async onModuleInit() {
    await this.seedTrain()
  }

  async create(payload: CreateTrainDto) {

    const departureDate = new Date(payload.departureTime);
    const arrivalDate = new Date(payload.arrivalTime);

    const newReys = await this.prisma.train.create({
      data: {
        from: payload.from,
        to: payload.to,
        price: payload.price,
        arrivalTime: arrivalDate,
        departureTime: departureDate,
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

    const trains = await this.prisma.train.findMany({
      where: filters,
    });

    return trains;
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

  async seedTrain() {
    const filePath = path.join(process.cwd(), "src", "data", "train.json");

    const trainCount = await this.prisma.train.count();
    if (trainCount > 0) {
      return;
    }

    try {
      const file = await fs.readFile(filePath, "utf-8");
      const trains = JSON.parse(file);

      await this.prisma.train.createMany({ data: trains });
      console.log("Train jadvaliga seeding muvaffaqiyatli bajarildi.");
    } catch (err) {
      console.error("Seedingda xatolik:", err);

    }
  }
}
