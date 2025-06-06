import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TrainService } from './train.service';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Protected, Roles } from 'src/decorators';
import { Role } from '@prisma/client';

@Controller('train')
export class TrainController {
  constructor(private readonly trainService: TrainService) { }


  @Get()
  @ApiBearerAuth()
  @Protected(false)
  @Roles([Role.ADMIN, Role.USER])
  findAll() {
    return this.trainService.findAll();
  }

  @Post()
  @ApiBearerAuth()
  @Protected(true)
  @Roles([Role.ADMIN])
  create(@Body() createTrainDto: CreateTrainDto) {
    return this.trainService.create(createTrainDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Protected(true)
  @Roles([Role.ADMIN])
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTrainDto: UpdateTrainDto) {
    return this.trainService.update(id, updateTrainDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Protected(true)
  @Roles([Role.ADMIN])
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.trainService.remove(id);
  }
}
