import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TemplateType } from '@prisma/client';

@Injectable()
export class EmailTemplatesService {
  constructor(private prisma: PrismaService) {}

  // Default templates
  private defaultTemplates = [
    {
      type: 'BOOKING_CONFIRMED' as TemplateType,
      name: 'Booking Confirmed',
      subject: '🎉 Booking Anda Telah Dikonfirmasi! - {orderNumber}',
      body: `Dear {customerName},

Booking Anda telah berhasil dikonfirmasi!

📋 Detail Booking:
- Order Number: {orderNumber}
- Layanan: {serviceName}
- Tanggal: {serviceDate}
- Waktu: {serviceTime}
- Alamat: {address}
- Total: {totalAmount}

Tim kami akan segera menghubungi Anda untuk konfirmasi akhir.

Terima kasih telah memilih NingClean!

Salam,
Tim NingClean`,
      smsBody: 'Booking {orderNumber} telah dikonfirmasi. Layanan: {serviceName}, {serviceDate} pukul {serviceTime}. Terima kasih!',
    },
    {
      type: 'BOOKING_STATUS_UPDATED' as TemplateType,
      name: 'Status Booking Updated',
      subject: '📢 Update Status Booking {orderNumber}',
      body: `Dear {customerName},

Status booking Anda telah diperbarui!

📋 Order Number: {orderNumber}
📌 Status Baru: {status}

{statusMessage}

Jika ada pertanyaan, jangan ragu untuk menghubungi kami.

Terima kasih,
Tim NingClean`,
      smsBody: 'Status booking {orderNumber} telah diubah menjadi: {status}.',
    },
    {
      type: 'BOOKING_REMINDER' as TemplateType,
      name: 'Booking Reminder',
      subject: '⏰ Reminder: Layanan Akan Dilakukan Besok!',
      body: `Dear {customerName},

Ini adalah pengingat bahwa booking Anda akan dilakukan besok!

📋 Detail:
- Order Number: {orderNumber}
- Layanan: {serviceName}
- Tanggal: {serviceDate}
- Waktu: {serviceTime}
- Alamat: {address}

Pastikan area yang akan dibersihkan siap.

Sampai jumpa besok!

Tim NingClean`,
      smsBody: 'Reminder: Booking {orderNumber} besok pukul {serviceTime}. Layanan: {serviceName}.',
    },
    {
      type: 'BOOKING_CANCELLED' as TemplateType,
      name: 'Booking Cancelled',
      subject: '❌ Booking {orderNumber} Dibatalkan',
      body: `Dear {customerName},

Booking Anda telah dibatalkan.

📋 Order Number: {orderNumber}
📌 Alasan: {cancellationReason}

Jika Anda merasa ada kesalahan, silakan hubungi kami.

Terima kasih,
Tim NingClean`,
      smsBody: 'Booking {orderNumber} telah dibatalkan.',
    },
    {
      type: 'CUSTOMER_WELCOME' as TemplateType,
      name: 'Welcome Email',
      subject: 'Selamat Datang di NingClean! 🎉',
      body: `Dear {customerName},

Selamat datang di NingClean!

Kami sangat senang bisa melayani Anda. Berikut yang bisa Anda lakukan:

✨ Book layanan kapan saja
📍 Lacak status booking
💬 Chat dengan tim kami

Kode referral Anda: {referralCode}
Dapatkan diskon 10% untuk booking pertama Anda!

Salam,
Tim NingClean`,
      smsBody: 'Selamat datang di NingClean! Gunakan kode {referralCode} untuk diskon 10%.',
    },
  ];

  async findAll() {
    let templates = await this.prisma.emailTemplate.findMany({
      orderBy: { type: 'asc' },
    });

    // Create defaults if none exist
    if (templates.length === 0) {
      for (const template of this.defaultTemplates) {
        await this.prisma.emailTemplate.create({ data: template });
      }
      templates = await this.prisma.emailTemplate.findMany({
        orderBy: { type: 'asc' },
      });
    }

    return templates;
  }

  async findByType(type: string) {
    let template = await this.prisma.emailTemplate.findUnique({
      where: { type: type as TemplateType },
    });

    // Create default if not exists
    if (!template) {
      const defaultTemplate = this.defaultTemplates.find(t => t.type === type);
      if (defaultTemplate) {
        template = await this.prisma.emailTemplate.create({
          data: defaultTemplate,
        });
      }
    }

    return template;
  }

  async update(id: string, data: { subject?: string; body?: string; smsBody?: string; isActive?: boolean }) {
    return this.prisma.emailTemplate.update({
      where: { id },
      data,
    });
  }

  // Replace variables in template
  replaceVariables(template: string, variables: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
    return result;
  }
}
