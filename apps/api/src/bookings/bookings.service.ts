import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/booking.dto';
import { Prisma, Role, BookingStatus, User, PrismaClient } from '@prisma/client';
import { NotificationsService, BookingNotificationData } from '../notifications/notifications.service';

interface FindAllQuery {
  page?: number;
  limit?: number;
  status?: string;
  area?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async findAll(user: User, query: FindAllQuery = {}) {
    const { page = 1, limit = 10, status, area, search, dateFrom, dateTo } = query;

    // Build where clause
    const where: Prisma.BookingWhereInput = {};

    // Non-admin users only see their own bookings
    if (user.role !== Role.ADMIN) {
      where.customerId = user.id;
    }

    // Filter by status (convert lowercase to uppercase enum)
    if (status) {
      const statusEnum = this.mapStatusToEnum(status);
      if (statusEnum) {
        where.status = statusEnum;
      }
    }

    // Filter by area
    if (area) {
      where.area = area;
    }

    // Filter by date range
    if (dateFrom || dateTo) {
      where.serviceDate = {};
      if (dateFrom) {
        where.serviceDate.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.serviceDate.lte = new Date(dateTo);
      }
    }

    // Search by customer name or email
    if (search) {
      where.customer = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    // Get total count for pagination
    const total = await this.prisma.booking.count({ where });

    // Get paginated results
    const skip = (page - 1) * limit;
    const bookings = await this.prisma.booking.findMany({
      where,
      include: {
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
        items: {
          include: {
            service: {
              select: { id: true, name: true, slug: true, icon: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    return {
      data: bookings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private mapStatusToEnum(status: string): BookingStatus | null {
    const statusMap: Record<string, BookingStatus> = {
      pending: BookingStatus.PENDING,
      confirmed: BookingStatus.CONFIRMED,
      in_progress: BookingStatus.IN_PROGRESS,
      completed: BookingStatus.COMPLETED,
      cancelled: BookingStatus.CANCELLED,
    };
    return statusMap[status.toLowerCase()] || null;
  }

  async findOne(id: string, user: User) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
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

    if (user.role !== Role.ADMIN && booking.customerId !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    return booking;
  }

  async create(dto: CreateBookingDto, user: User) {
    const serviceIds = dto.items.map((item) => item.serviceId);
    const services = await this.prisma.service.findMany({
      where: { id: { in: serviceIds } },
    });

    if (services.length !== serviceIds.length) {
      throw new NotFoundException('One or more services not found');
    }

    const serviceMap = new Map(services.map((s) => [s.id, s]));

    const itemsData = dto.items.map((item) => {
      const service = serviceMap.get(item.serviceId);
      return {
        serviceId: item.serviceId,
        quantity: item.quantity,
        price: service.price,
      };
    });

    const totalAmount = itemsData.reduce((sum, item) => {
      return sum + Number(item.price) * item.quantity;
    }, 0);

    const lastBooking = await this.prisma.booking.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    let nextNumber = 1;
    if (lastBooking) {
      const lastNum = parseInt(lastBooking.orderNumber.split('-')[2]);
      nextNumber = lastNum + 1;
    }
    const orderNumber = `NC-${new Date().getFullYear()}-${nextNumber.toString().padStart(4, '0')}`;

    // Create booking first
    const booking = await this.prisma.booking.create({
      data: {
        orderNumber,
        customerId: user.id,
        serviceDate: new Date(dto.serviceDate),
        serviceTime: dto.serviceTime,
        address: dto.address,
        area: dto.area,
        notes: dto.notes,
        totalAmount,
        status: BookingStatus.PENDING,
        items: {
          create: itemsData,
        },
      },
      include: {
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
        items: {
          include: {
            service: true,
          },
        },
      },
    });

    // Send notifications asynchronously (don't block the response)
    this.sendBookingNotifications(booking, dto.serviceDate, dto.serviceTime, dto.address).catch(err => {
      console.error('Failed to send booking notifications:', err);
    });

    return booking;
  }

  async createPublic(dto: CreateBookingDto) {
    const serviceIds = dto.items.map((item) => item.serviceId);
    const services = await this.prisma.service.findMany({
      where: { id: { in: serviceIds } },
    });

    if (services.length !== serviceIds.length) {
      throw new NotFoundException('One or more services not found');
    }

    const serviceMap = new Map(services.map((s) => [s.id, s]));

    const itemsData = dto.items.map((item) => {
      const service = serviceMap.get(item.serviceId);
      return {
        serviceId: item.serviceId,
        quantity: item.quantity,
        price: service.price,
      };
    });

    const totalAmount = itemsData.reduce((sum, item) => {
      return sum + Number(item.price) * item.quantity;
    }, 0);

    const lastBooking = await this.prisma.booking.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    let nextNumber = 1;
    if (lastBooking) {
      const lastNum = parseInt(lastBooking.orderNumber.split('-')[2]);
      nextNumber = lastNum + 1;
    }
    const orderNumber = `NC-${new Date().getFullYear()}-${nextNumber.toString().padStart(4, '0')}`;

    // Auto-create or find customer
    let customerId: string;
    const email = dto.customerEmail?.toLowerCase().trim();
    const phone = dto.customerPhone?.trim();
    const name = dto.customerName?.trim() || 'Guest';

    // Build address object for customer
    const newAddress = {
      label: 'Alamat Booking',
      address: dto.address || '',
      city: '',
      phone: phone || '',
    };

    if (email) {
      // Check if customer already exists
      let customer = await this.prisma.customer.findFirst({
        where: { email: email },
      });

      if (!customer) {
        // Check if there's a registered user with this email
        const existingUser = await this.prisma.user.findUnique({
          where: { email: email },
        });

        if (existingUser) {
          // Create customer linked to user with address
          customer = await this.prisma.customer.create({
            data: {
              name: name,
              email: email,
              phone: phone || existingUser.phone,
              source: 'registered',
              userId: existingUser.id,
              addresses: [newAddress], // Prisma handles Json type automatically
            },
          });
        } else {
          // Create guest customer with address
          customer = await this.prisma.customer.create({
            data: {
              name: name,
              email: email,
              phone: phone,
              source: 'guest',
              addresses: [newAddress], // Prisma handles Json type automatically
            },
          });
        }
      } else {
        // Customer exists - add new address if not duplicate
        let existingAddresses: any[] = [];
        if (typeof customer.addresses === 'string') {
          try {
            existingAddresses = JSON.parse(customer.addresses) || [];
          } catch {
            existingAddresses = [];
          }
        } else if (Array.isArray(customer.addresses)) {
          existingAddresses = customer.addresses;
        }

        // Check if address already exists (prevent duplicates)
        const addressExists = existingAddresses.some(
          (addr: any) => addr.address === newAddress.address
        );

        if (!addressExists && newAddress.address) {
          existingAddresses.push(newAddress);
          await this.prisma.customer.update({
            where: { id: customer.id },
            data: { addresses: existingAddresses }, // Prisma handles Json type
          });
        }
      }

      customerId = customer.id;
    } else {
      // Create anonymous customer for bookings without email with address
      const anonymousCustomer = await this.prisma.customer.create({
        data: {
          name: name,
          email: `guest-${Date.now()}@temp.local`,
          phone: phone,
          source: 'guest',
          addresses: [newAddress], // Prisma handles Json type automatically
        },
      });
      customerId = anonymousCustomer.id;
    }

    // Create booking with customer
    const booking = await this.prisma.booking.create({
      data: {
        orderNumber,
        customerId: customerId,
        serviceDate: new Date(dto.serviceDate),
        serviceTime: dto.serviceTime,
        address: dto.address,
        area: dto.area,
        notes: dto.notes,
        totalAmount,
        status: BookingStatus.PENDING,
        items: {
          create: itemsData,
        },
      },
      include: {
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
        items: {
          include: {
            service: true,
          },
        },
      },
    });

    // Send notifications asynchronously (don't block the response)
    this.sendBookingNotifications(booking, dto.serviceDate, dto.serviceTime, dto.address).catch(err => {
      console.error('Failed to send booking notifications:', err);
    });

    return booking;
  }

  private async sendBookingNotifications(
    booking: any,
    serviceDate: string,
    serviceTime: string,
    address: string,
  ) {
    try {
      // Format date for display
      const dateObj = new Date(serviceDate);
      const formattedDate = dateObj.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // Format price
      const totalAmount = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(Number(booking.totalAmount));

      // Get service names
      const serviceNames = booking.items.map((item: any) => item.service.name).join(', ');

      // Handle both registered users and guest bookings
      const customerName = booking.customer?.name || booking.guestName || 'Guest';
      const customerEmail = booking.customer?.email || booking.guestEmail || '';
      const customerPhone = booking.customer?.phone || booking.guestPhone || '';

      const notificationData: BookingNotificationData = {
        orderNumber: booking.orderNumber,
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
        serviceName: serviceNames,
        serviceDate: formattedDate,
        serviceTime: serviceTime,
        address: address,
        totalAmount: totalAmount,
      };

      // Create database notification (NEW!)
      await this.notificationsService.createNotification({
        type: 'BOOKING_NEW',
        title: 'Booking Baru!',
        message: `Order ${booking.orderNumber} dari ${customerName} - ${serviceNames}`,
        metadata: {
          bookingId: booking.id,
          orderNumber: booking.orderNumber,
          customerName,
          customerPhone,
          serviceName: serviceNames,
          totalAmount: booking.totalAmount,
          serviceDate: formattedDate,
          serviceTime: serviceTime,
          address,
        },
      });

      // Send notifications (WhatsApp, Email)
      const result = await this.notificationsService.notifyNewBooking(notificationData);
      console.log('Booking notifications sent:', result);
    } catch (error) {
      console.error('Error sending booking notifications:', error);
    }
  }

  async updateStatus(id: string, status: BookingStatus) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
        items: {
          include: {
            service: true,
          },
        },
      },
    });
  }
}
