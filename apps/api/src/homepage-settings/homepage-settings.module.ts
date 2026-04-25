import { Module } from '@nestjs/common';
import { HomepageSettingsController } from './homepage-settings.controller';
import { HomepageSettingsService } from './homepage-settings.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HomepageSettingsController],
  providers: [HomepageSettingsService],
  exports: [HomepageSettingsService],
})
export class HomepageSettingsModule {}
