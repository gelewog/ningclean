import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TwilioService } from './twilio.service';

export interface WhatsAppMessage {
  to: string;
  text: string;
}

@Injectable()
export class WhatsAppService implements OnModuleInit {
  private settings: any = null;

  constructor(
    private prisma: PrismaService,
    private twilioService: TwilioService,
  ) {}

  async onModuleInit() {
    await this.loadSettings();
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
          whatsappNumber: row.config?.whatsapp?.number || null,
          whatsappEnabled: row.config?.whatsapp?.enabled || false,
          whatsappMessage: row.config?.whatsapp?.defaultMessage || null,
          // Twilio config
          twilioAccountSid: row.config?.twilio?.accountSid || null,
          twilioFromNumber: row.config?.twilio?.fromNumber || null,
          twilioAuthToken: row.secrets?.twilioAuthToken || null,
        };
      } else {
        this.settings = null;
      }
    } catch (error) {
      console.error('Failed to load WhatsApp settings:', error);
      this.settings = null;
    }
  }

  async refreshSettings() {
    await this.loadSettings();
  }

  /**
   * Check if WhatsApp is enabled and configured
   */
  isEnabled(): boolean {
    return !!(this.settings?.whatsappEnabled && this.settings?.twilioAccountSid);
  }

  /**
   * Send WhatsApp message via Twilio
   */
  async sendMessage(to: string, text: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isEnabled()) {
      return { success: false, error: 'WhatsApp notifications not enabled or Twilio not configured.' };
    }

    // Use TwilioService to send WhatsApp message
    return this.twilioService.sendWhatsAppMessage(to, text);
  }

  /**
   * Check if WhatsApp/Twilio is connected
   */
  isConnected(): boolean {
    return this.twilioService.isConnected();
  }

  /**
   * Get connection status
   */
  getStatus(): { connected: boolean; configured: boolean; enabled: boolean } {
    return {
      connected: this.isConnected(),
      configured: !!(this.settings?.twilioAccountSid && this.settings?.twilioAuthToken),
      enabled: this.settings?.whatsappEnabled || false,
    };
  }
}
