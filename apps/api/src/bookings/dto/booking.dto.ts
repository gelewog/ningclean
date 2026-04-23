import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsArray,
  ValidateNested,
  IsOptional,
  IsEmail,
  IsInt,
  Min,
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
  @IsInt()
  @Min(1)
  @Type(() => Number)
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

  // Guest booking support - REQUIRED fields
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  customerName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsNotEmpty()
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ example: '081234567890' })
  @IsNotEmpty()
  @IsString()
  customerPhone: string;
}

export class UpdateBookingStatusDto {
  @ApiProperty({ enum: BookingStatus, example: BookingStatus.CONFIRMED })
  @IsString()
  @IsNotEmpty()
  status: BookingStatus;
}
