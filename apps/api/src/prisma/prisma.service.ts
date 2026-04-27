import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Singleton untuk membatasi connections di Railway
let prismaInstance: PrismaClient | null = null;

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private client: PrismaClient;

  constructor() {
    if (!prismaInstance) {
      prismaInstance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      });
    }
    this.client = prismaInstance;
  }

  // Expose PrismaClient methods
  get teamMember() { return this.client.teamMember; }
  get testimonial() { return this.client.testimonial; }
  get blogPost() { return this.client.blogPost; }
  get blogPostLike() { return this.client.blogPostLike; }
  get booking() { return this.client.booking; }
  get service() { return this.client.service; }
  get customer() { return this.client.customer; }
  get user() { return this.client.user; }
  get $transaction() { return this.client.$transaction.bind(this.client); }
  
  // Forward all other properties
  get prisma() { return this.client; }

  async onModuleInit() {
    try {
      await this.client.$connect();
      console.log('✅ Database connected');
    } catch (error: any) {
      console.error('❌ Database connection failed:', error.message);
      throw error;
    }
  }

  async onModuleDestroy() {
    // Don't disconnect in production - connection reused
    if (process.env.NODE_ENV !== 'production') {
      await this.client.$disconnect();
      console.log('✅ Database disconnected');
    }
  }
}
