import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { EmailTemplatesService } from './email-templates.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('email-templates')
export class EmailTemplatesController {
  constructor(private readonly emailTemplatesService: EmailTemplatesService) {}

  @Get()
  async findAll() {
    return this.emailTemplatesService.findAll();
  }

  @Get(':type')
  async findByType(@Param('type') type: string) {
    return this.emailTemplatesService.findByType(type);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() data: { subject?: string; body?: string; smsBody?: string; isActive?: boolean }) {
    return this.emailTemplatesService.update(id, data);
  }
}
