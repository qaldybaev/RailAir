import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { FlightService } from './flight.service';
import { CreateFlightDto } from './dto';
import { UpdateFlightDto } from './dto';
import { Protected, Roles } from 'src/decorators';
import { Role } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('flight')
export class FlightController {
  constructor(private readonly flightService: FlightService) { }
  @Get()
  @Protected(false)
  @Roles([Role.ADMIN, Role.USER])
  findAll() {
    return this.flightService.findAll();
  }

  @Post()
  @ApiBearerAuth()
  @Protected(true)
  @Roles([Role.ADMIN])
  create(@Body() body: CreateFlightDto) {
    return this.flightService.create(body);
  }


  @Patch(':id')
  @ApiBearerAuth()
  @Protected(true)
  @Roles([Role.ADMIN])
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateFlightDto) {
    return this.flightService.update(id, body);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Protected(true)
  @Roles([Role.ADMIN])
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.flightService.remove(id);
  }
}
