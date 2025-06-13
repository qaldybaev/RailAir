import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { PrismaService } from 'src/prisma';
import { TicketStatus } from '@prisma/client';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) { }
  async create(payload: CreateTicketDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new NotFoundException(
        'Foydalanuvchi topilmadi, iltimos, maʼlumotlarni tekshirib qayta urinib koʻring.'
      );
    }

    if (!payload.flightId && !payload.trainId) {
      throw new BadRequestException(
        'Transport belgilanmagan: flightId yoki trainId kerak.'
      );
    }

    if (payload.flightId) {
      const flight = await this.prisma.flight.findUnique({
        where: { id: payload.flightId },
      });

      if (!flight) {
        throw new NotFoundException(
          'Siz tanlagan aviareys mavjud emas yoki o‘chirilgan.'
        );
      }
    }

    if (payload.trainId) {
      const train = await this.prisma.train.findUnique({
        where: { id: payload.trainId },
      });

      if (!train) {
        throw new NotFoundException(
          "Poezd topilmadi, iltimos, ma'lumotlarni tekshirib qayta urinib ko'ring."
        );
      }
    }

    if (payload.seatNumber) {
      const seatTaken = await this.prisma.ticket.findFirst({
        where: {
          seatNumber: payload.seatNumber,
          OR: [
            { trainId: payload.trainId || undefined },
            { flightId: payload.flightId || undefined },
          ],
        },
      });

      if (seatTaken) {
        throw new ConflictException(
          `Kechirasiz! ${payload.seatNumber} raqamli joy allaqachon band qilingan. Iltimos, boshqa joy tanlang.`
        );
      }
    }

    const newTicket = await this.prisma.ticket.create({
      data: {
        userId: payload.userId,
        flightId: payload.flightId,
        trainId: payload.trainId,
        seatNumber: payload.seatNumber,
        status: TicketStatus.BOOKED,
        passengerInfoId: payload.passengerInfoId,
      },
    });

    return {
      message: "✅ Chipta muvaffaqiyatli band qilindi",
      data: newTicket,
    };
  }


  async findAll() {
    const tickets = await this.prisma.ticket.findMany({
      include: { passengerInfo: true, flight: true, train: true, user: true },
    });

    return {
      message: 'Barcha chiptalar',
      data: tickets,
    };
  }

  async findByUserId(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    console.log(user)

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    const tickets = await this.prisma.ticket.findMany({
      where: { userId: userId },
      include: {
        passengerInfo: true,
        flight: true,
        train: true,
      },
    });
  

    return {
      message: 'Foydalanuvchining barcha chiptalari',
      data: tickets,
    };
  }


  async findOne(id: number) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Chipta topilmadi');
    }
    return ticket;
  }

  async update(id: number, payload: UpdateTicketDto) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Chipta topilmadi');
    }

    const updatedTicket = await this.prisma.ticket.update({
      where: { id },
      data: payload,
    });

    return updatedTicket;
  }

  async remove(id: number) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Chipta topilmadi');
    }

    await this.prisma.ticket.delete({ where: { id } });

    return { message: "Chipta o'chirildi" };
  }

  async cancel(id: number) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Chipta topilmadi');
    }
    if (ticket.status === TicketStatus.CANCELLED) {
      throw new BadRequestException('Chipta allaqachon bekor qilingan');
    }
    const canceledTicket = await this.prisma.ticket.update({
      where: { id },
      data: { status: TicketStatus.CANCELLED },
    });

    return {
      message: 'Chipta bekor qilindi',
      data: canceledTicket,
    };
  }
}
