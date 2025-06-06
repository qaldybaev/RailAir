import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString } from "class-validator"
export class LoginDto {

    @ApiProperty({ type: "string",default:"nurkenqaldybaev2001@gmail.com"  })
    @IsEmail()
    email: string

    @ApiProperty({ type: "string",default:"123456"})
    @IsString()
    password: string

}