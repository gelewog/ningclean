import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HomepageSettingsService {
  constructor(private prisma: PrismaService) {}

  // Default slides
  private defaultSlides = [
    {
      before: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
      after: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80&sat=-100&brightness=1.15',
      title: 'Deep Cleaning Ruang Tamu',
    },
    {
      before: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
      after: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&sat=-100&brightness=1.15',
      title: 'Pembersihan Dapur',
    },
    {
      before: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
      after: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80&sat=-100&brightness=1.15',
      title: 'Kamar Mandi Kilat',
    },
  ];

  async getHomepageSettings() {
    let settings = await this.prisma.homepageSettings.findFirst();
    
    if (!settings) {
      settings = await this.prisma.homepageSettings.create({
        data: {
          heroHeadline: 'Transformasi Rumah Anda',
          heroSubheadline: 'Layanan kebersihan profesional dengan tim tersertifikasi. Hasil nyata yang bisa kamu lihat langsung.',
          heroBadge: 'Dipercaya 1250+ Pelanggan',
          ctaPrimaryText: 'Booking Sekarang',
          ctaPrimaryLink: '/booking',
          ctaSecondaryText: 'Lihat Layanan & Paket',
          ctaSecondaryLink: '/services',
          statsHomesCleaned: '1250+',
          statsRating: '4.95',
          statsSatisfaction: '99%',
          statsResponseTime: '< 30m',
          showFeaturesSection: true,
          showServicesSection: true,
          showTestimonialsSection: true,
          showAreasSection: true,
          showBlogSection: true,
          showImageShowcase: true,
          showCTASection: true,
          featuredServiceIds: JSON.stringify([]),
          beforeAfterSlides: JSON.stringify(this.defaultSlides),
        },
      });
    }

    // Parse JSON fields
    return {
      ...settings,
      featuredServiceIds: typeof settings.featuredServiceIds === 'string' 
        ? JSON.parse(settings.featuredServiceIds) 
        : settings.featuredServiceIds,
      beforeAfterSlides: typeof settings.beforeAfterSlides === 'string' 
        ? JSON.parse(settings.beforeAfterSlides) 
        : settings.beforeAfterSlides,
    };
  }

  async updateHomepageSettings(data: any) {
    const current = await this.getHomepageSettings();
    
    const updateData: any = {};
    
    if (data.heroHeadline !== undefined) updateData.heroHeadline = data.heroHeadline;
    if (data.heroSubheadline !== undefined) updateData.heroSubheadline = data.heroSubheadline;
    if (data.heroImage !== undefined) updateData.heroImage = data.heroImage;
    if (data.heroBadge !== undefined) updateData.heroBadge = data.heroBadge;
    if (data.ctaPrimaryText !== undefined) updateData.ctaPrimaryText = data.ctaPrimaryText;
    if (data.ctaPrimaryLink !== undefined) updateData.ctaPrimaryLink = data.ctaPrimaryLink;
    if (data.ctaSecondaryText !== undefined) updateData.ctaSecondaryText = data.ctaSecondaryText;
    if (data.ctaSecondaryLink !== undefined) updateData.ctaSecondaryLink = data.ctaSecondaryLink;
    if (data.statsHomesCleaned !== undefined) updateData.statsHomesCleaned = data.statsHomesCleaned;
    if (data.statsRating !== undefined) updateData.statsRating = data.statsRating;
    if (data.statsSatisfaction !== undefined) updateData.statsSatisfaction = data.statsSatisfaction;
    if (data.statsResponseTime !== undefined) updateData.statsResponseTime = data.statsResponseTime;
    if (data.showFeaturesSection !== undefined) updateData.showFeaturesSection = data.showFeaturesSection;
    if (data.showServicesSection !== undefined) updateData.showServicesSection = data.showServicesSection;
    if (data.showTestimonialsSection !== undefined) updateData.showTestimonialsSection = data.showTestimonialsSection;
    if (data.showAreasSection !== undefined) updateData.showAreasSection = data.showAreasSection;
    if (data.showBlogSection !== undefined) updateData.showBlogSection = data.showBlogSection;
    if (data.showImageShowcase !== undefined) updateData.showImageShowcase = data.showImageShowcase;
    if (data.showCTASection !== undefined) updateData.showCTASection = data.showCTASection;
    if (data.featuredServiceIds !== undefined) updateData.featuredServiceIds = JSON.stringify(data.featuredServiceIds);
    if (data.beforeAfterSlides !== undefined) updateData.beforeAfterSlides = JSON.stringify(data.beforeAfterSlides);

    const settings = await this.prisma.homepageSettings.update({
      where: { id: current.id },
      data: updateData,
    });

    return {
      ...settings,
      featuredServiceIds: typeof settings.featuredServiceIds === 'string' 
        ? JSON.parse(settings.featuredServiceIds) 
        : settings.featuredServiceIds,
      beforeAfterSlides: typeof settings.beforeAfterSlides === 'string' 
        ? JSON.parse(settings.beforeAfterSlides) 
        : settings.beforeAfterSlides,
    };
  }
}
