import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { FooterSettingsService } from './footer-settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('footer-settings')
export class FooterSettingsController {
  constructor(private readonly footerSettingsService: FooterSettingsService) {}

  @Get()
  async getFooterSettings() {
    return this.footerSettingsService.getFooterSettings();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateFooterSettings(@Body() data: any) {
    return this.footerSettingsService.updateFooterSettings(data);
  }
}
