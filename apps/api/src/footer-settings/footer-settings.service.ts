import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FooterSettingsService {
  constructor(private prisma: PrismaService) {}

  // Default footer columns
  private defaultColumns = [
    {
      title: 'Layanan',
      links: [
        { label: 'Semua Layanan', href: '/services' },
        { label: 'Harga', href: '/pricing' },
        { label: 'Deep Cleaning', href: '/services#deep-cleaning' },
        { label: 'Regular Cleaning', href: '/services#regular-cleaning' },
      ],
    },
    {
      title: 'Perusahaan',
      links: [
        { label: 'Tentang Kami', href: '/about' },
        { label: 'Galeri', href: '/gallery' },
        { label: 'Blog & Tips', href: '/blog' },
        { label: 'Hubungi Kami', href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Kebijakan Privasi', href: '/privacy' },
        { label: 'Syarat & Ketentuan', href: '/terms' },
        { label: 'Kebijakan Refund', href: '/refund' },
      ],
    },
  ];

  // Default social links
  private defaultSocials = [
    { name: 'Instagram', href: 'https://instagram.com/ningclean', icon: 'instagram' },
    { name: 'WhatsApp', href: 'https://wa.me/6281234567890', icon: 'whatsapp' },
    { name: 'TikTok', href: 'https://tiktok.com/@ningclean', icon: 'tiktok' },
    { name: 'YouTube', href: '#', icon: 'youtube' },
  ];

  async getFooterSettings() {
    let settings = await this.prisma.footerSettings.findFirst();
    
    if (!settings) {
      settings = await this.prisma.footerSettings.create({
        data: {
          footerColumns: JSON.stringify(this.defaultColumns),
          showContact: true,
          contactEmail: 'hello@ningclean.id',
          contactPhone: '+62 812-3456-7890',
          contactWhatsapp: '6281234567890',
          contactAddress: 'Surabaya · Gresik · Sidoarjo',
          showSocials: true,
          socialLinks: JSON.stringify(this.defaultSocials),
          showNewsletter: true,
          newsletterTitle: 'Dapat tips bersih setiap minggu',
          newsletterSubtitle: 'Promo eksklusif dan info layanan baru langsung ke inbox kamu.',
          showStatusBadge: true,
          statusBadgeText: 'Semua layanan aktif',
          copyrightText: 'All rights reserved.',
        },
      });
    }

    // Parse JSON fields
    return {
      ...settings,
      footerColumns: typeof settings.footerColumns === 'string' 
        ? JSON.parse(settings.footerColumns) 
        : settings.footerColumns,
      socialLinks: typeof settings.socialLinks === 'string' 
        ? JSON.parse(settings.socialLinks) 
        : settings.socialLinks,
    };
  }

  async updateFooterSettings(data: any) {
    const current = await this.getFooterSettings();
    
    const updateData: any = {};
    
    if (data.footerColumns !== undefined) updateData.footerColumns = JSON.stringify(data.footerColumns);
    if (data.showContact !== undefined) updateData.showContact = data.showContact;
    if (data.contactEmail !== undefined) updateData.contactEmail = data.contactEmail;
    if (data.contactPhone !== undefined) updateData.contactPhone = data.contactPhone;
    if (data.contactWhatsapp !== undefined) updateData.contactWhatsapp = data.contactWhatsapp;
    if (data.contactAddress !== undefined) updateData.contactAddress = data.contactAddress;
    if (data.showSocials !== undefined) updateData.showSocials = data.showSocials;
    if (data.socialLinks !== undefined) updateData.socialLinks = JSON.stringify(data.socialLinks);
    if (data.showNewsletter !== undefined) updateData.showNewsletter = data.showNewsletter;
    if (data.newsletterTitle !== undefined) updateData.newsletterTitle = data.newsletterTitle;
    if (data.newsletterSubtitle !== undefined) updateData.newsletterSubtitle = data.newsletterSubtitle;
    if (data.showStatusBadge !== undefined) updateData.showStatusBadge = data.showStatusBadge;
    if (data.statusBadgeText !== undefined) updateData.statusBadgeText = data.statusBadgeText;
    if (data.copyrightText !== undefined) updateData.copyrightText = data.copyrightText;

    const settings = await this.prisma.footerSettings.update({
      where: { id: current.id },
      data: updateData,
    });

    return {
      ...settings,
      footerColumns: typeof settings.footerColumns === 'string' 
        ? JSON.parse(settings.footerColumns) 
        : settings.footerColumns,
      socialLinks: typeof settings.socialLinks === 'string' 
        ? JSON.parse(settings.socialLinks) 
        : settings.socialLinks,
    };
  }
}
