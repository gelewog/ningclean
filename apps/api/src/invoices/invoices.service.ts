import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async findTemplate() {
    let template = await this.prisma.invoiceTemplate.findFirst({
      where: { isDefault: true },
    });

    // Create default if not exists
    if (!template) {
      template = await this.prisma.invoiceTemplate.create({
        data: {
          name: 'Default',
          headerText: 'INVOICE',
          companyName: 'NingClean',
          companyAddress: 'Jakarta, Indonesia',
          companyPhone: '+62 812-3456-7890',
          companyEmail: 'info@ningclean.com',
          taxRate: 0,
          isDefault: true,
        },
      });
    }

    return template;
  }

  async updateTemplate(id: string, data: any) {
    return this.prisma.invoiceTemplate.update({
      where: { id },
      data,
    });
  }

  async generateInvoiceData(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        items: {
          include: {
            service: true,
          },
        },
      },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    const template = await this.findTemplate();

    // Calculate totals
    const subtotal = booking.items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );
    const taxAmount = subtotal * (Number(template.taxRate) / 100);
    const total = subtotal + taxAmount;

    // Format date
    const invoiceDate = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const serviceDate = new Date(booking.serviceDate).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    return {
      template,
      booking: {
        ...booking,
        serviceDateFormatted: serviceDate,
      },
      invoice: {
        number: `INV-${booking.orderNumber}`,
        date: invoiceDate,
        customerName: booking.customer?.name || 'Guest',
        customerEmail: booking.customer?.email || '',
        customerPhone: booking.customer?.phone || '',
      },
      items: booking.items.map((item) => ({
        name: item.service.name,
        description: item.service.description,
        quantity: item.quantity,
        price: Number(item.price),
        total: Number(item.price) * item.quantity,
      })),
      summary: {
        subtotal,
        taxRate: Number(template.taxRate),
        taxAmount,
        total,
      },
      status: booking.status,
    };
  }

  async getBookingInvoicePdf(bookingId: string) {
    const data = await this.generateInvoiceData(bookingId);
    
    // Return data for PDF generation (can be used with jspdf/client-side PDF)
    return data;
  }
}
