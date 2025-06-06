import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateTicketDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    @IsPositive()
    userId: number;

    @ApiProperty({ example: 2, required: false })
    @IsInt()
    @IsOptional()
    flightId?: number;

    @ApiProperty({ example: 3, required: false })
    @IsInt()
    @IsOptional()
    trainId?: number;

    @ApiProperty({ example: 15 })
    @IsInt()
    @IsPositive()
    seatNumber: number;

    @ApiProperty({ example: 1, required: false })
    @IsInt()
    @IsOptional()
    passengerInfoId?: number;
}
