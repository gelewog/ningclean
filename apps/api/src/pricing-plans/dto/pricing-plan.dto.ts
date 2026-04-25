import { IsString, IsNumber, IsBoolean, IsOptional, IsNotEmpty, IsArray, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePricingPlanDto {
  @ApiProperty({ example: 'Basic Plan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'basic' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Basic cleaning services' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'monthly' })
  @IsString()
  @IsNotEmpty()
  billingCycle: string;

  @ApiProperty({ example: ['Feature 1', 'Feature 2'] })
  @IsArray()
  @IsString({ each: true })
  features: string[];

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isPopular?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  order?: number;
}

export class UpdatePricingPlanDto {
  @ApiPropertyOptional({ example: 'Basic Plan' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'basic' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ example: 'Basic cleaning services' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 50 })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: 'monthly' })
  @IsString()
  @IsOptional()
  billingCycle?: string;

  @ApiPropertyOptional({ example: ['Feature 1', 'Feature 2'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isPopular?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  order?: number;
}
