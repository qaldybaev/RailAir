import { Module } from '@nestjs/common';
import { TrainService } from './train.service';
import { TrainController } from './train.controller';
import { PrismaService } from 'src/prisma';

@Module({
  controllers: [TrainController],
  providers: [TrainService, PrismaService],
})
export class TrainModule { }
