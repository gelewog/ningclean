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
  notes?: string;
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
      // Check if table exists first
      const tableExists = await this.prisma.$queryRawUnsafe(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'notification_settings'
        );
      `) as [{ exists: boolean }];
      
      if (!tableExists[0]?.exists) {
        console.log('notification_settings table does not exist');
        this.settings = null;
        return;
      }
      
      // Read from JSONB config and secrets fields
      const result = await this.prisma.$queryRawUnsafe(`
        SELECT 
          "config",
          "secrets"
        FROM "notification_settings" 
        LIMIT 1
      `) as { config: any; secrets: any }[];
      
      if (result && result.length > 0) {
        const row = result[0];
        // Safely parse config and secrets
        const config = row.config || {};
        const secrets = row.secrets || {};
        
        this.settings = {
          // WhatsApp
          whatsappNumber: config.whatsapp?.number || null,
          whatsappEnabled: config.whatsapp?.enabled || false,
          whatsappMessage: config.whatsapp?.defaultMessage || null,
          // Email
          emailEnabled: config.email?.enabled || false,
          emailHost: config.email?.host || null,
          emailPort: config.email?.port || null,
          emailUser: config.email?.user || null,
          emailFrom: config.email?.from || null,
          adminEmail: config.email?.adminEmail || null,
          // Twilio
          twilioAccountSid: config.twilio?.accountSid || null,
          twilioFromNumber: config.twilio?.fromNumber || null,
          // Secrets
          emailPassword: secrets.emailPassword || null,
          twilioAuthToken: secrets.twilioAuthToken || null,
        };
      } else {
        // Return default settings
        this.settings = {
          whatsappNumber: null,
          whatsappEnabled: false,
          whatsappMessage: null,
          emailEnabled: false,
          emailHost: null,
          emailPort: null,
          emailUser: null,
          emailFrom: null,
          adminEmail: null,
          twilioAccountSid: null,
          twilioFromNumber: null,
          emailPassword: null,
          twilioAuthToken: null,
        };
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error);
      this.settings = null;
    }
  }

  private initializeTransporter() {
    if (this.settings?.emailEnabled && this.settings?.emailHost && this.settings?.emailPassword) {
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

    const number = this.settings.whatsappNumber.replace(/\+/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${number}?text=${encodedMessage}`;
  }

  /**
   * Format booking notification message for WhatsApp
   */
  formatWhatsAppMessage(data: BookingNotificationData): string {
    console.log('🔍 DEBUG formatWhatsAppMessage INPUT:');
    console.log('   data.notes:', data.notes);
    console.log('   data.notes type:', typeof data.notes);
    console.log('   this.settings?.whatsappMessage exists:', !!this.settings?.whatsappMessage);
    
    // Use custom message from settings if available, otherwise use default
    const defaultMessage = `🎉 *Booking Baru!*

📋 *Order:* {orderNumber}
👤 *Nama:* {customerName}
📞 *Telepon:* {customerPhone}
📅 *Tanggal:* {serviceDate}
⏰ *Jam:* {serviceTime}
🏠 *Alamat:* {address}
🧹 *Layanan:* {serviceName}
📝 *Catatan:* {notes}
💰 *Total:* {totalAmount}

---
Dikirim otomatis dari NingClean`;

    const message = this.settings?.whatsappMessage || defaultMessage;
    
    console.log('🔍 Using message template:', this.settings?.whatsappMessage ? 'FROM SETTINGS' : 'DEFAULT');

    // BEFORE replace - check if {notes} exists in template
    console.log('🔍 Template includes {notes}:', message.includes('{notes}'));

    const formattedMessage = message
      .replace(/{orderNumber}/g, data.orderNumber)
      .replace(/{customerName}/g, data.customerName)
      .replace(/{customerEmail}/g, data.customerEmail || '-')
      .replace(/{customerPhone}/g, data.customerPhone || '-')
      .replace(/{serviceName}/g, data.serviceName)
      .replace(/{serviceDate}/g, data.serviceDate)
      .replace(/{serviceTime}/g, data.serviceTime)
      .replace(/{address}/g, data.address)
      .replace(/{totalAmount}/g, data.totalAmount)
      .replace(/{notes}/g, data.notes || 'Tidak ada catatan');
    
    // AFTER replace
    console.log('🔍 AFTER replace:');
    console.log('   Formatted includes original notes:', data.notes ? formattedMessage.includes(data.notes) : 'N/A');
    
    return formattedMessage;
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
    .notes { background: #fffbeb; border-left: 4px solid #f59e0b; }
    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
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
      ${data.notes ? `<div class="detail notes"><span class="label">Catatan Customer:</span><br/>${data.notes}</div>` : ''}
    </div>
    <div class="footer">
      <p>Dikirim otomatis dari NingClean</p>
    </div>
  </div>
</body>
</html>`;

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
   * Send WhatsApp notification using Twilio only
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

    // Check if Twilio is configured
    if (!this.settings?.twilioAccountSid || !this.settings?.twilioAuthToken) {
      return { success: false, error: 'Twilio not configured. Please set up Twilio credentials.' };
    }

    // Use TwilioService to send WhatsApp message
    console.log('Sending WhatsApp via Twilio...');
    return this.twilioService.sendWhatsAppMessage(targetNumber, message);
  }

  /**
   * Send booking notification (both WhatsApp and email)
   */
  async notifyNewBooking(data: BookingNotificationData): Promise<{ 
    waSent: boolean; 
    waMessageId?: string;
    waError?: string;
    emailSent: boolean;
    waLink?: string | null;
  }> {
    await this.loadSettings();

    const waResult = await this.sendWhatsAppNotification(data);
    const waMessage = this.formatWhatsAppMessage(data);
    const waLink = this.getWhatsAppLink(waMessage);
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
    
    // Return default values even if settings is null
    const defaults = {
      whatsappNumber: '',
      whatsappMessage: '',
      whatsappEnabled: false,
      emailEnabled: false,
      emailHost: 'smtp.gmail.com',
      emailPort: 587,
      emailUser: '',
      emailFrom: '',
      adminEmail: '',
      twilioAccountSid: '',
      twilioFromNumber: '',
      twilioAuthToken: '',
      hasTwilio: false,
      hasPassword: false,
    };
    
    if (!this.settings) return defaults;

    return {
      whatsappNumber: this.settings.whatsappNumber || '',
      whatsappMessage: this.settings.whatsappMessage || '',
      whatsappEnabled: this.settings.whatsappEnabled || false,
      emailEnabled: this.settings.emailEnabled || false,
      emailHost: this.settings.emailHost || 'smtp.gmail.com',
      emailPort: this.settings.emailPort || 587,
      emailUser: this.settings.emailUser || '',
      emailFrom: this.settings.emailFrom || '',
      adminEmail: this.settings.adminEmail || '',
      twilioAccountSid: this.settings.twilioAccountSid || '',
      twilioFromNumber: this.settings.twilioFromNumber || '',
      hasTwilio: !!this.settings.twilioAuthToken,
      hasPassword: !!this.settings.emailPassword,
    };
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
    // Build config JSON
    const config: any = {
      whatsapp: {},
      email: {},
      twilio: {},
    };
    const secrets: any = {};

    if (data.whatsappNumber !== undefined) config.whatsapp.number = data.whatsappNumber;
    if (data.whatsappMessage !== undefined) config.whatsapp.defaultMessage = data.whatsappMessage;
    if (data.whatsappEnabled !== undefined) config.whatsapp.enabled = data.whatsappEnabled;
    
    if (data.emailEnabled !== undefined) config.email.enabled = data.emailEnabled;
    if (data.emailHost !== undefined) config.email.host = data.emailHost;
    if (data.emailPort !== undefined) config.email.port = data.emailPort;
    if (data.emailUser !== undefined) config.email.user = data.emailUser;
    if (data.emailFrom !== undefined) config.email.from = data.emailFrom;
    if (data.adminEmail !== undefined) config.email.adminEmail = data.adminEmail;
    
    if (data.twilioAccountSid !== undefined) config.twilio.accountSid = data.twilioAccountSid;
    if (data.twilioFromNumber !== undefined) config.twilio.fromNumber = data.twilioFromNumber;

    if (data.emailPassword) secrets.emailPassword = data.emailPassword;
    if (data.twilioAuthToken) secrets.twilioAuthToken = data.twilioAuthToken;

    try {
      // Check if settings exist
      const existing = await this.prisma.$queryRawUnsafe(`
        SELECT id FROM "notification_settings" LIMIT 1
      `) as { id: string }[];

      if (existing.length > 0) {
        // Update existing - merge config
        await this.prisma.$executeRawUnsafe(`
          UPDATE "notification_settings" 
          SET 
            "config" = "config" || $1::jsonb,
            "secrets" = COALESCE("secrets", '{}'::jsonb) || $2::jsonb,
            "updatedAt" = NOW()
          WHERE id = $3
        `, JSON.stringify(config), JSON.stringify(secrets), existing[0].id);
      } else {
        // Create new
        await this.prisma.$executeRawUnsafe(`
          INSERT INTO "notification_settings" (id, name, config, secrets, "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), 'default', $1::jsonb, $2::jsonb, NOW(), NOW())
        `, JSON.stringify(config), JSON.stringify(secrets));
      }
      
      await this.refreshSettings();
      return { success: true };
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      throw error;
    }
  }

  // ============ Notification CRUD Methods ============

  async getNotifications(params: { page?: number; limit?: number; unreadOnly?: boolean }) {
    const { page = 1, limit = 20, unreadOnly = false } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (unreadOnly) where.isRead = false;

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

  async getUnreadCount(): Promise<number> {
    return this.prisma.notification.count({
      where: { isRead: false },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAsUnread(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: false, readAt: null },
    });
  }

  async markAllAsRead() {
    await this.prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    return { success: true };
  }

  async deleteOldNotifications(days: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await this.prisma.notification.deleteMany({
      where: { createdAt: { lt: cutoffDate }, isRead: true },
    });

    return { deleted: result.count };
  }

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
