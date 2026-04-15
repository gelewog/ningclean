// Script untuk cek data blog_posts di database
// Jalankan: npx ts-node scripts/check-blog-data.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== CEK DATA BLOG_POSTS ===\n');

  // 1. Cek semua blog posts
  const allPosts = await prisma.blogPost.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      publishedAt: true,
      createdAt: true,
      author: true,
      isFeatured: true,
      category: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  console.log(`Total semua posts: ${allPosts.length}`);
  console.log('\n--- Semua Posts ---');
  allPosts.forEach((p, i) => {
    console.log(`${i + 1}. ${p.title}`);
    console.log(`   ID: ${p.id}`);
    console.log(`   Slug: ${p.slug}`);
    console.log(`   PublishedAt: ${p.publishedAt}`);
    console.log(`   Status: ${p.publishedAt ? 'PUBLISHED' : 'DRAFT'}`);
    console.log(`   Category: ${p.category?.name || 'null'}`);
    console.log('');
  });

  // 2. Cek posts dengan publishedAt = null (drafts)
  const draftPosts = await prisma.blogPost.findMany({
    where: { publishedAt: null },
    select: {
      id: true,
      title: true,
      slug: true,
      publishedAt: true,
      createdAt: true,
    },
  });

  console.log(`\n--- Draft Posts (publishedAt = null) ---`);
  console.log(`Total draft: ${draftPosts.length}`);
  draftPosts.forEach((p, i) => {
    console.log(`${i + 1}. ${p.title} (${p.slug})`);
  });

  // 3. Cek posts dengan publishedAt != null (published)
  const publishedPosts = await prisma.blogPost.findMany({
    where: { NOT: { publishedAt: null } },
    select: {
      id: true,
      title: true,
      slug: true,
      publishedAt: true,
    },
  });

  console.log(`\n--- Published Posts ---`);
  console.log(`Total published: ${publishedPosts.length}`);

  // 4. Cek blog categories
  const categories = await prisma.blogCategory.findMany({
    include: { _count: { select: { posts: true } } },
  });

  console.log(`\n--- Blog Categories ---`);
  console.log(`Total categories: ${categories.length}`);
  categories.forEach((c) => {
    console.log(`- ${c.name} (${c.slug}) - ${c._count.posts} posts`);
  });

  // 5. Simulasi response dari API /blog
  console.log('\n=== ANALISIS API RESPONSE ===');
  console.log('GET /blogpublic endpoint returns posts where NOT { publishedAt: null }');
  console.log(`Ada ${publishedPosts.length} published posts yang akan dikembalikan ke frontend`);
  console.log(`Ada ${draftPosts.length} draft posts yang TIDAK dikembalikan (filtered out)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
