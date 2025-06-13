import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Protected, Roles } from 'src/decorators';
import { Role } from '@prisma/client';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) { }

  @Post()
  @Protected(false)
  @Roles([Role.ADMIN, Role.USER])
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }

  @Get()
  @ApiBearerAuth()
  @Protected(true)
  @Roles([Role.ADMIN])
  findAll() {
    return this.ticketService.findAll();
  }
  @Get('user/:userId')
  @ApiBearerAuth()
  @Protected(true)
  @Roles([Role.ADMIN, Role.USER])
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.ticketService.findByUserId(userId);
  }


  @Get(':id')
  @ApiBearerAuth()
  @Protected(true)
  @Roles([Role.ADMIN])
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Protected(true)
  @Roles([Role.ADMIN])
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketService.update(id, updateTicketDto);
  }
  @Patch(':id/cancel')
  @Protected(false)
  @Roles([Role.ADMIN, Role.USER])
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.cancel(id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Protected(true)
  @Roles([Role.ADMIN])
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.remove(id);
  }
}
