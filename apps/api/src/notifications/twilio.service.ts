import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';
import { PrismaService } from '../prisma/prisma.service';

export interface TwilioMessage {
  to: string;
  body: string;
}

@Injectable()
export class TwilioService {
  private client: twilio.Twilio | null = null;
  private settings: any = null;
  private fromNumber: string = '';

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.loadSettings();
    this.initializeClient();
  }

  private async loadSettings() {
    try {
      // Use lowercase column names that match the actual database schema
      interface SettingsRow {
        twilioaccountsid: string | null;
        twilioauthtoken: string | null;
        twiliofromnumber: string | null;
        whatsappNumber: string | null;
        whatsappEnabled: boolean;
        whatsappMessage: string | null;
        emailEnabled: boolean;
        emailHost: string | null;
        emailPort: number | null;
        emailUser: string | null;
        emailPassword: string | null;
        emailFrom: string | null;
        adminEmail: string | null;
      }
      
      // Use column names matching the Prisma schema
      const result = await this.prisma.$queryRawUnsafe(`
        SELECT 
          "twilioaccountsid",
          "twilioauthtoken",
          "twiliofromnumber",
          "whatsappNumber",
          "whatsappEnabled",
          "whatsappMessage",
          "emailEnabled",
          "emailHost",
          "emailPort",
          "emailUser",
          "emailPassword",
          "emailFrom",
          "adminEmail"
        FROM "notification_settings" 
        LIMIT 1
      `) as SettingsRow[];
      
      this.settings = result && result.length > 0 ? result[0] : null;
      
      // Also load Twilio config from env if available
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        this.settings = this.settings || {} as SettingsRow;
        this.settings.twilioaccountsid = process.env.TWILIO_ACCOUNT_SID;
        this.settings.twilioauthtoken = process.env.TWILIO_AUTH_TOKEN;
      }
    } catch (error) {
      console.error('Failed to load settings for Twilio:', error);
      this.settings = null;
    }
  }

  async refreshSettings() {
    await this.loadSettings();
    this.initializeClient();
  }

  private initializeClient() {
    // Use lowercase column names from database
    if (this.settings?.twilioaccountsid && this.settings?.twilioauthtoken) {
      try {
        this.client = twilio(
          this.settings.twilioaccountsid,
          this.settings.twilioauthtoken
        );
        this.fromNumber = this.settings.twiliofromnumber || this.settings.whatsappNumber || '';
        console.log('Twilio client initialized');
      } catch (error) {
        console.error('Failed to initialize Twilio client:', error);
      }
    }
  }

  /**
   * Send WhatsApp message via Twilio
   */
  async sendWhatsAppMessage(to: string, body: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.client) {
      return { success: false, error: 'Twilio not configured. Please add your credentials in settings.' };
    }

    if (!this.fromNumber) {
      return { success: false, error: 'WhatsApp sender number not configured.' };
    }

    try {
      // Clean phone number
      let phoneNumber = to.replace(/\D/g, '');
      
      // Add country code if needed
      if (!phoneNumber.startsWith('1') && !phoneNumber.startsWith('62')) {
        if (phoneNumber.startsWith('0')) {
          phoneNumber = '62' + phoneNumber.substring(1);
        }
      }

      // Format for WhatsApp: both sender and recipient need wa: prefix
      const toWhatsApp = phoneNumber.startsWith('62') 
        ? `whatsapp:+${phoneNumber}` 
        : `whatsapp:+62${phoneNumber}`;
      
      const fromWhatsApp = this.fromNumber.startsWith('whatsapp:') 
        ? this.fromNumber 
        : `whatsapp:+${this.fromNumber.replace(/\D/g, '')}`;

      const message = await this.client.messages.create({
        body: body,
        from: fromWhatsApp,
        to: toWhatsApp,
      });

      console.log(`Twilio WhatsApp message sent to ${phoneNumber}:`, message.sid);
      return { success: true, messageId: message.sid };
    } catch (error: any) {
      console.error('Failed to send Twilio WhatsApp message:', error);
      return { success: false, error: error?.message || 'Failed to send message' };
    }
  }

  /**
   * Send test message
   */
  async sendMessage(to: string, body: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    return this.sendWhatsAppMessage(to, body);
  }

  /**
   * Check if Twilio is configured and connected
   */
  isConnected(): boolean {
    return this.client !== null;
  }

  /**
   * Get connection status
   */
  getStatus(): { connected: boolean; configured: boolean } {
    // Use lowercase column names to match database schema
    return {
      connected: this.isConnected(),
      configured: !!(this.settings?.twilioaccountsid && this.settings?.twilioauthtoken),
    };
  }
}