import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InvoiceStatus, BookingStatus } from '../common/enums';

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

  // Generate unique invoice number
  private generateInvoiceNumber(bookingOrderNumber: string): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    return `INV-${bookingOrderNumber}-${timestamp}`;
  }

  // Create invoice from booking
  async createInvoiceFromBooking(bookingId: string, templateId?: string, dueDate?: Date) {
    // Check if invoice already exists for this booking
    const existingInvoice = await this.prisma.invoice.findUnique({
      where: { bookingId },
    });

    if (existingInvoice) {
      throw new BadRequestException('Invoice already exists for this booking');
    }

    // Get booking with all details
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        items: {
          include: {
            service: true,
          },
        },
        invoice: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Allow invoice creation for all booking statuses (PENDING, CONFIRMED, IN_PROGRESS, COMPLETED)
    // Invoice status (DRAFT, ISSUED, PAID) is separate from booking status

    // Get template
    let template;
    if (templateId) {
      template = await this.prisma.invoiceTemplate.findUnique({
        where: { id: templateId },
      });
    }
    if (!template) {
      template = await this.findTemplate();
    }

    // Calculate totals
    const subtotal = booking.items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );
    const taxRate = Number(template.taxRate);
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    // Create invoice
    const invoice = await this.prisma.invoice.create({
      data: {
        invoiceNumber: this.generateInvoiceNumber(booking.orderNumber),
        bookingId: booking.id,
        templateId: template.id,
        subtotal,
        taxRate,
        taxAmount,
        total,
        status: InvoiceStatus.DRAFT,
        issuedAt: new Date(),
        dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
      },
    });

    return {
      ...invoice,
      booking,
      template,
    };
  }

  // Get invoice by booking ID
  async getInvoiceByBookingId(bookingId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { bookingId },
      include: {
        booking: {
          include: {
            customer: true,
            items: {
              include: {
                service: true,
              },
            },
          },
        },
        template: true,
      },
    });

    if (!invoice) {
      return null;
    }

    return this.formatInvoiceResponse(invoice);
  }

  // Get all invoices with pagination
  async getAllInvoices(page: number = 1, limit: number = 20, status?: InvoiceStatus) {
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [invoices, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          booking: {
            include: {
              customer: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.invoice.count({ where }),
    ]);

    return {
      data: invoices,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Update invoice status
  async updateInvoiceStatus(bookingId: string, status: InvoiceStatus) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { bookingId },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    const updateData: any = { status };

    // Set paidAt timestamp when status is PAID
    if (status === InvoiceStatus.PAID && !invoice.paidAt) {
      updateData.paidAt = new Date();
    }

    const updated = await this.prisma.invoice.update({
      where: { bookingId },
      data: updateData,
    });

    return updated;
  }

  // Get formatted invoice data (for preview/PDF)
  async generateInvoiceData(bookingId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { bookingId },
      include: {
        booking: {
          include: {
            customer: true,
            items: {
              include: {
                service: true,
              },
            },
          },
        },
        template: true,
      },
    });

    if (!invoice) {
      // Fallback to old method if no invoice record exists
      return this.generateInvoiceDataLegacy(bookingId);
    }

    return this.formatInvoiceResponse(invoice);
  }

  // Format invoice for response
  private formatInvoiceResponse(invoice: any) {
    const { booking, template } = invoice;

    // Format dates
    const invoiceDate = new Date(invoice.issuedAt || invoice.createdAt).toLocaleDateString('id-ID', {
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
      template: {
        ...template,
        headerText: template.headerText || 'INVOICE',
        companyName: template.companyName || 'NingClean',
        companyAddress: template.companyAddress || '',
        companyPhone: template.companyPhone || '',
        companyEmail: template.companyEmail || '',
        footerText: template.footerText || '',
        notes: template.notes || '',
        taxRate: Number(template.taxRate),
      },
      booking: {
        ...booking,
        serviceDateFormatted: serviceDate,
      },
      invoice: {
        id: invoice.id,
        number: invoice.invoiceNumber,
        date: invoiceDate,
        status: invoice.status,
        customerName: booking.customer?.name || 'Guest',
        customerEmail: booking.customer?.email || '',
        customerPhone: booking.customer?.phone || '',
        dueDate: invoice.dueDate,
        paidAt: invoice.paidAt,
      },
      items: booking.items.map((item: any) => ({
        name: item.service.name,
        description: item.service.description,
        quantity: item.quantity,
        price: Number(item.price),
        total: Number(item.price) * item.quantity,
      })),
      summary: {
        subtotal: Number(invoice.subtotal),
        taxRate: Number(invoice.taxRate),
        taxAmount: Number(invoice.taxAmount),
        total: Number(invoice.total),
      },
    };
  }

  // Legacy method for bookings without invoice record
  private async generateInvoiceDataLegacy(bookingId: string) {
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
      throw new NotFoundException('Booking not found');
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
      template: {
        ...template,
        taxRate: Number(template.taxRate),
      },
      booking: {
        ...booking,
        serviceDateFormatted: serviceDate,
      },
      invoice: {
        id: null,
        number: `INV-${booking.orderNumber}`,
        date: invoiceDate,
        status: 'DRAFT',
        customerName: booking.customer?.name || 'Guest',
        customerEmail: booking.customer?.email || '',
        customerPhone: booking.customer?.phone || '',
        dueDate: null,
        paidAt: null,
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
    };
  }

  async getBookingInvoicePdf(bookingId: string) {
    const data = await this.generateInvoiceData(bookingId);
    
    // Return data for PDF generation (can be used with jspdf/client-side PDF)
    return data;
  }
}
