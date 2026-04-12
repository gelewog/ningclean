-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('BOOKING_NEW', 'BOOKING_STATUS', 'SYSTEM');

-- CreateEnum
CREATE TYPE "TemplateType" AS ENUM ('BOOKING_CONFIRMED', 'BOOKING_STATUS_UPDATED', 'BOOKING_REMINDER', 'BOOKING_CANCELLED', 'CUSTOMER_WELCOME');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'STAFF';

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_customerId_fkey";

-- AlterTable
ALTER TABLE "blog_posts" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "guestEmail" TEXT,
ADD COLUMN     "guestName" TEXT,
ADD COLUMN     "guestPhone" TEXT,
ADD COLUMN     "internalNotes" TEXT,
ALTER COLUMN "customerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'ADMIN';

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "isVip" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "addresses" JSONB NOT NULL DEFAULT '[]',
    "source" TEXT NOT NULL DEFAULT 'guest',
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_settings" (
    "id" TEXT NOT NULL,
    "whatsappNumber" TEXT,
    "whatsappMessage" TEXT,
    "whatsappEnabled" BOOLEAN NOT NULL DEFAULT false,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT false,
    "emailHost" TEXT,
    "emailPort" INTEGER,
    "emailUser" TEXT,
    "emailPassword" TEXT,
    "emailFrom" TEXT,
    "adminEmail" TEXT,
    "twilioaccountsid" TEXT,
    "twilioauthtoken" TEXT,
    "twiliofromnumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'BOOKING_NEW',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL DEFAULT 'NingClean',
    "tagline" TEXT,
    "description" TEXT,
    "logo" TEXT,
    "favicon" TEXT,
    "logoDark" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "address" TEXT,
    "city" TEXT,
    "province" TEXT,
    "postalCode" TEXT,
    "googleMapsUrl" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "twitter" TEXT,
    "youtube" TEXT,
    "linkedin" TEXT,
    "tiktok" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "ogImage" TEXT,
    "keywords" TEXT,
    "footerText" TEXT,
    "copyrightText" TEXT,
    "mondayOpen" TEXT NOT NULL DEFAULT '08:00',
    "mondayClose" TEXT NOT NULL DEFAULT '18:00',
    "tuesdayOpen" TEXT NOT NULL DEFAULT '08:00',
    "tuesdayClose" TEXT NOT NULL DEFAULT '18:00',
    "wednesdayOpen" TEXT NOT NULL DEFAULT '08:00',
    "wednesdayClose" TEXT NOT NULL DEFAULT '18:00',
    "thursdayOpen" TEXT NOT NULL DEFAULT '08:00',
    "thursdayClose" TEXT NOT NULL DEFAULT '18:00',
    "fridayOpen" TEXT NOT NULL DEFAULT '08:00',
    "fridayClose" TEXT NOT NULL DEFAULT '18:00',
    "saturdayOpen" TEXT NOT NULL DEFAULT '09:00',
    "saturdayClose" TEXT NOT NULL DEFAULT '17:00',
    "sundayOpen" TEXT NOT NULL DEFAULT '09:00',
    "sundayClose" TEXT NOT NULL DEFAULT '15:00',
    "is24Hours" BOOLEAN NOT NULL DEFAULT false,
    "minAdvanceDays" INTEGER NOT NULL DEFAULT 1,
    "maxAdvanceDays" INTEGER NOT NULL DEFAULT 30,
    "cancellationHours" INTEGER NOT NULL DEFAULT 24,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "navigation_settings" (
    "id" TEXT NOT NULL,
    "navLinks" JSONB NOT NULL DEFAULT '[]',
    "showServicesDropdown" BOOLEAN NOT NULL DEFAULT true,
    "servicesDropdownLabel" TEXT NOT NULL DEFAULT 'Layanan',
    "ctaButtonText" TEXT NOT NULL DEFAULT 'Booking',
    "ctaButtonLink" TEXT NOT NULL DEFAULT '/booking',
    "showCtaButton" BOOLEAN NOT NULL DEFAULT true,
    "mobileMenuType" TEXT NOT NULL DEFAULT 'slide',
    "activeIndicatorStyle" TEXT NOT NULL DEFAULT 'dot',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "navigation_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homepage_settings" (
    "id" TEXT NOT NULL,
    "heroHeadline" TEXT NOT NULL DEFAULT 'Transformasi Rumah Anda',
    "heroSubheadline" TEXT NOT NULL DEFAULT 'Layanan kebersihan profesional dengan tim tersertifikasi. Hasil nyata yang bisa kamu lihat langsung.',
    "heroImage" TEXT,
    "heroBadge" TEXT NOT NULL DEFAULT 'Dipercaya 1250+ Pelanggan',
    "ctaPrimaryText" TEXT NOT NULL DEFAULT 'Booking Sekarang',
    "ctaPrimaryLink" TEXT NOT NULL DEFAULT '/booking',
    "ctaSecondaryText" TEXT NOT NULL DEFAULT 'Lihat Layanan & Paket',
    "ctaSecondaryLink" TEXT NOT NULL DEFAULT '/services',
    "statsHomesCleaned" TEXT NOT NULL DEFAULT '1250+',
    "statsRating" TEXT NOT NULL DEFAULT '4.95',
    "statsSatisfaction" TEXT NOT NULL DEFAULT '99%',
    "statsResponseTime" TEXT NOT NULL DEFAULT '< 30m',
    "showFeaturesSection" BOOLEAN NOT NULL DEFAULT true,
    "showServicesSection" BOOLEAN NOT NULL DEFAULT true,
    "showTestimonialsSection" BOOLEAN NOT NULL DEFAULT true,
    "showAreasSection" BOOLEAN NOT NULL DEFAULT true,
    "showBlogSection" BOOLEAN NOT NULL DEFAULT true,
    "showImageShowcase" BOOLEAN NOT NULL DEFAULT true,
    "showCTASection" BOOLEAN NOT NULL DEFAULT true,
    "featuredServiceIds" JSONB NOT NULL DEFAULT '[]',
    "beforeAfterSlides" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "footer_settings" (
    "id" TEXT NOT NULL,
    "footerColumns" JSONB NOT NULL DEFAULT '[]',
    "showContact" BOOLEAN NOT NULL DEFAULT true,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "contactWhatsapp" TEXT,
    "contactAddress" TEXT,
    "showSocials" BOOLEAN NOT NULL DEFAULT true,
    "socialLinks" JSONB NOT NULL DEFAULT '[]',
    "showNewsletter" BOOLEAN NOT NULL DEFAULT true,
    "newsletterTitle" TEXT NOT NULL DEFAULT 'Dapat tips bersih setiap minggu',
    "newsletterSubtitle" TEXT DEFAULT 'Promo eksklusif dan info layanan baru langsung ke inbox kamu.',
    "showStatusBadge" BOOLEAN NOT NULL DEFAULT true,
    "statusBadgeText" TEXT NOT NULL DEFAULT 'Semua layanan aktif',
    "copyrightText" TEXT NOT NULL DEFAULT 'All rights reserved.',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "footer_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_templates" (
    "id" TEXT NOT NULL,
    "type" "TemplateType" NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "smsBody" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Default',
    "headerText" TEXT NOT NULL DEFAULT 'INVOICE',
    "companyName" TEXT NOT NULL DEFAULT 'NingClean',
    "companyAddress" TEXT,
    "companyPhone" TEXT,
    "companyEmail" TEXT,
    "companyLogo" TEXT,
    "footerText" TEXT,
    "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "userId" TEXT,
    "userEmail" TEXT,
    "changes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_userId_key" ON "customers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "blog_categories_name_key" ON "blog_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "blog_categories_slug_key" ON "blog_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "email_templates_type_key" ON "email_templates"("type");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "blog_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
