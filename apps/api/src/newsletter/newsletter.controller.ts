import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NewsletterService } from './newsletter.service';
import { NewsletterScheduler } from './newsletter.scheduler';

@ApiTags('Newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(
    private readonly newsletterService: NewsletterService,
    private readonly newsletterScheduler: NewsletterScheduler,
  ) {}

  @Post('subscribe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Subscribe to newsletter' })
  async subscribe(@Body() body: { email: string }) {
    return this.newsletterService.subscribe(body.email);
  }

  @Post('unsubscribe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unsubscribe from newsletter' })
  async unsubscribe(@Body() body: { email: string }) {
    return this.newsletterService.unsubscribe(body.email);
  }

  @Get('subscribers')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all subscribers (admin)' })
  async getSubscribers() {
    return this.newsletterService.getSubscribers();
  }

  @Post('send-test')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send weekly newsletter now (for testing)' })
  async sendTest() {
    await this.newsletterScheduler.sendWeeklyNewsletterNow();
    return { success: true, message: 'Weekly newsletter sent to all subscribers' };
  }
}
