'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { HeroSection, FeaturesSection, ServicesSection, CTASection, TestimonialsSection, AreasSection, BlogSection, ImageShowcase } from '@/components/sections';
import { SectionLoader } from '@/components/ui/Spinner';
import { servicesApi, blogApi } from '@/lib/api';
import { mockServices, getFeaturedServices } from '@/lib/mock/services';
import { Service, BlogPost } from '@/types/api';

// Mock blog posts
const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Tips Membersihkan Sofa Kulit Agar Awet dan Mengkilap',
    slug: 'tips-membersihkan-sofa-kulit',
    excerpt: 'Sofa kulit memerlukan perawatan khusus untuk menjaga kelembabannya. Pelajari teknik pembersihan yang tepat agar sofa kulit Anda tetap mengkilap.',
    content: '...',
    featuredImage: undefined,
    tags: ['sofa', 'tips', 'perawatan'],
    authorId: '1',
    author: {
      id: '1',
      email: 'writer@ningclean.id',
      name: 'Tim Ningclean',
      role: 'ADMIN',
      createdAt: '',
      updatedAt: '',
    },
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      slug: 'perawatan-sofa',
      name: 'Perawatan Sofa',
    },
    publishedAt: new Date().toISOString(),
    readTime: 5,
  },
  {
    id: '2',
    title: 'Deep Cleaning Rumah: Kapan Waktu yang Tepat?',
    slug: 'deep-cleaning-rumah-waktu-tepat',
    excerpt: 'Deep cleaning tidak perlu dilakukan setiap hari. Kenali tanda-tanda rumah Anda membutuhkan deep cleaning dan manfaatnya untuk kesehatan keluarga.',
    content: '...',
    featuredImage: undefined,
    tags: ['deep-cleaning', 'tips', 'kesehatan'],
    authorId: '1',
    author: {
      id: '1',
      email: 'writer@ningclean.id',
      name: 'Tim Ningclean',
      role: 'ADMIN',
      createdAt: '',
      updatedAt: '',
    },
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      slug: 'tips-harian',
      name: 'Tips Harian',
    },
    publishedAt: new Date().toISOString(),
    readTime: 4,
  },
  {
    id: '3',
    title: '5 Alasan Mengapa Post-Construction Cleaning Penting',
    slug: 'alasan-post-construction-cleaning-penting',
    excerpt: 'Setelah renovasi, debu dan sisa material bangunan bisa mengganggu kesehatan. Pelajari mengapa post-construction cleaning sangat diperlukan.',
    content: '...',
    featuredImage: undefined,
    tags: ['renovasi', 'post-construction', 'kesehatan'],
    authorId: '1',
    author: {
      id: '1',
      email: 'writer@ningclean.id',
      name: 'Tim Ningclean',
      role: 'ADMIN',
      createdAt: '',
      updatedAt: '',
    },
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      slug: 'deep-cleaning',
      name: 'Deep Cleaning',
    },
    publishedAt: new Date().toISOString(),
    readTime: 6,
  },
];

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, blogData] = await Promise.all([
          servicesApi.getAll(),
          blogApi.getRecent(3),
        ]);
        
        // Use API data if available, otherwise use mock data
        if (servicesData.data && servicesData.data.length > 0) {
          setServices(servicesData.data);
        } else {
          setServices(mockServices);
        }
        
        if (blogData.data && blogData.data.length > 0) {
          setBlogPosts(blogData.data);
        } else {
          setBlogPosts(mockBlogPosts);
        }
      } catch (error) {
        console.error('Failed to fetch data, using mock data:', error);
        setServices(mockServices);
        setBlogPosts(mockBlogPosts);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <SectionLoader />;
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />

      <main>
        <HeroSection />
        <FeaturesSection />
        <ImageShowcase />
        <ServicesSection services={services} />
        <CTASection />
        <TestimonialsSection />
        <AreasSection />
        <BlogSection posts={blogPosts} />
      </main>

      <Footer />
    </div>
  );
}
