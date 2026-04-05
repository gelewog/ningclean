import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JobListingsService } from './job-listings.service';
import { CreateJobListingDto, UpdateJobListingDto } from './dto/job-listing.dto';
import { RolesGuard, Roles } from '../common';
import { Role } from '@prisma/client';

@ApiTags('Job Listings')
@Controller('careers')
export class JobListingsController {
  constructor(private jobListingsService: JobListingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active job listings (public)' })
  findAll() {
    return this.jobListingsService.findAll(true);
  }

  @Get('admin/all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all job listings including inactive (admin only)' })
  findAllAdmin() {
    return this.jobListingsService.findAllAdmin();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get job listing by ID (admin only)' })
  findOne(@Param('id') id: string) {
    return this.jobListingsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create job listing (admin only)' })
  create(@Body() data: CreateJobListingDto) {
    return this.jobListingsService.create(data);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update job listing (admin only)' })
  update(@Param('id') id: string, @Body() data: UpdateJobListingDto) {
    return this.jobListingsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete job listing (admin only)' })
  remove(@Param('id') id: string) {
    return this.jobListingsService.remove(id);
  }
}
