'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { HeroSection, FeaturesSection, ServicesSection, CTASection, TestimonialsSection, AreasSection, BlogSection, ImageShowcase } from '@/components/sections';
import { SectionLoader } from '@/components/ui/Spinner';
import { servicesApi, blogApi, getTestimonials, getGalleryItems, getServiceAreas, getHomepageSettings } from '@/lib/api';
import { mockServices, getFeaturedServices } from '@/lib/mock/services';
import { Service, BlogPost } from '@/types/api';
import { Testimonial } from '@/types/api';

// Mock blog posts
const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Tips Membersihkan Sofa Kulit Agar Awet dan Mengkilap',
    slug: 'tips-membersihkan-sofa-kulit',
    excerpt: 'Sofa kulit memerlukan perawatan khusus untuk menjaga kelembabannya. Pelajari teknik pembersihan yang tepat agar sofa kulit Anda tetap mengkilap.',
    content: '...',
    coverImage: undefined,
    tags: ['sofa', 'tips', 'perawatan'],
    author: 'Tim Ningclean',
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
    coverImage: undefined,
    tags: ['deep-cleaning', 'tips', 'kesehatan'],
    author: 'Tim Ningclean',
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
    coverImage: undefined,
    tags: ['renovasi', 'post-construction', 'kesehatan'],
    author: 'Tim Ningclean',
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
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [serviceAreas, setServiceAreas] = useState<any[]>([]);
  const [homepageSettings, setHomepageSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, blogData, testimonialsData, galleryData, areasData, homeSettings] = await Promise.all([
          servicesApi.getAll(),
          blogApi.getRecent(3),
          getTestimonials(),
          getGalleryItems(),
          getServiceAreas(),
          getHomepageSettings(),
        ]);

        // Use API data if available, otherwise use mock data
        if (servicesData.data && servicesData.data.length > 0) {
          setServices(servicesData.data);
        } else {
          setServices(mockServices);
        }

        // Handle both paginated response { data, total, ... } and direct array
        const postsData = blogData.data || blogData;
        if (postsData && postsData.length > 0) {
          setBlogPosts(postsData);
        } else {
          setBlogPosts(mockBlogPosts);
        }

        if (testimonialsData && testimonialsData.length > 0) {
          setTestimonials(testimonialsData.filter((t: any) => t.isActive));
        }

        if (galleryData && galleryData.length > 0) {
          setGalleryItems(galleryData.filter((g: any) => g.isActive));
        }

        if (areasData && areasData.length > 0) {
          setServiceAreas(areasData.filter((a: any) => a.isActive));
        }

        if (homeSettings) {
          setHomepageSettings(homeSettings);
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
        <HeroSection
          badge={homepageSettings?.heroBadge}
          headline={homepageSettings?.heroHeadline ? `${homepageSettings.heroHeadline}|${homepageSettings.heroHeadlineSuffix || 'Bersih & Nyaman'}` : undefined}
          subheadline={homepageSettings?.heroSubheadline}
          ctaPrimaryText={homepageSettings?.ctaPrimaryText}
          ctaPrimaryLink={homepageSettings?.ctaPrimaryLink}
          ctaSecondaryText={homepageSettings?.ctaSecondaryText}
          ctaSecondaryLink={homepageSettings?.ctaSecondaryLink}
          heroImage={homepageSettings?.heroImage}
          stats={{
            homesCleaned: homepageSettings?.statsHomesCleaned,
            rating: homepageSettings?.statsRating,
            satisfaction: homepageSettings?.statsSatisfaction,
            responseTime: homepageSettings?.statsResponseTime,
          }}
          beforeAfterSlides={homepageSettings?.beforeAfterSlides}
        />
        {homepageSettings?.showFeaturesSection !== false && <FeaturesSection />}
        {homepageSettings?.showImageShowcase !== false && <ImageShowcase galleryItems={galleryItems} />}
        {homepageSettings?.showServicesSection !== false && <ServicesSection services={services} />}
        {homepageSettings?.showCTASection !== false && <CTASection />}
        {homepageSettings?.showTestimonialsSection !== false && <TestimonialsSection testimonials={testimonials} />}
        {homepageSettings?.showAreasSection !== false && <AreasSection serviceAreas={serviceAreas} />}
        {homepageSettings?.showBlogSection !== false && <BlogSection posts={blogPosts} />}
      </main>

      <Footer />
    </div>
  );
}
