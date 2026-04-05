import { Controller, Get, Put, Param, Query, Body, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @Roles(Role.ADMIN)
  async getNotifications(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('unreadOnly') unreadOnly = 'false',
  ) {
    return this.notificationsService.getNotifications({
      page: parseInt(page),
      limit: parseInt(limit),
      unreadOnly: unreadOnly === 'true',
    });
  }

  @Get('unread-count')
  @Roles(Role.ADMIN)
  async getUnreadCount() {
    return this.notificationsService.getUnreadCount();
  }

  @Get('settings')
  @Roles(Role.ADMIN)
  async getSettings() {
    return this.notificationsService.getSettings();
  }

  @Put('settings')
  @Roles(Role.ADMIN)
  async updateSettings(@Body() data: any) {
    return this.notificationsService.updateSettings(data);
  }

  @Put(':id/read')
  @Roles(Role.ADMIN)
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Put('read-all')
  @Roles(Role.ADMIN)
  async markAllAsRead() {
    return this.notificationsService.markAllAsRead();
  }

  @Put(':id/unread')
  @Roles(Role.ADMIN)
  async markAsUnread(@Param('id') id: string) {
    return this.notificationsService.markAsUnread(id);
  }

  @Put('delete-old')
  @Roles(Role.ADMIN)
  async deleteOldNotifications(@Query('days') days = '30') {
    return this.notificationsService.deleteOldNotifications(parseInt(days));
  }
}
