// Mock services data for development and fallback
import { Service } from '@/types/api';

export const mockServices: Service[] = [
  // Deep Cleaning
  {
    id: 'deep-cleaning-rumah',
    name: 'Deep Cleaning Rumah',
    description: 'Pembersihan menyeluruh untuk seluruh area rumah termasuk ruang tamu, kamar, dapur, dan kamar mandi dengan teknik profesional.',
    price: 750000,
    duration: 240,
    category: 'Deep Cleaning',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
    features: [
      'Pembersihan dinding & langit-langit',
      'Sikat & vacuum karpet/sofa',
      'Sterilisasi kamar mandi',
      'Pembersihan kitchen set',
      'Pembersihan jendela & kusen',
      'Pembersihan area luar rumah',
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'deep-cleaning-apartemen',
    name: 'Deep Cleaning Apartemen',
    description: 'Layanan deep cleaning khusus untuk unit apartemen dengan peralatan yang aman untuk furniture dan interior modern.',
    price: 550000,
    duration: 180,
    category: 'Deep Cleaning',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    features: [
      'Pembersihan AC & ventilasi',
      'Sikat karpet & curtain',
      'Poles keramik & marmer',
      'Pembersihan balcony',
      'Sterilisasi seluruh ruangan',
      'Pembersihan kitchenette',
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'deep-cleaning-kantor',
    name: 'Deep Cleaning Kantor',
    description: 'Pembersihan mendalam untuk ruang kantor, meeting room, dan area bersama dengan standar kebersihan tinggi.',
    price: 850000,
    duration: 300,
    category: 'Deep Cleaning',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    features: [
      'Pembersihan meja & kursi kerja',
      'Vacuum carpet & upholstery',
      'Cleaning AC & ventilasi',
      'Sterilisasi ruang meeting',
      'Pembersihan pantry & toilet',
      'Waste management',
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Regular Cleaning
  {
    id: 'regular-cleaning-rumah',
    name: 'Regular Cleaning Rumah',
    description: 'Layanan pembersihan rutin untuk menjaga kebersihan rumah Anda agar tetap nyaman dan sehat.',
    price: 150000,
    duration: 120,
    category: 'Regular Cleaning',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    features: [
      'Vacuum & sweep lantai',
      'Pembersihan debu surfaces',
      'Cleaning kamar mandi',
      'Pembersihan dapur',
      'Penggantian linen',
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getFeaturedServices(): Service[] {
  return mockServices.filter(s => s.isActive).slice(0, 3);
}
