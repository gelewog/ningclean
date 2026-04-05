import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsAppService } from './whatsapp.service';
import { TwilioService } from './twilio.service';
import * as nodemailer from 'nodemailer';

export interface BookingNotificationData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceName: string;
  serviceDate: string;
  serviceTime: string;
  address: string;
  totalAmount: string;
}

@Injectable()
export class NotificationsService implements OnModuleInit {
  private transporter: nodemailer.Transporter | null = null;
  private settings: any = null;

  constructor(
    private prisma: PrismaService,
    private whatsAppService: WhatsAppService,
    private twilioService: TwilioService,
  ) {}

  async onModuleInit() {
    await this.loadSettings();
    this.initializeTransporter();
  }

  private async loadSettings() {
    try {
      // Use raw SQL - note: Postgres stores column names in lowercase
      interface SettingsRow {
        id: string;
        whatsappNumber: string | null;
        whatsappMessage: string | null;
        whatsappEnabled: boolean;
        emailEnabled: boolean;
        emailHost: string | null;
        emailPort: number | null;
        emailUser: string | null;
        emailPassword: string | null;
        emailFrom: string | null;
        adminEmail: string | null;
        twilioaccountsid: string | null;
        twilioauthtoken: string | null;
        twiliofromnumber: string | null;
      }
      
      // Use lowercase column names that match the actual database schema
      const result = await this.prisma.$queryRawUnsafe(`
        SELECT 
          "id",
          "whatsappNumber",
          "whatsappMessage",
          "whatsappEnabled",
          "emailEnabled",
          "emailHost",
          "emailPort",
          "emailUser",
          "emailPassword",
          "emailFrom",
          "adminEmail",
          "twilioaccountsid",
          "twilioauthtoken",
          "twiliofromnumber"
        FROM "notification_settings" 
        LIMIT 1
      `) as SettingsRow[];
      
      this.settings = result && result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Failed to load notification settings:', error);
      this.settings = null;
    }
  }

  private initializeTransporter() {
    if (this.settings?.emailEnabled && this.settings?.emailHost) {
      this.transporter = nodemailer.createTransport({
        host: this.settings.emailHost,
        port: this.settings.emailPort || 587,
        secure: this.settings.emailPort === 465,
        auth: {
          user: this.settings.emailUser,
          pass: this.settings.emailPassword,
        },
      });
    }
  }

  async refreshSettings() {
    await this.loadSettings();
    this.initializeTransporter();
    await this.whatsAppService.refreshSettings();
    await this.twilioService.refreshSettings();
  }

  /**
   * Generate WhatsApp Click-to-Chat link (for backward compatibility)
   */
  getWhatsAppLink(message: string): string | null {
    if (!this.settings?.whatsappNumber) {
      return null;
    }

    // Clean number: remove + if present
    let number = this.settings.whatsappNumber.replace(/\+/g, '');
    
    // Encode message
    const encodedMessage = encodeURIComponent(message);
    
    return `https://wa.me/${number}?text=${encodedMessage}`;
  }

  /**
   * Format booking notification message for WhatsApp
   */
  formatWhatsAppMessage(data: BookingNotificationData): string {
    let message = this.settings?.whatsappMessage || `🎉 *Booking Baru!*

📋 *Order:* {orderNumber}
👤 *Nama:* {customerName}
📞 *Telepon:* {customerPhone}
📅 *Tanggal:* {serviceDate}
⏰ *Jam:* {serviceTime}
🏠 *Alamat:* {address}
🧹 *Layanan:* {serviceName}
💰 *Total:* {totalAmount}

---
Dikirim otomatis dari NingClean`;

    // Replace placeholders with actual data
    message = message.replace(/{orderNumber}/g, data.orderNumber);
    message = message.replace(/{customerName}/g, data.customerName);
    message = message.replace(/{customerEmail}/g, data.customerEmail || '-');
    message = message.replace(/{customerPhone}/g, data.customerPhone || '-');
    message = message.replace(/{serviceName}/g, data.serviceName);
    message = message.replace(/{serviceDate}/g, data.serviceDate);
    message = message.replace(/{serviceTime}/g, data.serviceTime);
    message = message.replace(/{address}/g, data.address);
    message = message.replace(/{totalAmount}/g, data.totalAmount);

    return message;
  }

