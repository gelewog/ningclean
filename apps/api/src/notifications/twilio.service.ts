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
        this.settings = {
          // Twilio config from config JSONB
          twilioAccountSid: row.config?.twilio?.accountSid || null,
          twilioFromNumber: row.config?.twilio?.fromNumber || row.config?.whatsapp?.number || null,
          whatsappNumber: row.config?.whatsapp?.number || null,
          whatsappEnabled: row.config?.whatsapp?.enabled || false,
          whatsappMessage: row.config?.whatsapp?.defaultMessage || null,
          // Email config
          emailEnabled: row.config?.email?.enabled || false,
          emailHost: row.config?.email?.host || null,
          emailPort: row.config?.email?.port || null,
          emailUser: row.config?.email?.user || null,
          emailFrom: row.config?.email?.from || null,
          adminEmail: row.config?.email?.adminEmail || null,
          // Secrets from secrets JSONB
          twilioAuthToken: row.secrets?.twilioAuthToken || null,
          emailPassword: row.secrets?.emailPassword || null,
        };
      } else {
        this.settings = null;
      }
      
      // Also load Twilio config from env if available (fallback)
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        this.settings = this.settings || {};
        this.settings.twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
        this.settings.twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
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
    // Use camelCase property names from settings object
    if (this.settings?.twilioAccountSid && this.settings?.twilioAuthToken) {
      try {
        this.client = twilio(
          this.settings.twilioAccountSid,
          this.settings.twilioAuthToken
        );
        this.fromNumber = this.settings.twilioFromNumber || this.settings.whatsappNumber || '';
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