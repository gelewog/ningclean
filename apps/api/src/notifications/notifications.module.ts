import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { WhatsAppService } from './whatsapp.service';
import { TwilioService } from './twilio.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, WhatsAppService, TwilioService],
  exports: [NotificationsService, WhatsAppService, TwilioService],
})
export class NotificationsModule {}
