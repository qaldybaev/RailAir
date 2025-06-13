import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsOptional, IsString } from "class-validator"
export class RegisterDto {
    @ApiProperty({ type: "string" })
    @IsString()
    name: string

    @ApiProperty({ type: "string" })
    @IsEmail()
    email: string

    @ApiProperty({ type: "string" })
    @IsString()
    phoneNumber: string

    provider?:string

    @ApiProperty({ type: "string" })
    @IsString()
    password: string



}