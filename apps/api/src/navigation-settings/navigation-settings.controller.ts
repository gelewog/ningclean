import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { NavigationSettingsService } from './navigation-settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('navigation-settings')
export class NavigationSettingsController {
  constructor(private readonly navigationSettingsService: NavigationSettingsService) {}

  @Get()
  async getNavigationSettings() {
    return this.navigationSettingsService.getNavigationSettings();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateNavigationSettings(@Body() data: any) {
    return this.navigationSettingsService.updateNavigationSettings(data);
  }
}
