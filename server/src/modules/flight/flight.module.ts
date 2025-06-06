import { Module } from '@nestjs/common';
import { FlightService } from './flight.service';
import { FlightController } from './flight.controller';
import { PrismaService } from 'src/prisma';

@Module({
  controllers: [FlightController],
  providers: [FlightService, PrismaService],
})
export class FlightModule { }
