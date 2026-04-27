import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Singleton untuk membatasi connections di Railway
let prismaInstance: PrismaClient | null = null;

function getPrismaInstance(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }
  return prismaInstance;
}

@Injectable()
export class PrismaService implements OnModuleDestroy {
  private client: PrismaClient;
  private connected = false;

  constructor() {
    this.client = getPrismaInstance();
  }

  // Lazy connection - hanya connect saat pertama kali dipakai
  private async ensureConnected() {
    if (!this.connected) {
      try {
        await this.client.$connect();
        this.connected = true;
        console.log('✅ Database connected (lazy)');
      } catch (error: any) {
        console.error('❌ Database connection failed:', error.message);
        throw error;
      }
    }
  }

  // Expose PrismaClient methods dengan lazy connection
  get teamMember() { 
    this.ensureConnected();
    return this.client.teamMember; 
  }
  get testimonial() { 
    this.ensureConnected();
    return this.client.testimonial; 
  }
  get blogPost() { 
    this.ensureConnected();
    return this.client.blogPost; 
  }
  get blogPostLike() { 
    this.ensureConnected();
    return this.client.blogPostLike; 
  }
  get blogCategory() { 
    this.ensureConnected();
    return this.client.blogCategory; 
  }
  get booking() { 
    this.ensureConnected();
    return this.client.booking; 
  }
  get bookingItem() { 
    this.ensureConnected();
    return this.client.bookingItem; 
  }
  get service() { 
    this.ensureConnected();
    return this.client.service; 
  }
  get customer() { 
    this.ensureConnected();
    return this.client.customer; 
  }
  get user() { 
    this.ensureConnected();
    return this.client.user; 
  }
  get invoice() { 
    this.ensureConnected();
    return this.client.invoice; 
  }
  get invoiceItem() { 
    this.ensureConnected();
    return this.client.invoiceItem; 
  }
  get companyStat() { 
    this.ensureConnected();
    return this.client.companyStat; 
  }
  get emailTemplate() { 
    this.ensureConnected();
    return this.client.emailTemplate; 
  }
  get auditLog() { 
    this.ensureConnected();
    return this.client.auditLog; 
  }
  get notificationSettings() { 
    this.ensureConnected();
    return this.client.notificationSettings; 
  }
  get siteSettings() { 
    this.ensureConnected();
    return this.client.siteSettings; 
  }
  get navigationSettings() { 
    this.ensureConnected();
    return this.client.navigationSettings; 
  }
  get homepageSettings() { 
    this.ensureConnected();
    return this.client.homepageSettings; 
  }
  get footerSettings() { 
    this.ensureConnected();
    return this.client.footerSettings; 
  }
  get galleryItem() { 
    this.ensureConnected();
    return this.client.galleryItem; 
  }
  get faq() { 
    this.ensureConnected();
    return this.client.faq; 
  }
  get serviceArea() { 
    this.ensureConnected();
    return this.client.serviceArea; 
  }
  get jobListing() { 
    this.ensureConnected();
    return this.client.jobListing; 
  }
  get pricingPlan() { 
    this.ensureConnected();
    return this.client.pricingPlan; 
  }
  get teamMember() { 
    this.ensureConnected();
    return this.client.teamMember; 
  }
  get newsletterSubscriber() { 
    this.ensureConnected();
    return this.client.newsletterSubscriber; 
  }
  get fileManager() { 
    this.ensureConnected();
    return this.client.fileManager; 
  }

  // Transaction tetap butuh async
  async $transaction<T>(fn: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    await this.ensureConnected();
    return this.client.$transaction(fn);
  }

  async onModuleDestroy() {
    if (this.connected) {
      await this.client.$disconnect();
      console.log('✅ Database disconnected');
    }
  }
}
