import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { HomepageSettingsService } from './homepage-settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('homepage-settings')
export class HomepageSettingsController {
  constructor(private readonly homepageSettingsService: HomepageSettingsService) {}

  @Get()
  async getHomepageSettings() {
    return this.homepageSettingsService.getHomepageSettings();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateHomepageSettings(@Body() data: any) {
    return this.homepageSettingsService.updateHomepageSettings(data);
  }
}
