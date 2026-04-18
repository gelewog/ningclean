import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NewsletterService {
  constructor(private prisma: PrismaService) {}

  async subscribe(email: string) {
    const existing = await this.prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (!existing.isActive) {
        await this.prisma.newsletterSubscriber.update({
          where: { email },
          data: { isActive: true, unsubscribedAt: null },
        });
        return { success: true, message: 'Selamat! Kamu sudah berlangganan kembali.' };
      }
      return { success: true, message: 'Kamu sudah berlangganan sebelumnya.' };
    }

    await this.prisma.newsletterSubscriber.create({
      data: { email },
    });

    return { success: true, message: 'Berhasil! Cek inbox kamu untuk tips kebersihan.' };
  }

  async unsubscribe(email: string) {
    const existing = await this.prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (!existing || !existing.isActive) {
      return { success: false, message: 'Email tidak ditemukan.' };
    }

    await this.prisma.newsletterSubscriber.update({
      where: { email },
      data: { isActive: false, unsubscribedAt: new Date() },
    });

    return { success: true, message: 'Berhasil berhenti berlangganan.' };
  }

  async getSubscribers() {
    return this.prisma.newsletterSubscriber.findMany({
      where: { isActive: true },
      orderBy: { subscribedAt: 'desc' },
    });
  }
}
