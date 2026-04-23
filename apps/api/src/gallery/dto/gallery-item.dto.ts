import { IsString, IsOptional, IsBoolean, IsNumber, Min, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateGalleryItemDto {
  @ApiProperty({ example: 'Pembersihan Kantor ABC' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Proses pembersihan kantor lengkap dengan hasil memuaskan' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'office' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'https://example.com/gallery/after.jpg' })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiPropertyOptional({ example: 'https://example.com/gallery/before.jpg' })
  @IsOptional()
  @IsString()
  beforeImage?: string;

  @ApiPropertyOptional({ example: 'https://example.com/gallery/after.jpg' })
  @IsOptional()
  @IsString()
  afterImage?: string;

  @ApiPropertyOptional({ example: 'Jakarta Selatan' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'service-id-123' })
  @IsOptional()
  @IsString()
  serviceId?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  order?: number;
}

export class UpdateGalleryItemDto {
  @ApiPropertyOptional({ example: 'Pembersihan Kantor ABC' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Proses pembersihan kantor lengkap dengan hasil memuaskan' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'office' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'https://example.com/gallery/after.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/gallery/before.jpg' })
  @IsOptional()
  @IsString()
  beforeImage?: string;

  @ApiPropertyOptional({ example: 'https://example.com/gallery/after.jpg' })
  @IsOptional()
  @IsString()
  afterImage?: string;

  @ApiPropertyOptional({ example: 'Jakarta Selatan' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'service-id-123' })
  @IsOptional()
  @IsString()
  serviceId?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  order?: number;
}
