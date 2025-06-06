import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator"
import { Role } from '@prisma/client'

export class GoogleRegisterDto {

    @IsString()
    name: string

    @IsEmail()
    email: string

    @IsOptional()
    @IsString()
    phoneNumber?: string

    @IsOptional()
    @IsString()
    password?: string

  
    @IsString()
    provider: string

  
    @IsString()
    providerId: string

    @IsEnum({})
    role: Role
}
