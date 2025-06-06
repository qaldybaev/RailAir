import { Module } from '@nestjs/common';
import { PassengerInfoService } from './passenger-info.service';
import { PassengerInfoController } from './passenger-info.controller';
import { PrismaService } from 'src/prisma';

@Module({
  controllers: [PassengerInfoController],
  providers: [PassengerInfoService,PrismaService],
})
export class PassengerInfoModule {}
