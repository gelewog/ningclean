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
    // Skip DB connection saat build phase
    // Railway build tidak butuh koneksi aktif
    if (process.env.RAILWAY_ENVIRONMENT && !process.env.RAILWAY_STATIC_URL) {
      console.log('⏭️ Build phase - skipping DB connection');
      return;
    }

    try {
      await this.$connect();
      console.log('✅ Database connected');
    } catch (error: any) {
      console.error('❌ Database connection failed:', error.message);
      // Hanya throw error saat runtime, bukan build
      if (process.env.RAILWAY_STATIC_URL || process.env.NODE_ENV === 'development') {
        throw error;
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('✅ Database disconnected');
  }
}
