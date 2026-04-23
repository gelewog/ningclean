import { IsString, IsNumber, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompanyStatDto {
  @ApiProperty({ example: 'Years Experience' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '10+' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiPropertyOptional({ example: 'Over a decade of experience in cleaning services.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'Star' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateCompanyStatDto {
  @ApiPropertyOptional({ example: 'Years Experience' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: '10+' })
  @IsString()
  @IsOptional()
  value?: string;

  @ApiPropertyOptional({ example: 'Over a decade of experience.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'Star' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
