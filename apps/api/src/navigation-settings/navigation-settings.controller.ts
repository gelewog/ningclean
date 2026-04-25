import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { NavigationSettingsService } from './navigation-settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common';

@Controller('navigation-settings')
export class NavigationSettingsController {
  constructor(private readonly navigationSettingsService: NavigationSettingsService) {}

  @Get()
  async getNavigationSettings() {
    return this.navigationSettingsService.getNavigationSettings();
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateNavigationSettings(@Body() data: any, @CurrentUser() user: any) {
    return this.navigationSettingsService.updateNavigationSettings(data, user);
  }
}
