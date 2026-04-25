import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GalleryService } from './gallery.service';
import { CreateGalleryItemDto, UpdateGalleryItemDto } from './dto/gallery-item.dto';
import { RolesGuard, Roles } from '../common';
import { Role } from '../common';

@ApiTags('Gallery')
@Controller('gallery')
export class GalleryController {
  constructor(private galleryService: GalleryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active gallery items (public)' })
  findAll(@Query('category') category?: string) {
    return this.galleryService.findAll(category);
  }

  @Get('admin/all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all gallery items including inactive (admin only)' })
  findAllAdmin() {
    return this.galleryService.findAllAdmin();
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get gallery items by category (public)' })
  findByCategory(@Param('category') category: string) {
    return this.galleryService.findAll(category);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get gallery item by ID (admin only)' })
  findOne(@Param('id') id: string) {
    return this.galleryService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create gallery item (admin only)' })
  create(@Body() data: CreateGalleryItemDto) {
    return this.galleryService.create(data);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update gallery item (admin only)' })
  update(@Param('id') id: string, @Body() data: UpdateGalleryItemDto) {
    return this.galleryService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete gallery item (admin only)' })
  remove(@Param('id') id: string) {
    return this.galleryService.remove(id);
  }
}
