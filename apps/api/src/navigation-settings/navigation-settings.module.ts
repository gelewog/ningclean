import { Module } from '@nestjs/common';
import { NavigationSettingsController } from './navigation-settings.controller';
import { NavigationSettingsService } from './navigation-settings.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NavigationSettingsController],
  providers: [NavigationSettingsService],
  exports: [NavigationSettingsService],
})
export class NavigationSettingsModule {}
