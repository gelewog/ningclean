import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }

  async onModuleInit() {
    // Skip connection saat Railway build (RAILWAY_ENVIRONMENT tanpa RAILWAY_STATIC_URL = build phase)
    if (process.env.RAILWAY_ENVIRONMENT && !process.env.RAILWAY_STATIC_URL) {
      console.log('⏭️ Railway build phase - skipping DB connection');
      return;
    }

    try {
      await this.$connect();
      console.log('✅ Database connected');
    } catch (error: any) {
      console.error('❌ Database connection failed:', error.message);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('✅ Database disconnected');
  }
}
