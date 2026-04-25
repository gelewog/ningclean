import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ServiceAreasService } from './service-areas.service';
import { CreateServiceAreaDto, UpdateServiceAreaDto } from './dto/service-area.dto';
import { RolesGuard, Roles } from '../common';
import { Role } from '../common';

@ApiTags('Service Areas')
@Controller('service-areas')
export class ServiceAreasController {
  constructor(private serviceAreasService: ServiceAreasService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active service areas (public)' })
  findAll(@Query('featured') featured?: string) {
    return this.serviceAreasService.findAll(featured === 'true');
  }

  @Get('admin/all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all service areas including inactive (admin only)' })
  findAllAdmin() {
    return this.serviceAreasService.findAllAdmin();
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get service area by slug (public)' })
  findBySlug(@Param('slug') slug: string) {
    return this.serviceAreasService.findBySlug(slug);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get service area by ID (admin only)' })
  findOne(@Param('id') id: string) {
    return this.serviceAreasService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create service area (admin only)' })
  create(@Body() data: CreateServiceAreaDto) {
    return this.serviceAreasService.create(data);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update service area (admin only)' })
  update(@Param('id') id: string, @Body() data: UpdateServiceAreaDto) {
    return this.serviceAreasService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete service area (admin only)' })
  remove(@Param('id') id: string) {
    return this.serviceAreasService.remove(id);
  }
}
