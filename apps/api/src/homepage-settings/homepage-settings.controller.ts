import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { HomepageSettingsService } from './homepage-settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('homepage-settings')
export class HomepageSettingsController {
  constructor(private readonly homepageSettingsService: HomepageSettingsService) {}

  @Get()
  async getHomepageSettings() {
    return this.homepageSettingsService.getHomepageSettings();
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateHomepageSettings(@Body() data: any, @CurrentUser() user: any) {
    return this.homepageSettingsService.updateHomepageSettings(data, user);
  }
}
