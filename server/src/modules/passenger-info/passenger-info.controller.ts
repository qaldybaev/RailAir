import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { PassengerInfoService } from './passenger-info.service';
import { CreatePassengerInfoDto as body } from './dto/create-passenger-info.dto';
import { UpdatePassengerInfoDto } from './dto/update-passenger-info.dto';
import { Protected, Roles } from 'src/decorators';
import { Role } from '@prisma/client';

@Controller('passenger-info')
export class PassengerInfoController {
  constructor(private readonly passengerInfoService: PassengerInfoService) { }

  @Post()
  @Protected(true)
  @Roles([Role.ADMIN, Role.USER])
  create(@Body() createPassengerInfoDto: body) {
    return this.passengerInfoService.create(createPassengerInfoDto);
  }

  @Get()
  @Protected(true)
  @Roles([Role.ADMIN])
  findAll() {
    return this.passengerInfoService.findAll();
  }

  @Get(':id')
  @Protected(true)
  @Roles([Role.ADMIN, Role.USER])
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.passengerInfoService.findOne(id);
  }

  @Patch(':id')
  @Protected(true)
  @Roles([Role.ADMIN, Role.USER])
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdatePassengerInfoDto) {
    return this.passengerInfoService.update(id, body);
  }

  @Delete(':id')
  @Protected(true)
  @Roles([Role.ADMIN, Role.USER])
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.passengerInfoService.remove(id);
  }
}
