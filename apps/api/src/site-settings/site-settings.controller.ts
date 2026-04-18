import { Controller, Get, Put, UseGuards, Body } from '@nestjs/common';
import { SiteSettingsService } from './site-settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('site-settings')
export class SiteSettingsController {
  constructor(private siteSettingsService: SiteSettingsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getSettings() {
    return this.siteSettingsService.getSettings();
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateSettings(@Body() data: any, @CurrentUser() user: any) {
    return this.siteSettingsService.updateSettings(data, user);
  }
}
