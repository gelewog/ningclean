import { Controller, Get, Put, Body, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { RolesGuard, Roles } from '../common';
import { Role, BookingStatus } from '../common';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  async getStats() {
    try {
      return await this.adminService.getStats();
    } catch (error) {
      console.error('Stats error:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch stats',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('customers')
  @ApiOperation({ summary: 'Get all customers (from customer table)' })
  async getAllCustomers() {
    try {
      return await this.adminService.getAllCustomers();
    } catch (error) {
      console.error('Customers error:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch customers',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('customers/:id')
  @ApiOperation({ summary: 'Update customer (VIP, notes, addresses)' })
  async updateCustomer(@Param('id') id: string, @Body() data: { isVip?: boolean; notes?: string; addresses?: any }) {
    try {
      return await this.adminService.updateCustomer(id, data);
    } catch (error) {
      console.error('Update customer error:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to update customer',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users (admin/staff accounts)' })
  async getAllUsers() {
    try {
      return await this.adminService.getAllUsers();
    } catch (error) {
      console.error('Users error:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch users',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('users/:id')
  @ApiOperation({ summary: 'Update user (name, email, phone)' })
  async updateUser(@Param('id') id: string, @Body() data: { name?: string; email?: string; phone?: string }) {
    try {
      return await this.adminService.updateUser(id, data);
    } catch (error) {
      console.error('Update user error:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to update user',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get analytics data for dashboard charts' })
  async getAnalytics() {
    try {
      const result = await this.adminService.getAnalytics();
      // Return flat structure (backward compatible with existing frontend)
      return result;
    } catch (error) {
      console.error('Analytics error:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch analytics',
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('analytics-debug')
  @ApiOperation({ summary: 'Test analytics endpoint without auth' })
  async getAnalyticsDebug() {
    try {
      // Simple test query first
      const bookingCount = await this.adminService['prisma'].booking.count();
      const customerCount = await this.adminService['prisma'].customer.count();
      
      return {
        success: true,
        message: 'Database connection successful',
        counts: {
          bookings: bookingCount,
          customers: customerCount,
        },
      };
    } catch (error) {
      console.error('Analytics debug error:', error);
      return {
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      };
    }
  }

  @Put('bookings/:id')
  @ApiOperation({ summary: 'Update booking (status, internal notes)' })
  async updateBooking(@Param('id') id: string, @Body() data: { status?: string; internalNotes?: string }) {
    try {
      const validStatuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;
      const updateData: { status?: BookingStatus; internalNotes?: string } = {};
      if (data.status && validStatuses.includes(data.status as BookingStatus)) {
        updateData.status = data.status as BookingStatus;
      }
      if (data.internalNotes !== undefined) {
        updateData.internalNotes = data.internalNotes;
      }
      return await this.adminService.updateBooking(id, updateData);
    } catch (error) {
      console.error('Update booking error:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to update booking',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('bookings/bulk-status')
  @ApiOperation({ summary: 'Bulk update booking status' })
  async bulkUpdateStatus(@Body() body: { ids: string[]; status: string }) {
    try {
      const validStatuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;
      const status = validStatuses.includes(body.status as BookingStatus)
        ? body.status as BookingStatus
        : 'PENDING' as BookingStatus;
      return await this.adminService.bulkUpdateBookingStatus(body.ids, status);
    } catch (error) {
      console.error('Bulk update error:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to bulk update bookings',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get audit logs' })
  async getAuditLogs() {
    try {
      return await this.adminService.getAuditLogs();
    } catch (error) {
      console.error('Audit logs error:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch audit logs',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
