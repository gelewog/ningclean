import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
import { RolesGuard, Roles } from '../common';
import { Role } from '@prisma/client';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get()
  @ApiOperation({ summary: 'Get all blog posts (public)' })
  findAll() {
    return this.blogService.findAll();
  }

  @Get('admin/all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all blog posts for admin (including drafts) with pagination' })
  findAllAdmin(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: 'draft' | 'published',
    @Query('search') search?: string,
  ) {
    return this.blogService.findAllAdmin({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      status,
      search,
    });
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get blog post by slug (public)' })
  findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get blog post by ID (public)' })
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new blog post (admin only)' })
  create(@Body() dto: CreateBlogDto) {
    return this.blogService.create(dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a blog post (admin only)' })
  update(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    return this.blogService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a blog post (admin only)' })
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
