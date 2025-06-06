import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ type: "string", example: "Ali" })
  @IsString()
  name: string;

  @ApiProperty({ type: "string", example: "ali@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ type: "string", example: "+998901234567" })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ type: "string", example: "password123" })
  @IsString()
  password: string;

  @ApiProperty({ enum: Role, default: Role.USER})
  @IsEnum(Role)
  @IsOptional()
  role: Role = Role.USER;

  @ApiProperty({ type: Boolean, default: false})
  @IsBoolean()
  @IsOptional()
  isBlocked: boolean = false;
}
