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
      this.prisma.customer.count(),
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

  async getAllCustomers() {
    return this.prisma.customer.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isVip: true,
        notes: true,
        addresses: true,
        source: true,
        userId: true,
        createdAt: true,
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateCustomer(id: string, data: { isVip?: boolean; notes?: string; addresses?: any }) {
    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  // User management (for admin/staff accounts - all roles)
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
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateUser(id: string, data: { name?: string; email?: string; phone?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // Analytics data for dashboard charts
  async getAnalytics() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twelveMonthsAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    // Monthly revenue for last 12 months
    const monthlyRevenueRaw: any[] = await this.prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt")::text as month,
        COALESCE(SUM("totalAmount"), 0)::float as revenue,
        COUNT(*)::int as bookings
      FROM "bookings"
      WHERE "status" = 'COMPLETED'
        AND "createdAt" >= ${twelveMonthsAgo}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `;
    const monthlyRevenue = monthlyRevenueRaw.map((r: any) => ({
      month: r.month,
      revenue: Number(r.revenue),
      bookings: Number(r.bookings)
    }));

    // Daily bookings for last 30 days
    const dailyBookingsRaw: any[] = await this.prisma.$queryRaw`
      SELECT 
        DATE("createdAt")::text as date,
        COUNT(*)::int as bookings,
        COALESCE(SUM("totalAmount"), 0)::float as revenue
      FROM "bookings"
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;
    const dailyBookings = dailyBookingsRaw.map((r: any) => ({
      date: r.date,
      bookings: Number(r.bookings),
      revenue: Number(r.revenue)
    }));

    // Service popularity
    const servicePopularityRaw: any[] = await this.prisma.$queryRaw`
      SELECT 
        bi."serviceId",
        s.name as "serviceName",
        COUNT(*)::int as count
      FROM booking_items bi
      JOIN services s ON s.id = bi."serviceId"
      GROUP BY bi."serviceId", s.name
      ORDER BY count DESC
      LIMIT 5
    `;
    const servicePopularity = servicePopularityRaw.map((r: any) => ({
      serviceId: r.serviceId,
      serviceName: r.serviceName,
      count: Number(r.count)
    }));

    // Booking status breakdown
    const statusBreakdown = await this.prisma.booking.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    // Customer growth (new customers per month)
    const customerGrowthRaw: any[] = await this.prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt")::text as month,
        COUNT(*)::int as "newCustomers"
      FROM "customers"
      WHERE "createdAt" >= ${twelveMonthsAgo}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `;
    const customerGrowth = customerGrowthRaw.map((r: any) => ({
      month: r.month,
      newCustomers: Number(r.newCustomers)
    }));

    // Top customers by spending (exclude guest bookings with null customerId)
    const topCustomers = await this.prisma.booking.groupBy({
      by: ['customerId'],
      _sum: { totalAmount: true },
      where: { customerId: { not: null } },
      orderBy: { _sum: { totalAmount: 'desc' } },
      take: 5,
    });

    // Get customer details for top customers
    const topCustomersWithDetails = await Promise.all(
      topCustomers.map(async (tc) => {
        const customer = await this.prisma.customer.findUnique({
          where: { id: tc.customerId },
          select: { name: true, email: true },
        });
        return {
          customerId: tc.customerId,
          name: customer?.name || 'Unknown',
          email: customer?.email || '',
          totalSpent: tc._sum.totalAmount || 0,
        };
      })
    );

    return {
      monthlyRevenue,
      dailyBookings,
      servicePopularity: servicePopularity.map((sp) => ({
        serviceId: sp.serviceId,
        serviceName: sp.serviceName,
        count: Number(sp.count),
      })),
      statusBreakdown: statusBreakdown.map((sb) => ({
        status: sb.status,
        count: sb._count.status,
      })),
      customerGrowth,
      topCustomers: topCustomersWithDetails,
    };
  }

  // Booking management - update single booking
  async updateBooking(id: string, data: { status?: BookingStatus; internalNotes?: string }) {
    const updateData: any = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.internalNotes !== undefined) updateData.internalNotes = data.internalNotes;
    
    return this.prisma.booking.update({
      where: { id },
      data: updateData,
    });
  }

  // Booking management - bulk update status
  async bulkUpdateBookingStatus(ids: string[], status: BookingStatus) {
    return this.prisma.booking.updateMany({
      where: { id: { in: ids } },
      data: { status },
    });
  }

  // Audit Logs
  async getAuditLogs(limit = 50) {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async createAuditLog(data: {
    action: string
    entityType: string
    entityId: string
    userId?: string
    userEmail?: string
    changes?: any
  }) {
    return this.prisma.auditLog.create({
      data: {
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        userId: data.userId || null,
        userEmail: data.userEmail || null,
        changes: data.changes || null,
      },
    });
  }
}
