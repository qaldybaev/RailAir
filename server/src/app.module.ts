import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { APP_GUARD } from '@nestjs/core';
import { CheckAuthGuard, CheckRolesGuard } from './guards';
import { JwtHelper } from './helpers';
import {
  AuthModule,
  FlightModule,
  MailModule,
  TicketModule,
  TrainModule,
  UsersModule,
} from './modules';
import { PassengerInfoModule } from './modules/passenger-info/passenger-info.module';
import * as path from 'node:path';

import { ServeStaticModule } from '@nestjs/serve-static';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), "uploads"),
      serveRoot: "/api/v1/uploads"

    }),
    AuthModule,
    UsersModule,
    FlightModule,
    TrainModule,
    TicketModule,
    PassengerInfoModule,
    MailModule
  ],
  providers: [
    JwtHelper,
    {
      provide: APP_GUARD,
      useClass: CheckAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: CheckRolesGuard,
    },
  ],
})
export class AppModule { }
