import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma';
import { FsHelper, JwtHelper } from 'src/helpers';


@Module({
  controllers: [UsersController],
  providers: [UsersService,PrismaService,FsHelper],
})
export class UsersModule {}
