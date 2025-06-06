import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsDate, IsInt } from 'class-validator';

export class CreatePassengerInfoDto {
    @ApiProperty({ type: "string", example: 'John Doe' })
    @IsString()
    fullName: string;

    @ApiProperty({ type: "string", example: 'male' })
    @IsString()
    gender: string;

    @ApiProperty({ example: '2000-01-01T00:00:00Z' })
    @IsDate()
    @Type(() => Date)
    birthDate: Date;

    @ApiProperty({ type: "string", example: 'AB1234567' })
    @IsString()
    passport: string;

    @ApiProperty({ example: 1, type: "number" })
    @IsInt()
    ticketId: number;
}
