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
    
    // Build update data - only include fields that are explicitly provided (not undefined)
    const updateData: any = {};
    
    // Helper to add field if defined (including empty string)
    const addField = (key: string, value: any) => {
      if (value !== undefined) {
        updateData[key] = value;
      }
    };
    
    addField('companyName', data.companyName);
    addField('tagline', data.tagline);
    addField('description', data.description);
    addField('logo', data.logo);
    addField('favicon', data.favicon);
    addField('logoDark', data.logoDark);
    addField('email', data.email);
    addField('phone', data.phone);
    addField('whatsapp', data.whatsapp);
    addField('address', data.address);
    addField('city', data.city);
    addField('province', data.province);
    addField('postalCode', data.postalCode);
    addField('googleMapsUrl', data.googleMapsUrl);
    addField('facebook', data.facebook);
    addField('instagram', data.instagram);
    addField('twitter', data.twitter);
    addField('youtube', data.youtube);
    addField('linkedin', data.linkedin);
    addField('tiktok', data.tiktok);
    addField('metaTitle', data.metaTitle);
    addField('metaDescription', data.metaDescription);
    addField('ogImage', data.ogImage);
    addField('keywords', data.keywords);
    addField('footerText', data.footerText);
    addField('copyrightText', data.copyrightText);
    addField('mondayOpen', data.mondayOpen);
    addField('mondayClose', data.mondayClose);
    addField('tuesdayOpen', data.tuesdayOpen);
    addField('tuesdayClose', data.tuesdayClose);
    addField('wednesdayOpen', data.wednesdayOpen);
    addField('wednesdayClose', data.wednesdayClose);
    addField('thursdayOpen', data.thursdayOpen);
    addField('thursdayClose', data.thursdayClose);
    addField('fridayOpen', data.fridayOpen);
    addField('fridayClose', data.fridayClose);
    addField('saturdayOpen', data.saturdayOpen);
    addField('saturdayClose', data.saturdayClose);
    addField('sundayOpen', data.sundayOpen);
    addField('sundayClose', data.sundayClose);
    addField('is24Hours', data.is24Hours);
    addField('minAdvanceDays', data.minAdvanceDays);
    addField('maxAdvanceDays', data.maxAdvanceDays);
    addField('cancellationHours', data.cancellationHours);
    
    if (!settings) {
      // Create new with defaults + updates
      settings = await this.prisma.siteSettings.create({
        data: {
          companyName: 'NingClean',
          tagline: 'Layanan Kebersihan Profesional',
          ...updateData,
        },
      });
    } else {
      // Update only if there's data to update
      if (Object.keys(updateData).length > 0) {
        settings = await this.prisma.siteSettings.update({
          where: { id: settings.id },
          data: updateData,
        });
      }
    }
    
    return settings;
  }
}
