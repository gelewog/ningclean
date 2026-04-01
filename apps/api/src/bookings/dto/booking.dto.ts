import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus } from '@prisma/client';

class BookingItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  quantity: number;
}

export class CreateBookingDto {
  @ApiProperty({ example: '2024-02-15' })
  @IsDateString()
  serviceDate: string;

  @ApiProperty({ example: '09:00' })
  @IsString()
  @IsNotEmpty()
  serviceTime: string;

  @ApiProperty({ example: 'Jl. Melati No. 12, Jakarta Selatan' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: '50 m²' })
  @IsString()
  @IsNotEmpty()
  area: string;

  @ApiPropertyOptional({ example: 'Mohon arriving tepat waktu' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [BookingItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingItemDto)
  items: BookingItemDto[];
}

export class UpdateBookingStatusDto {
  @ApiProperty({ enum: BookingStatus, example: BookingStatus.CONFIRMED })
  @IsString()
  @IsNotEmpty()
  status: BookingStatus;
}
