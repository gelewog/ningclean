/**
 * Analisis FooterSettings dan rencana migrasi
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Field dari Prisma FooterSettings model
const footerSettingsFields = [
  'id',
  'footerColumns',      // JSON - { title, links: [{label, href}] }
  'showContact',        // Boolean
  'contactEmail',       // String?
  'contactPhone',       // String?
  'contactWhatsapp',    // String?
  'contactAddress',     // String?
  'showSocials',        // Boolean
  'socialLinks',        // JSON - [{name, href, icon}]
  'showNewsletter',     // Boolean
  'newsletterTitle',    // String
  'newsletterSubtitle', // String?
  'showStatusBadge',    // Boolean
  'statusBadgeText',    // String
  'copyrightText',      // String
  'createdAt',
  'updatedAt'
];

// Default values dari web/src/components/footer/Footer.tsx
const defaultFooter = {
  footerColumns: [
    { title: 'Layanan', links: [
      { href: '/services', label: 'Semua Layanan' },
      { href: '/pricing', label: 'Harga' },
    ]},
    { title: 'Perusahaan', links: [
      { href: '/about', label: 'Tentang Kami' },
      { href: '/gallery', label: 'Galeri' },
    ]},
  ],
  showContact: true,
  contactEmail: 'hello@ningclean.id',
  contactPhone: '+62 812-3456-7890',
  contactWhatsapp: '6281234567890',
  contactAddress: 'Surabaya · Gresik · Sidoarjo',
  showSocials: true,
  socialLinks: [
    { name: 'Instagram', href: 'https://instagram.com/ningclean', icon: 'instagram' },
    { name: 'WhatsApp', href: 'https://wa.me/6281234567890', icon: 'whatsapp' },
  ],
  showNewsletter: true,
  newsletterTitle: 'Dapat tips bersih setiap minggu',
  newsletterSubtitle: 'Promo eksklusif dan info layanan baru.',
  showStatusBadge: true,
  statusBadgeText: 'Semua layanan aktif',
  copyrightText: 'All rights reserved.',
};

async function analyzeFooterMigration() {
  console.log('========================================');
  console.log('FOOTER SETTINGS MIGRATION ANALYSIS');
  console.log('========================================\n');

  try {
    // 1. Check current FooterSettings in database
    console.log('--- CEK DATA DI DATABASE ---');
    const footerSettings = await prisma.footerSettings.findFirst();
    
    if (footerSettings) {
      console.log('✅ FooterSettings ditemukan di database');
      console.log('ID:', footerSettings.id);
      console.log('Updated At:', footerSettings.updatedAt);
      
      const columns = footerSettings.footerColumns ? 
        (typeof footerSettings.footerColumns === 'string' ? 
          JSON.parse(footerSettings.footerColumns) : footerSettings.footerColumns) : [];
      console.log('Footer Columns:', Array.isArray(columns) ? columns.length : 0, 'columns');
      
      const socials = footerSettings.socialLinks ? 
        (typeof footerSettings.socialLinks === 'string' ? 
          JSON.parse(footerSettings.socialLinks) : footerSettings.socialLinks) : [];
      console.log('Social Links:', Array.isArray(socials) ? socials.length : 0, 'links');
      
      console.log('Show Contact:', footerSettings.showContact);
      console.log('Contact Email:', footerSettings.contactEmail || '(kosong)');
      console.log('Show Newsletter:', footerSettings.showNewsletter);
      console.log('Newsletter Title:', footerSettings.newsletterTitle || '(kosong)');
      console.log('Show Status Badge:', footerSettings.showStatusBadge);
      console.log('Copyright Text:', footerSettings.copyrightText || '(kosong)');
    } else {
      console.log('❌ Tidak ada FooterSettings di database! Perlu migrasi.');
    }

    console.log('\n--- SKENARIO MIGRASI ---');
    
    if (!footerSettings) {
      console.log('\nOpsi 1: Insert default data ke database');
      console.log('-----------------------------------');
      console.log('INSERT INTO footer_settings DEFAULT VALUES dengan data dari web app');
      
      console.log('\nOpsi 2: Merge dengan SiteSettings');
      console.log('-----------------------------------');
      console.log('Pindahkan field footer ke SiteSettings (tidak direkomendasikan karena kompleks)');
      
      console.log('\nOpsi 3: Biarkan tetap separate table');
      console.log('-----------------------------------');
      console.log('FooterSettings sudah optimal sebagai table terpisah karena:');
      console.log('- Kompleks (JSON columns, multiple arrays)');
      console.log('- Dikelola via tab terpisah di admin');
      console.log('- Tidak bergantung pada SiteSettings');
    } else {
      console.log('✅ FooterSettings sudah ada dan siap digunakan');
      console.log('Tidak perlu migrasi, hanya perlu populate data jika kosong.');
    }

    console.log('\n--- CEK SITESETTINGS UNTUK FIELD DUPLIKAT ---');
    const siteSettings = await prisma.siteSettings.findFirst();
    if (siteSettings) {
      const hasFooterFields = siteSettings.footerText || siteSettings.copyrightText;
      console.log('SiteSettings.footerText:', siteSettings.footerText || '(kosong)');
      console.log('SiteSettings.copyrightText:', siteSettings.copyrightText || '(kosong)');
      
      if (hasFooterFields) {
        console.log('\n⚠️ Ditemukan field footer di SiteSettings dan FooterSettings');
        console.log('Rekomendasi: Gunakan hanya FooterSettings untuk data footer lengkap');
        console.log('SiteSettings.footerText dan SiteSettings.copyrightText bisa diabaikan atau dihapus');
      }
    }

    console.log('\n--- STRUKTUR DATABASE SAAT INI ---');
    console.log('Table: SiteSettings');
    console.log('  - companyName, tagline, description, ...');
    console.log('  - footerText (simple text)');
    console.log('  - copyrightText (simple text)');
    console.log('');
    console.log('Table: FooterSettings (TERPISAH)');
    console.log('  - footerColumns (JSON array)');
    console.log('  - showContact, contactEmail, contactPhone, ...');
    console.log('  - showSocials, socialLinks (JSON array)');
    console.log('  - showNewsletter, newsletterTitle, ...');
    console.log('  - showStatusBadge, statusBadgeText');
    console.log('  - copyrightText');

    console.log('\n========================================');
    console.log('REKOMENDASI');
    console.log('========================================');
    console.log('1. ✅ Pertahankan FooterSettings sebagai table terpisah');
    console.log('   - Struktur sudah optimal');
    console.log('   - Web app sudah menggunakan getFooterSettings()');
    console.log('');
    console.log('2. 📝 Populate FooterSettings dengan default values:');
    console.log('   Jika table kosong, insert data default dari web app');
    console.log('');
    console.log('3. 🗑️ Hapus/abaikan SiteSettings.footerText dan copyrightText');
    console.log('   Gunakan FooterSettings untuk semua data footer');
    console.log('');
    console.log('4. ✅ Admin panel sudah punya tab Footer terpisah');
    console.log('   Tidak perlu modifikasi UI');

    console.log('\n========================================');
    console.log('ANALYSIS COMPLETE');
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeFooterMigration();