import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Protected, Roles } from 'src/decorators';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { UpdateMyProfileDto } from './dto/update.profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Protected(true)
  @Roles([Role.ADMIN])
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Protected(true)
  @Roles([Role.ADMIN])
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @Protected(true)
  getMe(@Req() req: Request & { userId: number; role: Role }) {
    const userId = req.userId;
    return this.usersService.getMe(userId);
  }

  @Patch('me')
  @Protected(true)
  @UseInterceptors(FileInterceptor("image"))
  updateMe(@Req() req: Request & { userId: number; role: Role }, @Body() dto: UpdateMyProfileDto, @UploadedFile() image: Express.Multer.File) {
    const userId = req.userId;
    return this.usersService.updateMe(userId, dto, image);
  }

  @Delete("me/photo")
  @Protected(true)
  deleteProfileImage(@Req() req: Request & { userId: number }) {
    const userId = req.userId;
    console.log(userId)
    return this.usersService.deleteProfileImage(userId);
  }


  @Delete(':id')
  @Protected(true)
  @Roles([Role.ADMIN])
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
