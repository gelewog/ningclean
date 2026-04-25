import { IsString, IsBoolean, IsOptional, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceAreaDto {
  @ApiProperty({ example: 'Surabaya' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'surabaya' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'East Java' })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiPropertyOptional({ example: 'Surabaya is the second largest city in Indonesia.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: ['Gubeng', 'Tegalsari', 'Rungkut'] })
  @IsArray()
  @IsOptional()
  coverage?: string[];

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo Surabaya' })
  @IsString()
  @IsOptional()
  image?: string;
}

export class UpdateServiceAreaDto {
  @ApiPropertyOptional({ example: 'Surabaya' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'surabaya' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ example: 'East Java' })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiPropertyOptional({ example: 'Surabaya is the second largest city.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: ['Gubeng', 'Tegalsari', 'Rungkut'] })
  @IsArray()
  @IsOptional()
  coverage?: string[];

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo Surabaya' })
  @IsString()
  @IsOptional()
  image?: string;
}
