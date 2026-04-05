import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SiteSettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.siteSettings.findFirst();
    
    // Create default settings if not exists
    if (!settings) {
      settings = await this.prisma.siteSettings.create({
        data: {
          companyName: 'NingClean',
          tagline: 'Layanan Kebersihan Profesional',
        },
      });
    }
    
    return settings;
  }

  async updateSettings(data: any) {
    let settings = await this.prisma.siteSettings.findFirst();
    
    if (!settings) {
      settings = await this.prisma.siteSettings.create({
        data: {
          companyName: data.companyName || 'NingClean',
          tagline: data.tagline,
          description: data.description,
          logo: data.logo,
          favicon: data.favicon,
          logoDark: data.logoDark,
          email: data.email,
          phone: data.phone,
          whatsapp: data.whatsapp,
          address: data.address,
          city: data.city,
          province: data.province,
          postalCode: data.postalCode,
          googleMapsUrl: data.googleMapsUrl,
          facebook: data.facebook,
          instagram: data.instagram,
          twitter: data.twitter,
          youtube: data.youtube,
          linkedin: data.linkedin,
          tiktok: data.tiktok,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          ogImage: data.ogImage,
          keywords: data.keywords,
          footerText: data.footerText,
          copyrightText: data.copyrightText,
          mondayOpen: data.mondayOpen,
          mondayClose: data.mondayClose,
          tuesdayOpen: data.tuesdayOpen,
          tuesdayClose: data.tuesdayClose,
          wednesdayOpen: data.wednesdayOpen,
          wednesdayClose: data.wednesdayClose,
          thursdayOpen: data.thursdayOpen,
          thursdayClose: data.thursdayClose,
          fridayOpen: data.fridayOpen,
          fridayClose: data.fridayClose,
          saturdayOpen: data.saturdayOpen,
          saturdayClose: data.saturdayClose,
          sundayOpen: data.sundayOpen,
          sundayClose: data.sundayClose,
          is24Hours: data.is24Hours,
          minAdvanceDays: data.minAdvanceDays,
          maxAdvanceDays: data.maxAdvanceDays,
          cancellationHours: data.cancellationHours,
        },
      });
    } else {
      settings = await this.prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          companyName: data.companyName ?? settings.companyName,
          tagline: data.tagline ?? settings.tagline,
          description: data.description ?? settings.description,
          logo: data.logo ?? settings.logo,
          favicon: data.favicon ?? settings.favicon,
          logoDark: data.logoDark ?? settings.logoDark,
          email: data.email ?? settings.email,
          phone: data.phone ?? settings.phone,
          whatsapp: data.whatsapp ?? settings.whatsapp,
          address: data.address ?? settings.address,
          city: data.city ?? settings.city,
          province: data.province ?? settings.province,
          postalCode: data.postalCode ?? settings.postalCode,
          googleMapsUrl: data.googleMapsUrl ?? settings.googleMapsUrl,
          facebook: data.facebook ?? settings.facebook,
          instagram: data.instagram ?? settings.instagram,
          twitter: data.twitter ?? settings.twitter,
          youtube: data.youtube ?? settings.youtube,
          linkedin: data.linkedin ?? settings.linkedin,
          tiktok: data.tiktok ?? settings.tiktok,
          metaTitle: data.metaTitle ?? settings.metaTitle,
          metaDescription: data.metaDescription ?? settings.metaDescription,
          ogImage: data.ogImage ?? settings.ogImage,
          keywords: data.keywords ?? settings.keywords,
          footerText: data.footerText ?? settings.footerText,
          copyrightText: data.copyrightText ?? settings.copyrightText,
          mondayOpen: data.mondayOpen ?? settings.mondayOpen,
          mondayClose: data.mondayClose ?? settings.mondayClose,
          tuesdayOpen: data.tuesdayOpen ?? settings.tuesdayOpen,
          tuesdayClose: data.tuesdayClose ?? settings.tuesdayClose,
          wednesdayOpen: data.wednesdayOpen ?? settings.wednesdayOpen,
          wednesdayClose: data.wednesdayClose ?? settings.wednesdayClose,
          thursdayOpen: data.thursdayOpen ?? settings.thursdayOpen,
          thursdayClose: data.thursdayClose ?? settings.thursdayClose,
          fridayOpen: data.fridayOpen ?? settings.fridayOpen,
          fridayClose: data.fridayClose ?? settings.fridayClose,
          saturdayOpen: data.saturdayOpen ?? settings.saturdayOpen,
          saturdayClose: data.saturdayClose ?? settings.saturdayClose,
          sundayOpen: data.sundayOpen ?? settings.sundayOpen,
          sundayClose: data.sundayClose ?? settings.sundayClose,
          is24Hours: data.is24Hours ?? settings.is24Hours,
          minAdvanceDays: data.minAdvanceDays ?? settings.minAdvanceDays,
          maxAdvanceDays: data.maxAdvanceDays ?? settings.maxAdvanceDays,
          cancellationHours: data.cancellationHours ?? settings.cancellationHours,
        },
      });
    }
    
    return settings;
  }
}
