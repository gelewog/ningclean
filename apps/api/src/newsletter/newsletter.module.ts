import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';
import { NewsletterScheduler } from './newsletter.scheduler';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [PrismaModule, ScheduleModule.forRoot(), EmailModule],
  controllers: [NewsletterController],
  providers: [NewsletterService, NewsletterScheduler],
  exports: [NewsletterService],
})
export class NewsletterModule {}