  /**
   * Send email notification
   */
  async sendEmailNotification(data: BookingNotificationData): Promise<boolean> {
    if (!this.transporter || !this.settings?.adminEmail) {
      console.log('Email notification skipped: transporter not configured or no admin email');
      return false;
    }

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981, #3b82f6); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px; }
    .detail { margin: 10px 0; padding: 10px; background: white; border-radius: 8px; }
    .label { font-weight: bold; color: #10b981; }
    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
    .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Booking Baru!</h1>
      <p>Ada pesanan baru yang perlu diproses</p>
    </div>
    <div class="content">
      <div class="detail"><span class="label">Order Number:</span> ${data.orderNumber}</div>
      <div class="detail"><span class="label">Nama Customer:</span> ${data.customerName}</div>
      <div class="detail"><span class="label">Email:</span> ${data.customerEmail}</div>
      <div class="detail"><span class="label">Telepon:</span> ${data.customerPhone || '-'}</div>
      <div class="detail"><span class="label">Tanggal Layanan:</span> ${data.serviceDate}</div>
      <div class="detail"><span class="label">Jam:</span> ${data.serviceTime}</div>
      <div class="detail"><span class="label">Alamat:</span> ${data.address}</div>
      <div class="detail"><span class="label">Layanan:</span> ${data.serviceName}</div>
      <div class="detail"><span class="label">Total:</span> <strong>${data.totalAmount}</strong></div>
    </div>
    <div class="footer">
      <p>Dikirim otomatis dari NingClean</p>
    </div>
  </div>
</body>
</html>
`;

    try {
      await this.transporter.sendMail({
        from: this.settings.emailFrom || this.settings.emailUser,
        to: this.settings.adminEmail,
        subject: `🎉 Booking Baru: ${data.orderNumber} - ${data.customerName}`,
        html: emailHtml,
      });
      console.log('Email notification sent successfully');
      return true;
    } catch (error) {
      console.error('Failed to send email notification:', error);
      return false;
    }
  }

  /**
   * Send WhatsApp notification using Twilio (primary) or Baileys (fallback)
   */
  async sendWhatsAppNotification(data: BookingNotificationData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.settings?.whatsappEnabled) {
      console.log('WhatsApp notification skipped: not enabled');
      return { success: false, error: 'WhatsApp not enabled' };
    }

    const message = this.formatWhatsAppMessage(data);
    const targetNumber = this.settings?.whatsappNumber;

    if (!targetNumber) {
      return { success: false, error: 'WhatsApp number not configured' };
    }

    // Try Twilio first (preferred) - use lowercase column names
    if (this.settings?.twilioaccountsid && this.settings?.twilioauthtoken) {
      console.log('Sending via Twilio...');
      const result = await this.twilioService.sendWhatsAppMessage(targetNumber, message);
      if (result.success) {
        return result;
      }
      console.log('Twilio failed, trying Baileys fallback:', result.error);
    }

    // Fallback to Baileys if Twilio not configured or failed
    if (this.whatsAppService.isConnected()) {
      console.log('Sending via Baileys...');
      return await this.whatsAppService.sendMessage(targetNumber, message);
    }

    return { success: false, error: 'No WhatsApp provider connected. Configure Twilio or connect Baileys.' };
  }

  /**
   * Send booking notification (both WhatsApp direct message and email)
   */
  async notifyNewBooking(data: BookingNotificationData): Promise<{ 
    waSent: boolean; 
    waMessageId?: string;
    waError?: string;
    emailSent: boolean;
    waLink?: string | null; // For backward compatibility
  }> {
    await this.loadSettings(); // Refresh settings

    // Send WhatsApp direct message
    const waResult = await this.sendWhatsAppNotification(data);

    // Also generate click-to-chat link (for backward compatibility / fallback)
    const waMessage = this.formatWhatsAppMessage(data);
    const waLink = this.getWhatsAppLink(waMessage);

    // Send email
    const emailSent = await this.sendEmailNotification(data);

    return {
      waSent: waResult.success,
      waMessageId: waResult.messageId,
      waError: waResult.error,
      emailSent,
      waLink,
    };
  }

  /**
   * Get current settings (for admin panel)
   */
  async getSettings() {
    await this.loadSettings();
    
    // Return settings without sensitive data
    if (this.settings) {
      return {
        whatsappNumber: this.settings.whatsappNumber,
        whatsappMessage: this.settings.whatsappMessage,
        whatsappEnabled: this.settings.whatsappEnabled,
        emailEnabled: this.settings.emailEnabled,
        emailHost: this.settings.emailHost,
        emailPort: this.settings.emailPort,
        emailUser: this.settings.emailUser,
        emailFrom: this.settings.emailFrom,
        adminEmail: this.settings.adminEmail,
        // Twilio settings - use lowercase column names from database
        twilioAccountSid: this.settings.twilioaccountsid || '',
        twilioAuthToken: '', // Don't expose
        twilioFromNumber: this.settings.twiliofromnumber || '',
        hasTwilio: !!this.settings.twilioauthtoken,
        // Don't expose password
        hasPassword: !!this.settings.emailPassword,
      };
    }
    
    return null;
  }

  /**
   * Update notification settings
   */
  async updateSettings(data: {
    whatsappNumber?: string;
    whatsappMessage?: string;
    whatsappEnabled?: boolean;
    emailEnabled?: boolean;
    emailHost?: string;
    emailPort?: number;
    emailUser?: string;
    emailPassword?: string;
    emailFrom?: string;
    adminEmail?: string;
    twilioAccountSid?: string;
    twilioAuthToken?: string;
    twilioFromNumber?: string;
  }) {
    const updateData: any = {};
    
    // Only include provided fields
    if (data.whatsappNumber !== undefined) updateData.whatsappNumber = data.whatsappNumber;
    if (data.whatsappMessage !== undefined) updateData.whatsappMessage = data.whatsappMessage;
    if (data.whatsappEnabled !== undefined) updateData.whatsappEnabled = data.whatsappEnabled;
    if (data.emailEnabled !== undefined) updateData.emailEnabled = data.emailEnabled;
    if (data.emailHost !== undefined) updateData.emailHost = data.emailHost;
    if (data.emailPort !== undefined) updateData.emailPort = data.emailPort;
    if (data.emailUser !== undefined) updateData.emailUser = data.emailUser;
    if (data.emailFrom !== undefined) updateData.emailFrom = data.emailFrom;
    if (data.adminEmail !== undefined) updateData.adminEmail = data.adminEmail;
    
    // Only update password if provided (don't delete existing)
    if (data.emailPassword) {
      updateData.emailPassword = data.emailPassword;
    }

    // Twilio settings - use lowercase column names
    if (data.twilioAccountSid !== undefined) updateData.twilioAccountSid = data.twilioAccountSid;
    if (data.twilioAuthToken !== undefined) updateData.twilioAuthToken = data.twilioAuthToken;
    if (data.twilioFromNumber !== undefined) updateData.twilioFromNumber = data.twilioFromNumber;

    // Use raw SQL to update with lowercase column names (Postgres stores them as lowercase)
    try {
      // Build dynamic update - only include password if explicitly provided
      let sql = `
        UPDATE "notification_settings" SET
          "whatsappNumber" = COALESCE($1, "whatsappNumber"),
          "whatsappMessage" = COALESCE($2, "whatsappMessage"),
          "whatsappEnabled" = COALESCE($3, "whatsappEnabled"),
          "emailEnabled" = COALESCE($4, "emailEnabled"),
          "emailHost" = COALESCE($5, "emailHost"),
          "emailPort" = COALESCE($6, "emailPort"),
          "emailUser" = COALESCE($7, "emailUser"),
          "emailFrom" = COALESCE($8, "emailFrom"),
          "adminEmail" = COALESCE($9, "adminEmail"),
          "twilioaccountsid" = COALESCE($10, "twilioaccountsid"),
          "twiliofromnumber" = COALESCE($11, "twiliofromnumber")
      `;
      
      // Only include emailPassword and twilioauthtoken if explicitly provided
      let paramIndex = 12;
      if (data.emailPassword) {
        sql += `, "emailPassword" = $${paramIndex}`;
        paramIndex++;
      }
      if (data.twilioAuthToken) {
        sql += `, "twilioauthtoken" = $${paramIndex}`;
        paramIndex++;
      }
      
      sql += ` WHERE "id" = $${paramIndex}`;
      
      // Build params array
      const params: any[] = [
        data.whatsappNumber ?? null,
        data.whatsappMessage ?? null,
        data.whatsappEnabled ?? null,
        data.emailEnabled ?? null,
        data.emailHost ?? null,
        data.emailPort ?? null,
        data.emailUser ?? null,
        data.emailFrom ?? null,
        data.adminEmail ?? null,
        data.twilioAccountSid ?? null,
        data.twilioFromNumber ?? null,
      ];
      
      if (data.emailPassword) {
        params.push(data.emailPassword);
      }
      if (data.twilioAuthToken) {
        params.push(data.twilioAuthToken);
      }
      params.push(this.settings?.id || '');
      
      await this.prisma.$executeRawUnsafe(sql, ...params);
      
      // Refresh settings cache
      await this.refreshSettings();
      
      return { success: true };
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      throw error;
    }
  }

  // ============ Notification CRUD Methods ============

  /**
   * Get notifications with pagination
   */
  async getNotifications(params: { page?: number; limit?: number; unreadOnly?: boolean }) {
    const { page = 1, limit = 20, unreadOnly = false } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (unreadOnly) {
      where.isRead = false;
    }

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      data: notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      unreadCount: await this.getUnreadCount(),
    };
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<number> {
    return this.prisma.notification.count({
      where: { isRead: false },
    });
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(id: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) {
      throw new Error('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Mark a notification as unread
   */
  async markAsUnread(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: {
        isRead: false,
        readAt: null,
      },
    });
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    await this.prisma.notification.updateMany({
      where: { isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
    return { success: true };
  }

  /**
   * Delete old notifications (older than specified days)
   */
  async deleteOldNotifications(days: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await this.prisma.notification.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        isRead: true, // Only delete read notifications
      },
    });

    return { deleted: result.count };
  }

  /**
   * Create a notification (for internal use)
   */
  async createNotification(params: {
    type?: 'BOOKING_NEW' | 'BOOKING_STATUS' | 'SYSTEM';
    title: string;
    message: string;
    metadata?: any;
  }) {
    return this.prisma.notification.create({
      data: {
        type: params.type || 'SYSTEM',
        title: params.title,
        message: params.message,
        data: params.metadata || undefined,
      },
    });
  }
}
