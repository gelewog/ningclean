import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { FooterSettingsService } from './footer-settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('footer-settings')
export class FooterSettingsController {
  constructor(private readonly footerSettingsService: FooterSettingsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getFooterSettings() {
    return this.footerSettingsService.getFooterSettings();
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateFooterSettings(@Body() data: any) {
    return this.footerSettingsService.updateFooterSettings(data);
  }
}
