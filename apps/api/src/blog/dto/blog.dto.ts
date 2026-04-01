import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBlogDto {
  @ApiProperty({ example: 'tips-membersihkan-rumah' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: '10 Tips Membersihkan Rumah dengan Cepat' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '清理 rumah tidak perlu melelahkan...' })
  @IsString()
  @IsNotEmpty()
  excerpt: string;

  @ApiProperty({ example: 'Full article content in markdown...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg' })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({ example: 'Tim Ningclean' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ example: ['tips', 'cleaning'] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ example: 5, description: 'Read time in minutes' })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readTime: number;
}

export class UpdateBlogDto {
  @ApiPropertyOptional({ example: 'tips-membersihkan-rumah' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: '10 Tips Membersihkan Rumah dengan Cepat' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: '清理 rumah tidak perlu melelahkan...' })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiPropertyOptional({ example: 'Full article content in markdown...' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg' })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ example: 'Tim Ningclean' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({ example: ['tips', 'cleaning'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readTime?: number;
}
