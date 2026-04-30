import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, BookingStatus } from '../common';

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
    const users = await this.prisma.user.findMany({
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

    // Return in paginated format to match frontend expectation
    return {
      data: users,
      total: users.length,
      page: 1,
      limit: users.length,
      totalPages: 1,
    };
  }

  async updateUser(id: string, data: { name?: string; email?: string; phone?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // Analytics data for dashboard charts
  async getAnalytics() {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const twelveMonthsAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

      // Initialize empty arrays as fallback
      let monthlyRevenue: any[] = [];
      let dailyBookings: any[] = [];
      let servicePopularity: any[] = [];
      let statusBreakdown: any[] = [];
      let customerGrowth: any[] = [];
      let topCustomers: any[] = [];

      // Try-catch each query independently
      try {
        // Monthly revenue for last 12 months
        const monthlyRevenueRaw = await this.prisma.$queryRawUnsafe<
          { month: string; revenue: number; bookings: number }[]
        >(`
          SELECT 
            DATE_TRUNC('month', "createdAt")::text as month,
            COALESCE(SUM("totalAmount"), 0)::float as revenue,
            COUNT(*)::int as bookings
          FROM "bookings"
          WHERE "status" = 'COMPLETED'
            AND "createdAt" >= '${twelveMonthsAgo.toISOString()}'
          GROUP BY DATE_TRUNC('month', "createdAt")
          ORDER BY month ASC
        `);
        monthlyRevenue = monthlyRevenueRaw.map((r) => ({
          month: r.month,
          revenue: Number(r.revenue),
          bookings: Number(r.bookings)
        }));
      } catch (e) {
        console.error('Monthly revenue query failed:', e);
      }

      try {
        // Daily bookings for last 30 days
        const dailyBookingsRaw = await this.prisma.$queryRawUnsafe<
          { date: string; bookings: number; revenue: number }[]
        >(`
          SELECT 
            DATE("createdAt")::text as date,
            COUNT(*)::int as bookings,
            COALESCE(SUM("totalAmount"), 0)::float as revenue
          FROM "bookings"
          WHERE "createdAt" >= '${thirtyDaysAgo.toISOString()}'
          GROUP BY DATE("createdAt")
          ORDER BY date ASC
        `);
        dailyBookings = dailyBookingsRaw.map((r) => ({
          date: r.date,
          bookings: Number(r.bookings),
          revenue: Number(r.revenue)
        }));
      } catch (e) {
        console.error('Daily bookings query failed:', e);
      }

      try {
        // Service popularity using Prisma API
        const servicePopularityResult = await this.prisma.bookingItem.groupBy({
          by: ['serviceId'],
          _count: { serviceId: true },
          orderBy: { _count: { serviceId: 'desc' } },
          take: 5,
        });

        // Get service names
        servicePopularity = await Promise.all(
          servicePopularityResult.map(async (item) => {
            const service = await this.prisma.service.findUnique({
              where: { id: item.serviceId },
              select: { name: true },
            });
            return {
              serviceId: item.serviceId,
              serviceName: service?.name || 'Unknown Service',
              count: item._count.serviceId || 0,
            };
          })
        );
      } catch (e) {
        console.error('Service popularity query failed:', e);
      }

      try {
        // Booking status breakdown
        const statusResult = await this.prisma.booking.groupBy({
          by: ['status'],
          _count: { status: true },
        });
        statusBreakdown = statusResult.map((sb) => ({
          status: sb.status,
          count: sb._count.status,
        }));
      } catch (e) {
        console.error('Status breakdown query failed:', e);
      }

      try {
        // Customer growth (new customers per month)
        const customerGrowthRaw = await this.prisma.$queryRawUnsafe<
          { month: string; newCustomers: number }[]
        >(`
          SELECT 
            DATE_TRUNC('month', "createdAt")::text as month,
            COUNT(*)::int as "newCustomers"
          FROM "customers"
          WHERE "createdAt" >= '${twelveMonthsAgo.toISOString()}'
          GROUP BY DATE_TRUNC('month', "createdAt")
          ORDER BY month ASC
        `);
        customerGrowth = customerGrowthRaw.map((r) => ({
          month: r.month,
          newCustomers: Number(r.newCustomers)
        }));
      } catch (e) {
        console.error('Customer growth query failed:', e);
      }

      try {
        // Top customers by spending
        const topCustomersResult = await this.prisma.booking.groupBy({
          by: ['customerId'],
          _sum: { totalAmount: true },
          where: { customerId: { not: null } },
          orderBy: { _sum: { totalAmount: 'desc' } },
          take: 5,
        });

        topCustomers = await Promise.all(
          topCustomersResult.map(async (tc) => {
            const customer = await this.prisma.customer.findUnique({
              where: { id: tc.customerId },
              select: { name: true, email: true },
            });
            return {
              customerId: tc.customerId,
              name: customer?.name || 'Unknown',
              email: customer?.email || '',
              totalSpent: tc._sum.totalAmount ? Number(tc._sum.totalAmount) : 0,
            };
          })
        );
      } catch (e) {
        console.error('Top customers query failed:', e);
      }

      return {
        monthlyRevenue,
        dailyBookings,
        servicePopularity,
        statusBreakdown,
        customerGrowth,
        topCustomers,
      };
    } catch (error) {
      console.error('Analytics error:', error);
      throw error;
    }
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
