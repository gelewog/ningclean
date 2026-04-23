import { IsString, IsNumber, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFaqDto {
  @ApiProperty({ example: 'Apa saja layanan yang tersedia?' })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({ example: 'Kami menyediakan layanan general cleaning, deep cleaning, dan office cleaning.' })
  @IsString()
  @IsNotEmpty()
  answer: string;

  @ApiProperty({ example: 'General' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateFaqDto {
  @ApiPropertyOptional({ example: 'Apa saja layanan yang tersedia?' })
  @IsString()
  @IsOptional()
  question?: string;

  @ApiPropertyOptional({ example: 'Kami menyediakan layanan general cleaning, deep cleaning, dan office cleaning.' })
  @IsString()
  @IsOptional()
  answer?: string;

  @ApiPropertyOptional({ example: 'General' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
