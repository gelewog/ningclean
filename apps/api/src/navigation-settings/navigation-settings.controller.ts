import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { NavigationSettingsService } from './navigation-settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('navigation-settings')
export class NavigationSettingsController {
  constructor(private readonly navigationSettingsService: NavigationSettingsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getNavigationSettings() {
    return this.navigationSettingsService.getNavigationSettings();
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateNavigationSettings(@Body() data: any) {
    return this.navigationSettingsService.updateNavigationSettings(data);
  }
}
