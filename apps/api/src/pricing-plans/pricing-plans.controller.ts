import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PricingPlansService } from './pricing-plans.service';
import { CreatePricingPlanDto, UpdatePricingPlanDto } from './dto/pricing-plan.dto';
import { RolesGuard, Roles } from '../common';
import { Role } from '@prisma/client';

@ApiTags('Pricing Plans')
@Controller('pricing-plans')
export class PricingPlansController {
  constructor(private pricingPlansService: PricingPlansService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active pricing plans (public)' })
  findAll() {
    return this.pricingPlansService.findAll();
  }

  @Get('admin/all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all pricing plans including inactive (admin only)' })
  findAllAdmin() {
    return this.pricingPlansService.findAllAdmin();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pricing plan by ID (admin only)' })
  findOne(@Param('id') id: string) {
    return this.pricingPlansService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create pricing plan (admin only)' })
  create(@Body() data: CreatePricingPlanDto) {
    return this.pricingPlansService.create(data);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update pricing plan (admin only)' })
  update(@Param('id') id: string, @Body() data: UpdatePricingPlanDto) {
    return this.pricingPlansService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete pricing plan (admin only)' })
  remove(@Param('id') id: string) {
    return this.pricingPlansService.remove(id);
  }
}
