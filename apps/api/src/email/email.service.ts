import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private prisma: PrismaService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, htmlContent: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: `"NingClean" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: htmlContent,
      });
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  async sendBulkEmails(
    recipients: { email: string }[],
    subject: string,
    htmlContent: string,
  ): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    for (const recipient of recipients) {
      try {
        await this.transporter.sendMail({
          from: `"NingClean" <${process.env.EMAIL_USER}>`,
          to: recipient.email,
          subject,
          html: htmlContent,
        });
        sent++;
        // Delay to avoid Gmail rate limit
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to send to ${recipient.email}:`, error);
        failed++;
      }
    }

    return { sent, failed };
  }
}
