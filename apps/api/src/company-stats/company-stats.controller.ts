import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CompanyStatsService } from './company-stats.service';
import { CreateCompanyStatDto, UpdateCompanyStatDto } from './dto/company-stat.dto';
import { RolesGuard, Roles } from '../common';
import { Role } from '@prisma/client';

@ApiTags('Company Stats')
@Controller('company-stats')
export class CompanyStatsController {
  constructor(private companyStatsService: CompanyStatsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active company stats (public)' })
  findAll() {
    return this.companyStatsService.findAll();
  }

  @Get('admin/all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all company stats including inactive (admin only)' })
  findAllAdmin() {
    return this.companyStatsService.findAllAdmin();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get company stat by ID (admin only)' })
  findOne(@Param('id') id: string) {
    return this.companyStatsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create company stat (admin only)' })
  create(@Body() data: CreateCompanyStatDto) {
    return this.companyStatsService.create(data);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update company stat (admin only)' })
  update(@Param('id') id: string, @Body() data: UpdateCompanyStatDto) {
    return this.companyStatsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete company stat (admin only)' })
  remove(@Param('id') id: string) {
    return this.companyStatsService.remove(id);
  }
}
