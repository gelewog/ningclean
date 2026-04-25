import { IsString, IsNumber, IsBoolean, IsOptional, IsNotEmpty, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTestimonialDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Homeowner' })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({ example: 'PT Maju Jaya' })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiProperty({ example: 'Excellent service! My house is sparkling clean.' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e' })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ example: 'surabaya' })
  @IsString()
  @IsOptional()
  areaSlug?: string;
}

export class UpdateTestimonialDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Homeowner' })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({ example: 'PT Maju Jaya' })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiPropertyOptional({ example: 'Excellent service!' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e' })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ example: 'surabaya' })
  @IsString()
  @IsOptional()
  areaSlug?: string;
}
