import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Singleton pattern untuk menghindari multiple connections
let prismaInstance: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }
  return prismaInstance;
}

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = getPrismaClient();
  }

  get client() {
    return this.prisma;
  }

  async onModuleInit() {
    try {
      await this.prisma.$connect();
      console.log('✅ Database connected');
    } catch (error: any) {
      console.error('❌ Database connection failed:', error.message);
      throw error;
    }
  }

  async onModuleDestroy() {
    // Jangan disconnect di production (serverless)
    // Connection akan direuse
    if (process.env.NODE_ENV !== 'production') {
      await this.prisma.$disconnect();
      console.log('✅ Database disconnected');
    }
  }
}
