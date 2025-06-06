import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsDateString, IsNumber, Min } from "class-validator";

export class CreateFlightDto {
    @ApiProperty({ example: "Toshkent" })
    @IsString()
    from: string;

    @ApiProperty({ example: "Istanbul" })
    @IsString()
    to: string;

    @ApiProperty({ example: "2025-06-10T14:00:00Z" })
    @IsDateString()
    departureTime: Date;

    @ApiProperty({ example: "2025-06-10T18:00:00Z" })
    @IsDateString()
    arrivalTime: Date;

    @ApiProperty({ example: 950000 })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ example: 150 })
    @IsNumber()
    @Min(1)
    seatCount: number;

    @ApiProperty({ example: 150 })
    @IsNumber()
    @Min(0)
    availableSeats: number;

    @ApiProperty({ example: "Uzbekistan Airways" })
    @IsString()
    airline: string;
}
