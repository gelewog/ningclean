import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';
import { CustomersModule } from './customers/customers.module';
import { BlogModule } from './blog/blog.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { TeamMembersModule } from './team-members/team-members.module';
import { GalleryModule } from './gallery/gallery.module';
import { FaqModule } from './faq/faq.module';
import { ServiceAreasModule } from './service-areas/service-areas.module';
import { JobListingsModule } from './job-listings/job-listings.module';
import { PricingPlansModule } from './pricing-plans/pricing-plans.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';
import { NavigationSettingsModule } from './navigation-settings/navigation-settings.module';
import { HomepageSettingsModule } from './homepage-settings/homepage-settings.module';
import { FooterSettingsModule } from './footer-settings/footer-settings.module';
import { BlogCategoriesModule } from './blog-categories/blog-categories.module';
import { UploadModule } from './upload/upload.module';
import { NotificationsModule } from './notifications/notifications.module';
import { InvoicesModule } from './invoices/invoices.module';
import { EmailTemplatesModule } from './email-templates/email-templates.module';
import { AuditModule } from './audit/audit.module';
import { AdminModule } from './admin/admin.module';
import { CompanyStatsModule } from './company-stats/company-stats.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { FileManagerModule } from './file-manager/file-manager.module';
import { DraftPreviewModule } from './draft-preview/draft-preview.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    SupabaseModule,
    AuthModule,
    ServicesModule,
    BookingsModule,
    CustomersModule,
    BlogModule,
    TestimonialsModule,
    TeamMembersModule,
    GalleryModule,
    FaqModule,
    ServiceAreasModule,
    JobListingsModule,
    PricingPlansModule,
    SiteSettingsModule,
    NavigationSettingsModule,
    HomepageSettingsModule,
    FooterSettingsModule,
    BlogCategoriesModule,
    UploadModule,
    NotificationsModule,
    InvoicesModule,
    EmailTemplatesModule,
    AuditModule,
    AdminModule,
    CompanyStatsModule,
    NewsletterModule,
    FileManagerModule,
    DraftPreviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
