import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { RolesGuard, Roles } from '../common';
import { Role, BookingStatus } from '@prisma/client';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  getStats() {
    return this.adminService.getStats();
  }

  @Get('customers')
  @ApiOperation({ summary: 'Get all customers (from customer table)' })
  getAllCustomers() {
    return this.adminService.getAllCustomers();
  }

  @Put('customers/:id')
  @ApiOperation({ summary: 'Update customer (VIP, notes, addresses)' })
  updateCustomer(@Param('id') id: string, @Body() data: { isVip?: boolean; notes?: string; addresses?: any }) {
    return this.adminService.updateCustomer(id, data);
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users (admin/staff accounts)' })
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Put('users/:id')
  @ApiOperation({ summary: 'Update user (name, email, phone)' })
  updateUser(@Param('id') id: string, @Body() data: { name?: string; email?: string; phone?: string }) {
    return this.adminService.updateUser(id, data);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get analytics data for dashboard charts' })
  getAnalytics() {
    return this.adminService.getAnalytics();
  }

  @Put('bookings/:id')
  @ApiOperation({ summary: 'Update booking (status, internal notes)' })
  updateBooking(@Param('id') id: string, @Body() data: { status?: string; internalNotes?: string }) {
    const validStatuses: BookingStatus[] = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    const updateData: { status?: BookingStatus; internalNotes?: string } = {};
    if (data.status && validStatuses.includes(data.status as BookingStatus)) {
      updateData.status = data.status as BookingStatus;
    }
    if (data.internalNotes !== undefined) {
      updateData.internalNotes = data.internalNotes;
    }
    return this.adminService.updateBooking(id, updateData);
  }

  @Put('bookings/bulk-status')
  @ApiOperation({ summary: 'Bulk update booking status' })
  bulkUpdateStatus(@Body() body: { ids: string[]; status: string }) {
    // Validate status is a valid BookingStatus
    const validStatuses: BookingStatus[] = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    const status = validStatuses.includes(body.status as BookingStatus) 
      ? body.status as BookingStatus 
      : 'PENDING';
    return this.adminService.bulkUpdateBookingStatus(body.ids, status);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get audit logs' })
  getAuditLogs() {
    return this.adminService.getAuditLogs();
  }
}
