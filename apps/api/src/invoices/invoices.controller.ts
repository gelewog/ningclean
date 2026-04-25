import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InvoiceStatus } from '../common/enums';

@ApiTags('Invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get('template')
  @ApiOperation({ summary: 'Get default invoice template' })
  async getTemplate() {
    return this.invoicesService.findTemplate();
  }

  @Put('template/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update invoice template (admin only)' })
  async updateTemplate(@Param('id') id: string, @Body() data: any) {
    return this.invoicesService.updateTemplate(id, data);
  }

  // Get all invoices with pagination
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all invoices with pagination (admin only)' })
  async getAllInvoices(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('status') status?: InvoiceStatus,
  ) {
    return this.invoicesService.getAllInvoices(
      parseInt(page),
      parseInt(limit),
      status,
    );
  }

  // Get invoice data for a booking (for preview/PDF) - MUST be before :id route
  @Get('booking/:bookingId/data')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get invoice data for booking (admin only)' })
  async getBookingInvoiceData(@Param('bookingId') bookingId: string) {
    return this.invoicesService.generateInvoiceData(bookingId);
  }

  // Create invoice from booking - MUST be before :id route
  @Post('booking/:bookingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create invoice from booking (admin only)' })
  async createInvoice(
    @Param('bookingId') bookingId: string,
    @Body() body: { templateId?: string; dueDate?: string },
  ) {
    return this.invoicesService.createInvoiceFromBooking(
      bookingId,
      body.templateId,
      body.dueDate ? new Date(body.dueDate) : undefined,
    );
  }

  // Update invoice status - MUST be before :id route
  @Put('booking/:bookingId/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update invoice status (admin only)' })
  async updateInvoiceStatus(
    @Param('bookingId') bookingId: string,
    @Body() body: { status: InvoiceStatus },
  ) {
    return this.invoicesService.updateInvoiceStatus(bookingId, body.status);
  }

  // Legacy endpoint for backward compatibility - MUST be before :id route
  @Get('booking/:bookingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get invoice data for booking (legacy endpoint)' })
  async getBookingInvoice(@Param('bookingId') bookingId: string) {
    return this.invoicesService.generateInvoiceData(bookingId);
  }

  // Get invoice by ID - MUST be last (catch-all)
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get invoice by ID (admin only)' })
  async getInvoiceById(@Param('id') id: string) {
    return this.invoicesService.getInvoiceByBookingId(id);
  }
}
