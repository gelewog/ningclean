import { Controller, Get, Put, UseGuards } from '@nestjs/common';
import { SiteSettingsService } from './site-settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('site-settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SiteSettingsController {
  constructor(private siteSettingsService: SiteSettingsService) {}

  @Get()
  @Roles(Role.ADMIN)
  async getSettings() {
    return this.siteSettingsService.getSettings();
  }

  @Put()
  @Roles(Role.ADMIN)
  async updateSettings(data: any) {
    return this.siteSettingsService.updateSettings(data);
  }
}
