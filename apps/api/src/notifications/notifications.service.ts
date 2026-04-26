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
      
      const settings = await this.prisma.notificationSettings.findFirst();
      this.settings = settings?.config || null;
      if (settings?.secrets) {
        this.settings = { ...this.settings, ...settings.secrets };
      }
    } catch (error) {
      console.log('Failed to load notification settings:', error);
      this.settings = null;
    }
  }

  private initializeTransporter() {
    if (!this.settings?.emailUser || !this.settings?.emailPassword) {
      console.log('Email transporter not initialized - credentials not configured');
      return;
    }

    try {
      this.transporter = nodemailer.createTransporter({
        host: this.settings.smtpHost || 'smtp.gmail.com',
        port: this.settings.smtpPort || 587,
        secure: this.settings.smtpSecure || false,
        auth: {
          user: this.settings.emailUser,
          pass: this.settings.emailPassword,
        },
      });
      console.log('Email transporter initialized successfully');
    } catch (error) {
      console.error('Failed to initialize email transporter:', error);
      this.transporter = null;
    }
  }

  /**
   * Refresh settings from database
   */
  async refreshSettings() {
    await this.loadSettings();
    this.initializeTransporter();
  }

  /**
   * Get WhatsApp deep link for opening chat
   */
  getWhatsAppLink(phone: string, message?: string): string | null {
    return this.whatsAppService.getWhatsAppLink(phone, message);
  }

  /**
   * Format WhatsApp message for booking notification
   */
  private formatWhatsAppMessage(data: BookingNotificationData): string {
    const { orderNumber, customerName, customerPhone, serviceName, serviceDate, serviceTime, address, totalAmount, notes } = data;
    return `🎉 *Booking Baru!*\n\n` +
      `*Order:* ${orderNumber}\n` +
      `*Nama:* ${customerName}\n` +
      `*Email:* ${customerEmail}\n` +
      `*Telepon:* ${customerPhone || '-'}\n\n` +
      `*Layanan:* ${serviceName}\n` +
      `*Tanggal:* ${serviceDate}\n` +
      `*Jam:* ${serviceTime}\n` +
      `*Alamat:* ${address}\n` +
      `*Total:* ${totalAmount}\n` +
      (notes ? `\n*Catatan:* ${notes}` : '');
  }

  /**
   * Send email notification for new booking
   */
  private async sendEmailNotification(data: BookingNotificationData): Promise<boolean> {
    await this.loadSettings();
    
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
    const waLink = this.getWhatsAppLink(data.customerPhone || '', waMessage);
    
    return {
      waSent: waResult.success,
      waMessageId: waResult.messageId,
      waError: waResult.error,
      emailSent: await this.sendEmailNotification(data),
      waLink,
    };
  }

  /**
   * Get current notification settings
   */
  async getSettings() {
    await this.loadSettings();
    return {
      ...this.settings,
      emailPassword: this.settings?.emailPassword ? '***hidden***' : undefined,
      twilioAuthToken: this.settings?.twilioAuthToken ? '***hidden***' : undefined,
      apiKey: this.settings?.apiKey ? '***hidden***' : undefined,
      apiSecret: this.settings?.apiSecret ? '***hidden***' : undefined,
    };
  }

  /**
   * Update notification settings
   */
  async updateSettings(settings: any) {
    await this.loadSettings();
    
    // Merge with existing settings
    const newSettings = {
      ...this.settings,
      ...settings,
    };
    
    // Encrypt secrets
    const encrypted = await this.prisma.$queryRaw`
      SELECT pgp_sym_encrypt(${JSON.stringify(newSettings)}, ${process.env.ENCRYPTION_KEY || 'default'}) as encrypted
    `;
    
    await this.prisma.notificationSettings.updateMany({
      data: { config: encrypted[0].encrypted },
    });
    
    await this.refreshSettings();
    return this.getSettings();
  }

  // Get all notifications
  async getNotifications(limit: number = 50, onlyUnread: boolean = false) {
    const where = onlyUnread ? { isRead: false } : {};
    return this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  // Get unread count
  async getUnreadCount() {
    return this.prisma.notification.count({
      where: { isRead: false },
    });
  }

  // Mark as read
  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
  }

  // Mark as unread
  async markAsUnread(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: false, readAt: null },
    });
  }

  // Mark all as read
  async markAllAsRead() {
    return this.prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  // Delete old notifications (cleanup)
  async deleteOldNotifications(days: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return this.prisma.notification.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        isRead: true,
      },
    });
  }

  // Create a new notification
  async createNotification(params: {
    type?: string;
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

  // Alias methods for booking notifications compatibility
  async sendBookingNotifications(data: any) {
    console.log('[Notifications] sendBookingNotifications called:', data);
    // Delegate to notifyNewBooking if it's booking data
    if (data.orderNumber) {
      return this.notifyNewBooking(data as BookingNotificationData);
    }
    return { waSent: false, emailSent: false };
  }

  async sendBookingConfirmed(data: any) {
    console.log('[Notifications] sendBookingConfirmed called:', data);
    // Implementation placeholder
    return { waSent: false, emailSent: false };
  }

  async sendBookingCancelled(data: any) {
    console.log('[Notifications] sendBookingCancelled called:', data);
    // Implementation placeholder
    return { waSent: false, emailSent: false };
  }
}
