import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class NavigationSettingsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  // Default navigation links
  private defaultNavLinks = [
    { label: 'Beranda', href: '/', order: 1, isActive: true, isDropdown: false },
    { label: 'Layanan', href: '/services', order: 2, isActive: true, isDropdown: false },
    { label: 'Harga', href: '/pricing', order: 3, isActive: true, isDropdown: false },
    { label: 'Galeri', href: '/gallery', order: 4, isActive: true, isDropdown: false },
    { label: 'Blog', href: '/blog', order: 5, isActive: true, isDropdown: false },
    { label: 'Booking', href: '/booking', order: 6, isActive: true, isDropdown: false },
  ];

  async getNavigationSettings() {
    let settings = await this.prisma.navigationSettings.findFirst();
    
    if (!settings) {
      // Create default settings
      settings = await this.prisma.navigationSettings.create({
        data: {
          navLinks: JSON.stringify(this.defaultNavLinks),
          showServicesDropdown: true,
          servicesDropdownLabel: 'Layanan',
          ctaButtonText: 'Booking',
          ctaButtonLink: '/booking',
          showCtaButton: true,
          mobileMenuType: 'slide',
          activeIndicatorStyle: 'dot',
        },
      });
    }

    // Parse navLinks JSON if string
    const navLinks = typeof settings.navLinks === 'string' 
      ? JSON.parse(settings.navLinks) 
      : settings.navLinks;

    return {
      ...settings,
      navLinks,
    };
  }

  async updateNavigationSettings(data: {
    navLinks?: any[];
    showServicesDropdown?: boolean;
    servicesDropdownLabel?: string;
    ctaButtonText?: string;
    ctaButtonLink?: string;
    showCtaButton?: boolean;
    mobileMenuType?: string;
    activeIndicatorStyle?: string;
  }, user?: any) {
    const updateData: any = {};

    if (data.navLinks !== undefined) updateData.navLinks = JSON.stringify(data.navLinks);
    if (data.showServicesDropdown !== undefined) updateData.showServicesDropdown = data.showServicesDropdown;
    if (data.servicesDropdownLabel !== undefined) updateData.servicesDropdownLabel = data.servicesDropdownLabel;
    if (data.ctaButtonText !== undefined) updateData.ctaButtonText = data.ctaButtonText;
    if (data.ctaButtonLink !== undefined) updateData.ctaButtonLink = data.ctaButtonLink;
    if (data.showCtaButton !== undefined) updateData.showCtaButton = data.showCtaButton;
    if (data.mobileMenuType !== undefined) updateData.mobileMenuType = data.mobileMenuType;
    if (data.activeIndicatorStyle !== undefined) updateData.activeIndicatorStyle = data.activeIndicatorStyle;

    const existingSettings = await this.getNavigationSettings();
    const oldNavLinks = existingSettings.navLinks;

    const settings = await this.prisma.navigationSettings.upsert({
      where: { id: existingSettings.id },
      update: updateData,
      create: {
        navLinks: JSON.stringify(this.defaultNavLinks),
        showServicesDropdown: true,
        servicesDropdownLabel: 'Layanan',
        ctaButtonText: 'Booking',
        ctaButtonLink: '/booking',
        showCtaButton: true,
        mobileMenuType: 'slide',
        activeIndicatorStyle: 'dot',
        ...updateData,
      },
    });

    // Audit log
    await this.auditService.log({
      action: 'UPDATE',
      entityType: 'NavigationSettings',
      entityId: settings.id,
      userId: user?.id,
      userEmail: user?.email,
      changes: {
        before: { navLinks: oldNavLinks },
        after: { navLinks: data.navLinks },
      },
    });

    return {
      ...settings,
      navLinks: typeof settings.navLinks === 'string' ? JSON.parse(settings.navLinks) : settings.navLinks,
    };
  }
}
