import { IsString, IsBoolean, IsOptional, IsNotEmpty, IsArray, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJobListingDto {
  @ApiProperty({ example: 'Cleaning Technician' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Operations' })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({ example: 'Surabaya' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 'Full-time' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'We are looking for a dedicated cleaning technician.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: ['Minimum 1 year experience', 'Have transportation'] })
  @IsArray()
  @IsOptional()
  requirements?: string[];

  @ApiPropertyOptional({ example: ['BPJS Kesehatan', ' THR', ' Bonus performance'] })
  @IsArray()
  @IsOptional()
  benefits?: string[];

  @ApiPropertyOptional({ example: 'Rp 5.000.000 - 8.000.000' })
  @IsString()
  @IsOptional()
  salaryRange?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}

export class UpdateJobListingDto {
  @ApiPropertyOptional({ example: 'Cleaning Technician' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Operations' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({ example: 'Surabaya' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ example: 'Full-time' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ example: 'We are looking for a dedicated cleaning technician.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: ['Minimum 1 year experience'] })
  @IsArray()
  @IsOptional()
  requirements?: string[];

  @ApiPropertyOptional({ example: ['BPJS Kesehatan', ' THR'] })
  @IsArray()
  @IsOptional()
  benefits?: string[];

  @ApiPropertyOptional({ example: 'Rp 5.000.000 - 8.000.000' })
  @IsString()
  @IsOptional()
  salaryRange?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}
