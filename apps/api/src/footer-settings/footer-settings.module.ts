import { Module } from '@nestjs/common';
import { FooterSettingsController } from './footer-settings.controller';
import { FooterSettingsService } from './footer-settings.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FooterSettingsController],
  providers: [FooterSettingsService],
  exports: [FooterSettingsService],
})
export class FooterSettingsModule {}
