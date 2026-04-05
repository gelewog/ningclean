import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  proto,
  WASocket,
} from 'baileys';
import { Boom } from '@hapi/boom';
import * as fs from 'fs';
import * as path from 'path';
import * as QRCode from 'qrcode';

export interface WhatsAppMessage {
  to: string;
  text: string;
}

@Injectable()
export class WhatsAppService implements OnModuleInit, OnModuleDestroy {
  private sock: WASocket | null = null;
  private settings: any = null;
  private isConnecting = false;
  private authDir: string;
  private currentQR: string | null = null;
  private qrRefreshCallback: ((qr: string) => void) | null = null;

  constructor(private prisma: PrismaService) {
    // Store auth files in api directory
    this.authDir = path.join(process.cwd(), 'whatsapp-auth');
  }

  async onModuleInit() {
    await this.loadSettings();
    if (this.settings?.whatsappEnabled) {
      await this.connect();
    }
  }

  async onModuleDestroy() {
    await this.disconnect();
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
        twilioAccountSid: string | null;
        twilioAuthToken: string | null;
        twilioFromNumber: string | null;
      }
      
      // Use lowercase column names for Postgres
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
      console.error('Failed to load settings for WhatsApp:', error);
      this.settings = null;
    }
  }

  async refreshSettings() {
    await this.loadSettings();
  }

  /**
   * Register a callback for QR updates
   */
  onQRGenerated(callback: (qr: string) => void) {
    this.qrRefreshCallback = callback;
  }

  /**
   * Connect to WhatsApp using Baileys
   */
  async connect(): Promise<boolean> {
    if (this.sock || this.isConnecting) {
      console.log('WhatsApp already connected or connecting');
      return this.sock !== null;
    }

    this.isConnecting = true;

    try {
      // Ensure auth directory exists
      if (!fs.existsSync(this.authDir)) {
        fs.mkdirSync(this.authDir, { recursive: true });
      }

      const { state, saveCreds } = await useMultiFileAuthState(this.authDir);

      this.sock = makeWASocket({
        auth: state,
        defaultQueryTimeoutMs: 60 * 1000,
        // QR code will be captured via 'qr' event
      });

      let connectionTimeout: NodeJS.Timeout;

      // Handle QR code generation
      (this.sock.ev as any).on('qr', async (qr: string) => {
        console.log('QR Code received, generating image...');
        try {
          const qrImage = await QRCode.toDataURL(qr);
          this.currentQR = qrImage;
          console.log('QR Code generated successfully');

          // Trigger callback if registered
          if (this.qrRefreshCallback) {
            this.qrRefreshCallback(qrImage);
          }
        } catch (error) {
          console.error('Failed to generate QR code image:', error);
        }
      });

      // Handle connection update
      this.sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        // If QR is provided in connection update (newer baileys versions)
        if (qr) {
          console.log('QR received via connection.update');
          try {
            const qrImage = await QRCode.toDataURL(qr);
            this.currentQR = qrImage;
            if (this.qrRefreshCallback) {
              this.qrRefreshCallback(qrImage);
            }
          } catch (error) {
            console.error('Failed to generate QR from connection update:', error);
          }
        }

        if (connection === 'close') {
          const shouldReconnect =
            (lastDisconnect?.error as Boom)?.output?.statusCode !==
            DisconnectReason.loggedOut;

          console.log(
            `WhatsApp connection closed. Reason: ${lastDisconnect?.error}. Reconnecting: ${shouldReconnect}`,
          );

          this.sock = null;
          this.currentQR = null;

          if (shouldReconnect) {
            // Exponential backoff for reconnect
            setTimeout(async () => {
              await this.connect();
            }, 5000);
          }
        } else if (connection === 'open') {
          console.log('WhatsApp connected successfully!');
          this.currentQR = null; // Clear QR once connected
        }
      });

      // Save credentials when updated
      this.sock.ev.on('creds.update', saveCreds);

      // Wait for connection to be ready with extended timeout
      await new Promise<void>((resolve, reject) => {
        const checkConnection = setInterval(() => {
          if (this.sock?.user) {
            clearInterval(checkConnection);
            clearTimeout(connectionTimeout);
            resolve();
          }
        }, 1000);

        // Extended timeout to 60 seconds for pairing
        connectionTimeout = setTimeout(() => {
          clearInterval(checkConnection);
          if (this.sock?.user) {
            resolve();
          } else {
            console.log('WhatsApp connection timeout - device may need QR scan');
            resolve(); // Don't reject, let user scan QR
          }
        }, 60000);
      });

      console.log('WhatsApp service initialized');
      return true;
    } catch (error) {
      console.error('Failed to connect to WhatsApp:', error);
      this.isConnecting = false;
      return false;
    } finally {
      this.isConnecting = false;
    }
  }

  /**
   * Disconnect from WhatsApp
   */
  async disconnect(): Promise<void> {
    if (this.sock) {
      await this.sock.logout();
      this.sock = null;
      console.log('WhatsApp disconnected');
    }
  }

  /**
   * Reconnect to WhatsApp (restart connection)
   */
  async reconnect(): Promise<boolean> {
    await this.disconnect();
    return await this.connect();
  }

  /**
   * Send WhatsApp message
   */
  async sendMessage(to: string, text: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.sock) {
      return { success: false, error: 'WhatsApp not connected. Call connect() first.' };
    }

    try {
      // Clean phone number - remove all non-digits
      let phoneNumber = to.replace(/\D/g, '');

      // Add Indonesia country code if not present
      if (!phoneNumber.startsWith('62')) {
        if (phoneNumber.startsWith('0')) {
          phoneNumber = '62' + phoneNumber.substring(1);
        } else {
          phoneNumber = '62' + phoneNumber;
        }
      }

      // Format: 62xxx@us.gg (for WhatsApp)
      const jid = phoneNumber + '@s.whatsapp.net';

      const message = await this.sock.sendMessage(jid, { text });

      console.log(`WhatsApp message sent to ${phoneNumber}:`, message?.key?.id);

      return { success: true, messageId: message?.key?.id };
    } catch (error: any) {
      console.error('Failed to send WhatsApp message:', error);
      return { success: false, error: error?.message || 'Unknown error' };
    }
  }

  /**
   * Check if WhatsApp is connected
   */
  isConnected(): boolean {
    return this.sock !== null && this.sock.user !== undefined;
  }

  /**
   * Get connection status
   */
  getStatus(): { connected: boolean; user?: string } {
    return {
      connected: this.isConnected(),
      user: this.sock?.user?.name || this.sock?.user?.id,
    };
  }

  /**
   * Get QR code for pairing (for admin panel)
   * Returns the QR code as a data URL or null if not available
   */
  getQRCode(): string | null {
    return this.currentQR;
  }

  /**
   * Check if QR code is currently available
   */
  hasQRCode(): boolean {
    return this.currentQR !== null;
  }

  /**
   * Delete auth files and logout
   */
  async resetConnection(): Promise<void> {
    await this.disconnect();

    if (fs.existsSync(this.authDir)) {
      fs.rmSync(this.authDir, { recursive: true, force: true });
    }

    console.log('WhatsApp auth reset complete');
  }
}
