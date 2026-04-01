import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, BookingStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalUsers,
      totalCustomers,
      totalServices,
      totalBookings,
      totalRevenue,
      completedBookings,
      pendingBookings,
      activeServices,
      recentBookings,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: Role.CUSTOMER } }),
      this.prisma.service.count(),
      this.prisma.booking.count(),
      this.prisma.booking.aggregate({
        _sum: { totalAmount: true },
        where: { status: BookingStatus.COMPLETED },
      }),
      this.prisma.booking.count({ where: { status: BookingStatus.COMPLETED } }),
      this.prisma.booking.count({
        where: { status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS] } },
      }),
      this.prisma.service.count({ where: { isActive: true } }),
      this.prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { name: true, email: true } },
          items: { include: { service: { select: { name: true } } } },
        },
      }),
    ]);

    return {
      users: {
        total: totalUsers,
        customers: totalCustomers,
      },
      services: {
        total: totalServices,
        active: activeServices,
      },
      bookings: {
        total: totalBookings,
        completed: completedBookings,
        pending: pendingBookings,
      },
      revenue: {
        total: totalRevenue._sum.totalAmount || 0,
        currency: 'IDR',
      },
      recentBookings,
    };
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
