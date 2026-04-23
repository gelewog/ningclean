import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
  IsBoolean,
  IsDate,
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

  @ApiPropertyOptional({ example: '清理 rumah tidak perlu melelahkan...' })
  @IsOptional()
  @IsString()
  excerpt?: string;

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

  @ApiPropertyOptional({ example: ['tips', 'cleaning'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: 5, description: 'Read time in minutes' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readTime?: number;

  @ApiPropertyOptional({ example: 'uuid-of-category' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: '2024-01-15T00:00:00.000Z', description: 'Publish date. null = draft, date = published' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  publishedAt?: Date | null;
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

  @ApiPropertyOptional({ example: 'uuid-of-category' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: '2024-01-15T00:00:00.000Z', description: 'Publish date. null = draft, date = published' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  publishedAt?: Date | null;
}
