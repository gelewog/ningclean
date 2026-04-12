/**
 * Analisis konsistensi SiteSettings antara Database dan Admin Panel
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Field dari Prisma schema (SiteSettings model)
const prismaFields = [
  'id', 'companyName', 'tagline', 'description', 'logo', 'favicon', 'logoDark',
  'email', 'phone', 'whatsapp', 'address', 'city', 'province', 'postalCode', 'googleMapsUrl',
  'facebook', 'instagram', 'twitter', 'youtube', 'linkedin', 'tiktok',
  'metaTitle', 'metaDescription', 'ogImage', 'keywords', 'footerText', 'copyrightText',
  'mondayOpen', 'mondayClose', 'tuesdayOpen', 'tuesdayClose', 'wednesdayOpen', 'wednesdayClose',
  'thursdayOpen', 'thursdayClose', 'fridayOpen', 'fridayClose', 'saturdayOpen', 'saturdayClose',
  'sundayOpen', 'sundayClose', 'is24Hours',
  'minAdvanceDays', 'maxAdvanceDays', 'cancellationHours',
  'createdAt', 'updatedAt'
];

// Field dari Admin Panel (settings/page.tsx) - berdasarkan tabs
const adminPanelFields = {
  'Company Tab': ['companyName', 'tagline', 'description', 'logo', 'logoDark', 'favicon'],
  'Contact Tab': ['email', 'phone', 'whatsapp', 'address', 'city', 'province', 'postalCode', 'googleMapsUrl'],
  'Social Tab': ['facebook', 'instagram', 'twitter', 'youtube', 'linkedin', 'tiktok'],
  'SEO Tab': ['metaTitle', 'metaDescription', 'keywords', 'ogImage'],
  'Footer Tab (SiteSettings)': ['footerText', 'copyrightText'],
  'Hours Tab': ['is24Hours', 'mondayOpen', 'mondayClose', 'tuesdayOpen', 'tuesdayClose', 'wednesdayOpen', 'wednesdayClose', 'thursdayOpen', 'thursdayClose', 'fridayOpen', 'fridayClose', 'saturdayOpen', 'saturdayClose', 'sundayOpen', 'sundayClose'],
  'Booking Rules Tab': ['minAdvanceDays', 'maxAdvanceDays', 'cancellationHours']
};

// Field yang ada di database tapi tidak ada di UI
const dbOnlyFields = ['id', 'createdAt', 'updatedAt'];

// Field yang mungkin tidak ada di kedua (legacy/deprecated)
const potentiallyMissing = [];

async function analyzeConsistency() {
  console.log('========================================');
  console.log('SITE SETTINGS CONSISTENCY ANALYSIS');
  console.log('========================================\n');

  try {
    // 1. Get actual data from database
    const siteSettings = await prisma.siteSettings.findFirst();
    
    console.log('--- DATA DI DATABASE ---');
    if (siteSettings) {
      const dbFields = Object.keys(siteSettings);
      console.log('Total fields di database:', dbFields.length);
      console.log('Fields:', dbFields.join(', '));
      
      // Check which fields are null/empty
      const emptyFields = dbFields.filter(f => siteSettings[f] === null || siteSettings[f] === '');
      console.log('\nFields yang kosong:', emptyFields.length > 0 ? emptyFields.join(', ') : 'None');
    } else {
      console.log('❌ Tidak ada data SiteSettings di database!');
    }

    console.log('\n--- FIELD DI PRISMA SCHEMA ---');
    console.log('Total fields di schema:', prismaFields.length);

    console.log('\n--- FIELD DI ADMIN PANEL ---');
    let totalAdminFields = 0;
    Object.entries(adminPanelFields).forEach(([tab, fields]) => {
      console.log(`\n${tab}:`);
      console.log(`  ${fields.join(', ')}`);
      totalAdminFields += fields.length;
    });
    console.log(`\nTotal fields di Admin Panel (unique): ${totalAdminFields}`);

    console.log('\n--- ANALISIS KONSISTENSI ---');
    
    // Check field coverage
    const allAdminFields = Object.values(adminPanelFields).flat();
    const missingInUI = prismaFields.filter(f => !allAdminFields.includes(f) && !dbOnlyFields.includes(f));
    const extraInUI = allAdminFields.filter(f => !prismaFields.includes(f));
    
    if (missingInUI.length > 0) {
      console.log('\n⚠️ Field di Database tapi TIDAK ada di Admin Panel UI:');
      missingInUI.forEach(f => console.log(`  - ${f}`));
    } else {
      console.log('\n✅ Semua field database ada di Admin Panel (kecuali id, timestamps)');
    }

    if (extraInUI.length > 0) {
      console.log('\n❌ Field di Admin Panel tapi TIDAK ada di Database:');
      extraInUI.forEach(f => console.log(`  - ${f}`));
    } else {
      console.log('\n✅ Tidak ada field tambahan di Admin Panel yang tidak ada di database');
    }

    console.log('\n--- BREAKDOWN PER TAB ---');
    Object.entries(adminPanelFields).forEach(([tab, fields]) => {
      const missing = fields.filter(f => !prismaFields.includes(f));
      if (missing.length > 0) {
        console.log(`\n${tab}:`);
        console.log(`  ❌ Field tidak ada di DB: ${missing.join(', ')}`);
      }
    });

    // Check data types consistency
    console.log('\n--- CEK TIPE DATA ---');
    if (siteSettings) {
      // Check numeric fields
      const numericFields = ['minAdvanceDays', 'maxAdvanceDays', 'cancellationHours'];
      numericFields.forEach(f => {
        const value = siteSettings[f];
        const isValid = value === null || typeof value === 'number';
        console.log(`${f}: ${typeof value} (${value}) ${isValid ? '✅' : '❌'}`);
      });
    }

    console.log('\n========================================');
    console.log('ANALYSIS COMPLETE');
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeConsistency();