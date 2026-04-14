/**
 * Verify All Services
 *
 * Usage: npx tsx scripts/verify-services.ts
 */

const API_BASE = process.env.API_URL || 'http://localhost:4000/api';

async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`);
  return response.json();
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('         📋 DAFTAR LENGKAP SEMUA SERVICES 📋');
  console.log('═══════════════════════════════════════════════════════════════\n');

  try {
    const services: any[] = await fetchApi('/services?all=true');

    // Group by category
    const byCategory: Record<string, any[]> = {};
    services.forEach(s => {
      const cat = s.category || 'Uncategorized';
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(s);
    });

    let totalIndex = 0;
    for (const [category, items] of Object.entries(byCategory)) {
      console.log(`\n📁 ${category} (${items.length} services)`);
      console.log('─'.repeat(70));

      items.forEach((item, idx) => {
        totalIndex++;
        const price = `Rp ${item.price?.toLocaleString('id-ID') || 0}`;
        const duration = `${item.duration} min`;
        const hasImage = item.image ? '🖼️' : '⬜';
        const isFeatured = item.isFeatured ? '⭐' : '  ';
        const isActive = item.isActive ? '✅' : '❌';

        console.log(`   ${String(totalIndex).padStart(2)}. ${isActive} ${isFeatured}${item.name}`);
        console.log(`       💰 ${price.padEnd(12)} 🕐 ${duration.padEnd(8)} ${hasImage}`);
      });
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log(`         TOTAL: ${services.length} SERVICES`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Summary stats
    const activeCount = services.filter(s => s.isActive).length;
    const featuredCount = services.filter(s => s.isFeatured).length;
    const withImageCount = services.filter(s => s.image).length;

    console.log('📊 Statistics:');
    console.log(`   • Total Services: ${services.length}`);
    console.log(`   • Active: ${activeCount}`);
    console.log(`   • Featured: ${featuredCount}`);
    console.log(`   • With Image: ${withImageCount}`);
    console.log(`   • Categories: ${Object.keys(byCategory).length}`);
    console.log('');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
