import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/booking.dto';
import { Prisma, Role, BookingStatus, User } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(user: User) {
    if (user.role === Role.ADMIN) {
      return this.prisma.booking.findMany({
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
      });
    }

    return this.prisma.booking.findMany({
      where: { customerId: user.id },
      include: {
        items: {
          include: {
            service: {
              select: { id: true, name: true, slug: true, icon: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
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

    return this.prisma.booking.create({
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
        items: {
          include: {
            service: true,
          },
        },
      },
    });
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
