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
  Req,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
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
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.blogService.findAll({ page, limit, category, search });
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
  async findBySlug(
    @Param('slug') slug: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Get or create session ID for anonymous tracking
    let sessionId = req.cookies?.blog_session_id;
    if (!sessionId) {
      sessionId = uuidv4();
      res.cookie('blog_session_id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      });
    }
    return this.blogService.findBySlug(slug, sessionId);
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

  @Post(':id/like')
  @ApiOperation({ summary: 'Like a blog post' })
  async like(
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Get or create session ID
    let sessionId = req.cookies?.blog_session_id;
    if (!sessionId) {
      sessionId = uuidv4();
      res.cookie('blog_session_id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });
    }
    return this.blogService.like(id, sessionId);
  }

  @Delete(':id/like')
  @ApiOperation({ summary: 'Unlike a blog post' })
  async unlike(
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const sessionId = req.cookies?.blog_session_id;
    if (!sessionId) {
      return { liked: false, likeCount: 0 };
    }
    return this.blogService.unlike(id, sessionId);
  }
}
