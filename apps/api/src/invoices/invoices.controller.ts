import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get('template')
  async getTemplate() {
    return this.invoicesService.findTemplate();
  }

  @Put('template/:id')
  @UseGuards(JwtAuthGuard)
  async updateTemplate(@Param('id') id: string, @Body() data: any) {
    return this.invoicesService.updateTemplate(id, data);
  }

  @Get('booking/:bookingId')
  @UseGuards(JwtAuthGuard)
  async getBookingInvoice(@Param('bookingId') bookingId: string) {
    return this.invoicesService.generateInvoiceData(bookingId);
  }
}
