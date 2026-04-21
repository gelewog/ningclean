import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Database connected');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      // Don't throw - let the app start even if DB fails
    }
  }
}
