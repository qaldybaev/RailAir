import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaService } from "src/prisma";
import { JwtHelper } from "src/helpers";
import { FacebookStrategy, GoogleStrategy } from "./strategy";
import { MailService } from "../mail";

@Module({
    imports: [JwtModule.register({
        global: true,
    
    })],
    controllers: [AuthController],
    providers: [AuthService, PrismaService,JwtHelper,GoogleStrategy,FacebookStrategy,MailService],
    exports: [JwtModule]
})

export class AuthModule { }