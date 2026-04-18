import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';
import { BlogModule } from './blog/blog.module';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { TeamMembersModule } from './team-members/team-members.module';
import { CompanyStatsModule } from './company-stats/company-stats.module';
import { GalleryModule } from './gallery/gallery.module';
import { FaqModule } from './faq/faq.module';
import { ServiceAreasModule } from './service-areas/service-areas.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { PricingPlansModule } from './pricing-plans/pricing-plans.module';
import { JobListingsModule } from './job-listings/job-listings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';
import { NavigationSettingsModule } from './navigation-settings/navigation-settings.module';
import { HomepageSettingsModule } from './homepage-settings/homepage-settings.module';
import { FooterSettingsModule } from './footer-settings/footer-settings.module';
import { BlogCategoriesModule } from './blog-categories/blog-categories.module';
import { EmailTemplatesModule } from './email-templates/email-templates.module';
import { InvoicesModule } from './invoices/invoices.module';
import { UploadModule } from './upload/upload.module';
import { DraftPreviewModule } from './draft-preview/draft-preview.module';
import { FileManagerModule } from './file-manager/file-manager.module';
import { AuditModule } from './audit/audit.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ServicesModule,
    BookingsModule,
    BlogModule,
    AdminModule,
    TeamMembersModule,
    CompanyStatsModule,
    GalleryModule,
    FaqModule,
    ServiceAreasModule,
    TestimonialsModule,
    PricingPlansModule,
    JobListingsModule,
    NotificationsModule,
    SiteSettingsModule,
    NavigationSettingsModule,
    HomepageSettingsModule,
    FooterSettingsModule,
    BlogCategoriesModule,
    EmailTemplatesModule,
    InvoicesModule,
    UploadModule,
    DraftPreviewModule,
    FileManagerModule,
    AuditModule,
    NewsletterModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
