import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsString, Min } from "class-validator";

export class CreateTrainDto {
  @ApiProperty({ example: "Toshkent" })
  @IsString()
  from: string;

  @ApiProperty({ example: "Samarqand" })
  @IsString()
  to: string;

  @ApiProperty({ example: "2025-06-10T08:00:00Z" })
  @IsDateString()
  departureTime: Date;

  @ApiProperty({ example: "2025-06-10T12:00:00Z" })
  @IsDateString()
  arrivalTime: Date;

  @ApiProperty({ example: 75000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(1)
  seatCount: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  availableSeats: number;

  @ApiProperty({ example: "PZ-045" })
  @IsString()
  trainNumber: string;
}
