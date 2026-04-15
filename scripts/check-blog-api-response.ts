// Script untuk cek detail response dari API blog
// Jalankan: npx ts-node scripts/check-blog-api-response.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== CEK API BLOG RESPONSE (simulasi findAll) ===\n');

  // Cek semua posts (tanpa filter) untuk melihat data sebenarnya
  const allPosts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });

  console.log(`Total SEMUA posts di database: ${allPosts.length}`);
  allPosts.forEach((p, i) => {
    console.log(`${i+1}. ${p.title}`);
    console.log(`   ID: ${p.id}`);
    console.log(`   Slug: ${p.slug}`);
    console.log(`   publishedAt: ${p.publishedAt}`);
    console.log(`   createdAt: ${p.createdAt}`);
    console.log(`   isFeatured: ${p.isFeatured}`);
    console.log('');
  });

  // Cek posts dengan publishedAt (semua harusnya ada karena @default(now()))
  // publishedAt tidak nullable di schema, jadi aman

  // Bandingkan dengan BlogService.findAll() - yang pakai filter NOT { publishedAt: null }
  // Karena publishedAt tidak bisa null (schema-nya @default(now())), filter ini redundan
  console.log('\n=== ANALISIS ===');
  console.log('1. Schema BlogPost: publishedAt DateTime @default(now()) - WAJIB ada nilai');
  console.log('2. BlogService.findAll() filter: NOT { publishedAt: null } - redundan/kosong');
  console.log('3. Frontend getBlogPosts() membuat status dari:');
  console.log('   status: (p.publishedAt ? "published" : "draft")');
  console.log('4. MASALAH: publishedAt SELALU ada (oleh @default), jadi status selalu "published"');
  console.log('5. Frontend membutuhkan field "status" yang tidak ada di response API');

  // Cek fields yang diharapkan frontend
  console.log('\n=== FIELD ANALYSIS ===');
  if (allPosts.length > 0) {
    console.log('\nFields di database (BlogPost):');
    Object.keys(allPosts[0]).forEach(k => console.log(`  - ${k}`));

    console.log('\nFields yang diharapkan frontend (BlogPost interface):');
    console.log('  - id, title, slug, content, excerpt, coverImage');
    console.log('  - status: "draft" | "published" <-- FIELD INI TIDAK ADA DI API!');
    console.log('  - author, tags, categoryId, category');
    console.log('  - isFeatured, createdAt, updatedAt');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
