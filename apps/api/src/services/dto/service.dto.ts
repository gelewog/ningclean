import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateServiceDto {
  @ApiProperty({ example: 'Home Cleaning' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'home-cleaning' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Layanan pembersihan rumah tangga harian' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 150000 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({ example: 180, description: 'Duration in minutes' })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  duration: number;

  @ApiPropertyOptional({ example: 'Deep Cleaning' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/...' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: 'home' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: ['Fitur 1', 'Fitur 2'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}

export class UpdateServiceDto {
  @ApiPropertyOptional({ example: 'Home Cleaning' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'home-cleaning' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'Layanan pembersihan rumah tangga harian' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 150000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price?: number;

  @ApiPropertyOptional({ example: 180 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  duration?: number;

  @ApiPropertyOptional({ example: 'Deep Cleaning' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/...' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: 'home' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: ['Fitur 1', 'Fitur 2'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
