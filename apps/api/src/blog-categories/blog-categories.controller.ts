import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { BlogCategoriesService } from './blog-categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('blog-categories')
export class BlogCategoriesController {
  constructor(private readonly blogCategoriesService: BlogCategoriesService) {}

  @Get()
  async findAll() {
    return this.blogCategoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.blogCategoriesService.findOne(id);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.blogCategoriesService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() data: { name: string; slug: string; description?: string; order?: number }) {
    return this.blogCategoriesService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() data: { name?: string; slug?: string; description?: string; order?: number }) {
    return this.blogCategoriesService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.blogCategoriesService.remove(id);
  }

  @Put('reorder')
  @UseGuards(JwtAuthGuard)
  async reorder(@Body() categories: { id: string; order: number }[]) {
    return this.blogCategoriesService.reorder(categories);
  }
}
