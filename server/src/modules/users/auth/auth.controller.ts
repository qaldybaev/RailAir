import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dtos';
import { Protected, Roles } from 'src/decorators';
import { Role } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) { }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async google() { }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: Response) {
    const user = req.user;

       return res.redirect(`http://localhost:4000`);
  }
  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebook() { }

  @Get('/facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookCallback(@Req() req: any, @Res() res: Response) {
    
     return res.redirect(`http://localhost:4000`);
  }

  @Post('register')
  @Protected(false)
  @Roles([Role.ADMIN, Role.USER])
  async register(@Body() body: RegisterDto) {
    return await this.service.register(body);
  }

  @Post('login')
  @Protected(false)
  @Roles([Role.ADMIN, Role.USER])
  async login(@Body() body: LoginDto) {
    return await this.service.login(body);
  }

  @Post('forgot-password')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'nurkenqaldybaev2001@gmail.com',
        },
      },
    },
  })
  async forgotPassword(@Body('email') email: string) {
    return this.service.forgotPassword({ email });
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { email: string, code: string; newPassword: string }) {
    return this.service.resetPassword(body);
  }

}
