import { PrismaClient, Role, BookingStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ningclean.com' },
    update: {},
    create: {
      email: 'admin@ningclean.com',
      name: 'Admin NingClean',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });
  console.log('Admin user created:', admin.email);

  // Seed Services
  const services = [
    {
      name: 'General Cleaning',
      slug: 'general-cleaning',
      description: 'Comprehensive general cleaning service for homes and offices',
      price: 250000,
      duration: 120,
      category: 'residential',
      features: ['Dusting', 'Vacuuming', 'Mopping', 'Surface sanitization'],
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Deep Cleaning',
      slug: 'deep-cleaning',
      description: 'Intensive deep cleaning for thorough sanitation',
      price: 450000,
      duration: 240,
      category: 'residential',
      features: ['Deep carpet cleaning', 'Grout cleaning', 'Appliance cleaning', 'Window cleaning'],
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Office Cleaning',
      slug: 'office-cleaning',
      description: 'Professional office cleaning services',
      price: 350000,
      duration: 180,
      category: 'commercial',
      features: ['Desk sanitization', 'Common area cleaning', 'Restroom cleaning', 'Trash removal'],
      isActive: true,
      isFeatured: true,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
  }
  console.log('Services seeded');

  // Seed Blog Posts
  const blogPosts = [
    {
      slug: 'tips-kebersihan-rumah',
      title: '10 Tips Kebersihan Rumah yang Wajib Diketahui',
      excerpt: 'Pelajari cara menjaga kebersihan rumah dengan tips praktis ini.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      author: 'NingClean Team',
      tags: ['cleaning', 'tips', 'home'],
      readTime: 5,
    },
    {
      slug: 'manfaat-deep-cleaning',
      title: 'Manfaat Deep Cleaning untuk Rumah Anda',
      excerpt: 'Kenali manfaat deep cleaning untuk kesehatan dan kenyamanan keluarga.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      author: 'NingClean Team',
      tags: ['deep-cleaning', 'health', 'home'],
      readTime: 4,
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log('Blog posts seeded');

  // Seed Testimonials
  const testimonials = [
    {
      name: 'Budi Santoso',
      role: 'Pemilik Rumah',
      content: 'Pelayanan sangat profesional dan hasilnya memuaskan. Rumah saya jadi bersih dan wangi!',
      rating: 5,
      isActive: true,
      isFeatured: true,
      order: 1,
    },
    {
      name: 'Siti Rahayu',
      role: 'Ibu Rumah Tangga',
      content: 'Tim NingClean sangat ramah dan teliti. Saya puas dengan hasil deep cleaning.',
      rating: 5,
      isActive: true,
      isFeatured: true,
      order: 2,
    },
    {
      name: 'PT Maju Jaya',
      company: 'PT Maju Jaya',
      role: 'Manager',
      content: 'Kantor kami selalu bersih berkat layanan regular dari NingClean. Highly recommended!',
      rating: 5,
      isActive: true,
      isFeatured: true,
      order: 3,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({ data: testimonial });
  }
  console.log('Testimonials seeded');

  // Create sample customer for bookings
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'John Doe',
      password: customerPassword,
      role: Role.CUSTOMER,
      phone: '081234567890',
    },
  });
  console.log('Customer user created:', customer.email);

  // Seed Bookings
  const allServices = await prisma.service.findMany({});
  
  const bookings = [
    {
      orderNumber: 'NC-2026-0001',
      customerId: customer.id,
      serviceDate: new Date('2026-04-02'),
      serviceTime: '09:00',
      address: 'Jl. Sudirman No. 123, Jakarta Selatan',
      area: 'Jakarta Selatan',
      status: 'PENDING',
      totalAmount: 250000,
      notes: 'Cleaning untuk rumah 3 kamar',
    },
    {
      orderNumber: 'NC-2026-0002',
      customerId: customer.id,
      serviceDate: new Date('2026-03-28'),
      serviceTime: '14:00',
      address: 'Jl. Thamrin No. 456, Jakarta Pusat',
      area: 'Jakarta Pusat',
      status: 'COMPLETED',
      totalAmount: 450000,
      notes: 'Deep cleaning untuk seluruh rumah',
    },
    {
      orderNumber: 'NC-2026-0003',
      customerId: customer.id,
      serviceDate: new Date('2026-04-05'),
      serviceTime: '10:00',
      address: 'Jl. Gatot Subroto, Jakarta Selatan',
      area: 'Jakarta Selatan',
      status: 'CONFIRMED',
      totalAmount: 350000,
      notes: 'Office cleaning',
    },
    {
      orderNumber: 'NC-2026-0004',
      customerId: customer.id,
      serviceDate: new Date('2026-03-20'),
      serviceTime: '08:00',
      address: 'BSD Sector 1, Tangerang',
      area: 'Tangerang',
      status: 'COMPLETED',
      totalAmount: 250000,
      notes: '',
    },
    {
      orderNumber: 'NC-2026-0005',
      customerId: customer.id,
      serviceDate: new Date('2026-04-08'),
      serviceTime: '13:00',
      address: 'Jl. Ahmad Yani, Bekasi',
      area: 'Bekasi',
      status: 'PENDING',
      totalAmount: 450000,
      notes: 'Deep cleaning apartemen',
    },
  ];

  for (const booking of bookings) {
    const created = await prisma.booking.create({
      data: {
        orderNumber: booking.orderNumber,
        customerId: booking.customerId,
        serviceDate: booking.serviceDate,
        serviceTime: booking.serviceTime,
        address: booking.address,
        area: booking.area,
        status: booking.status as any,
        totalAmount: booking.totalAmount,
        notes: booking.notes,
      },
    });

    // Create booking item with first service
    if (allServices.length > 0) {
      await prisma.bookingItem.create({
        data: {
          bookingId: created.id,
          serviceId: allServices[0].id,
          quantity: 1,
          price: allServices[0].price,
        },
      });
    }
  }
  console.log('Bookings seeded:', bookings.length);

  // Seed Team Members
  const teamMembers = [
    {
      name: 'Ahmad Fauzi',
      position: 'Cleaning Supervisor',
      department: 'Operations',
      bio: '10 tahun pengalaman dalam industri cleaning services',
      email: 'ahmad@ningclean.com',
      isActive: true,
      order: 1,
    },
    {
      name: 'Dewi Kusuma',
      position: 'Customer Service Manager',
      department: 'Customer Relations',
      bio: 'Spesialis dalam melayani pelanggan dengan ramah dan profesional',
      email: 'dewi@ningclean.com',
      isActive: true,
      order: 2,
    },
    {
      name: 'Rudi Hartono',
      position: 'Lead Technician',
      department: 'Operations',
      bio: 'Ahli dalam teknik cleaning modern dan equipment terbaru',
      email: 'rudi@ningclean.com',
      isActive: true,
      order: 3,
    },
  ];

  for (const member of teamMembers) {
    await prisma.teamMember.create({ data: member });
  }
  console.log('Team members seeded');

  // Seed Company Stats
  const companyStats = [
    { title: 'Years Experience', value: '10+', icon: 'Calendar', order: 1 },
    { title: 'Happy Clients', value: '5000+', icon: 'Users', order: 2 },
    { title: 'Team Members', value: '50+', icon: 'UserCheck', order: 3 },
    { title: 'Services Completed', value: '25000+', icon: 'CheckCircle', order: 4 },
  ];

  for (const stat of companyStats) {
    await prisma.companyStat.create({ data: stat });
  }
  console.log('Company stats seeded');

  // Seed FAQ
  const faqs = [
    {
      question: 'Apa saja layanan yang ditawarkan NingClean?',
      answer: 'NingClean menawarkan berbagai layanan cleaning termasuk General Cleaning, Deep Cleaning, Office Cleaning, dan layanan khusus lainnya.',
      category: 'General',
      order: 1,
    },
    {
      question: 'Berapa harga layanan cleaning?',
      answer: 'Harga bervariasi tergantung jenis layanan dan luas area. Silakan hubungi kami untuk penawaran terbaik.',
      category: 'Pricing',
      order: 1,
    },
    {
      question: 'Bagaimana cara membooking jadwal?',
      answer: 'Anda dapat membooking melalui website kami atau menghubungi customer service di nomor yang tersedia.',
      category: 'Booking',
      order: 1,
    },
    {
      question: 'Apakah tersedia layanan weekend?',
      answer: 'Ya, kami menyediakan layanan 7 hari seminggu termasuk weekend dan hari libur nasional.',
      category: 'Services',
      order: 1,
    },
  ];

  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq });
  }
  console.log('FAQ seeded');

  // Seed Service Areas
  const serviceAreas = [
    {
      city: 'Surabaya',
      slug: 'surabaya',
      region: 'Jawa Timur',
      description: 'Layanan cleaning profesional di Surabaya dan sekitarnya',
      coverage: [
        'Gubeng', 'Tegalsari', 'Dr. Sutomo', 'Tenggilis', 'Rungkut',
        'Wonokromo', 'Wiyunga', 'Sukolilo', 'Mulyorejo', 'Simo',
        'Tandes', 'Sukomanunggal', 'Asemrowo', 'Benowo', 'Pakal',
        'Lakarsantri', 'Pabean Cantian', 'Bubutan', 'Krembangan', 'Semampir',
        'Kota Surabaya', 'Sawahan', 'Genteng', 'Gubeng', 'Wonokromo',
        'Karangpilang', 'Lakarsantri', 'Rungkut', 'Wonocolo', 'Wiyunga',
        'Tenggilis Mejoyo', 'Babatan', 'Balongsari', 'Bangsri', ' Banyu URang',
      ],
      isActive: true,
      isFeatured: true,
    },
    {
      city: 'Sidoarjo',
      slug: 'sidoarjo',
      region: 'Jawa Timur',
      description: 'Layanan cleaning profesional di Sidoarjo dan sekitarnya',
      coverage: [
        'Sidoarjo', 'Tanggulangin', 'Candi', 'Tulangan', 'Krembung',
        'Porong', 'Kedungbendo', 'Ketapang', 'Krian', 'Balongbendo',
        'Waru', 'Sedati', 'Gedangan', 'Budi', 'Jabon', 'Kasek',
        'Panggreh', 'Jenggala', 'Kemang', 'Manukan', 'Buluk Batur',
      ],
      isActive: true,
      isFeatured: true,
    },
    {
      city: 'Gresik',
      slug: 'gresik',
      region: 'Jawa Timur',
      description: 'Layanan cleaning profesional di Gresik dan sekitarnya',
      coverage: [
        'Gresik Kota', 'Duduk Sampeyan', 'Kebomas', 'Cerme', 'Benjeng',
        'Menganti', 'Kawasan Industri KIEC', 'Kawasan Industri Kuwait', 'Bungah',
        'Dukunttg', 'Sidayu', 'Dumljaya', 'Ganting', 'Kramat', 'Gulomantung',
      ],
      isActive: true,
      isFeatured: true,
    },
  ];

  for (const area of serviceAreas) {
    await prisma.serviceArea.create({ data: area });
  }
  console.log('Service areas seeded');

  // Seed Gallery Items
  const galleryItems = [
    {
      title: 'Residential Deep Cleaning',
      description: 'Hasil pembersihan mendalam di rumah client',
      category: 'Residential',
      imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
      location: 'Jakarta Selatan',
      isActive: true,
      isFeatured: true,
      order: 1,
    },
    {
      title: 'Office Space Sanitization',
      description: 'Pembersihan dan sanitasi ruang kantor modern',
      category: 'Commercial',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      location: 'Jakarta Barat',
      isActive: true,
      isFeatured: true,
      order: 2,
    },
    {
      title: 'Carpet & Upholstery Cleaning',
      description: 'Pembersihan karpet dan furniture dengan teknik profesional',
      category: 'Deep Cleaning',
      imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800',
      location: 'Bandung',
      isActive: true,
      isFeatured: false,
      order: 3,
    },
  ];

  for (const item of galleryItems) {
    await prisma.galleryItem.create({ data: item });
  }
  console.log('Gallery items seeded');

  // Seed Pricing Plans
  const pricingPlans = [
    {
      name: 'Basic',
      slug: 'basic',
      description: 'Ideal untuk perawatan rutin rumah atau apartemen kecil',
      price: 250000,
      billingCycle: 'one-time',
      features: ['2 Hours Service', 'General Cleaning', '2 Cleaners', 'Basic Equipment'],
      isActive: true,
      order: 1,
    },
    {
      name: 'Premium',
      slug: 'premium',
      description: 'Solusi lengkap untuk deep cleaning rumah atau kantor',
      price: 500000,
      billingCycle: 'one-time',
      features: ['4 Hours Service', 'Deep Cleaning', '3 Cleaners', 'Premium Equipment', 'Disinfection'],
      isPopular: true,
      isActive: true,
      order: 2,
    },
    {
      name: 'Enterprise',
      slug: 'enterprise',
      description: 'Solusi cleaning kustom untuk bisnis dan gedung besar',
      price: 1500000,
      billingCycle: 'monthly',
      features: ['Weekly Service', 'Full Building', 'Dedicated Team', 'Premium Equipment', 'Priority Support'],
      isActive: true,
      order: 3,
    },
  ];

  for (const plan of pricingPlans) {
    await prisma.pricingPlan.create({ data: plan });
  }
  console.log('Pricing plans seeded');

  // Seed Job Listings
  const jobListings = [
    {
      title: 'Cleaning Staff',
      department: 'Operations',
      location: 'Jakarta',
      type: 'Full-time',
      description: 'Bertanggung jawab untuk melakukan pembersihan di lokasi client dengan standar profesional.',
      requirements: ['Pengalaman cleaning minimal 1 tahun', 'Rajin dan teliti', 'Bisa bekerja sama tim'],
      benefits: ['Gaji kompetitif', 'Asuransi kesehatan', 'Pelatihan gratis'],
      salaryRange: 'Rp 3.500.000 - 5.000.000',
      isActive: true,
    },
    {
      title: 'Supervisor Cleaning',
      department: 'Operations',
      location: 'Jakarta',
      type: 'Full-time',
      description: 'Memimpin tim cleaning dan memastikan kualitas layanan terbaik.',
      requirements: ['Pengalaman 2+ tahun di bidang cleaning', 'Kemampuan leadership', 'Memiliki SIM'],
      benefits: ['Gaji kompetitif', 'Bonus kinerja', 'Asuransi kesehatan', 'Pelatihan manajemen'],
      salaryRange: 'Rp 5.000.000 - 7.000.000',
      isActive: true,
    },
    {
      title: 'Customer Service',
      department: 'Customer Relations',
      location: 'Jakarta',
      type: 'Full-time',
      description: 'Menangani inquiry dan booking dari customer dengan ramah dan profesional.',
      requirements: ['Pengalaman CS minimal 1 tahun', 'Komunikasi yang baik', 'Familiar dengan komputer'],
      benefits: ['Gaji kompetitif', 'Bonus kinerja', 'Asuransi kesehatan'],
      salaryRange: 'Rp 4.000.000 - 6.000.000',
      isActive: true,
    },
  ];

  for (const job of jobListings) {
    await prisma.jobListing.create({ data: job });
  }
  console.log('Job listings seeded');

  console.log('\n✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
