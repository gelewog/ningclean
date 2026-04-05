# Blueprint CRUD - NingClean Admin Management

## Executive Summary

Berdasarkan analisis menyeluruh terhadap aplikasi NingClean, berikut adalah laporan status CRUD dan rekomendasi pengembangan untuk manajemen admin.

---

## Status CRUD Saat Ini

### ✅ Sudah Berjalan (Database + API + Admin UI)

| Modul | Database | API | Admin UI | Keterangan |
|-------|----------|-----|----------|------------|
| **Services** | ✅ `services` table | ✅ Full CRUD | ✅ `/admin/services` | CRUD lengkap berjalan baik |
| **Blog** | ✅ `blog_posts` table | ✅ Full CRUD | ✅ `/admin/blog` | CRUD lengkap berjalan baik |
| **Bookings** | ✅ `bookings` table | ✅ Read/Update | ✅ `/admin/bookings` | Manajemen booking aktif |
| **Users** | ✅ `users` table | ✅ CRUD | ✅ `/admin/users` | Manajemen pengguna |

---

## Halaman Web yang Memerlukan Admin CRUD

### 🔴 PRIORITAS TINGGI - Masih Hardcoded/Static

| Halaman Web | Konten Saat Ini | Model DB yang Perlu Dibuat | Prioritas |
|-------------|-----------------|---------------------------|-----------|
| `/about` | Team members, Company stats | `TeamMember`, `CompanyStat` | 🔴 Tinggi |
| `/gallery` | Gallery/portfolio items | `GalleryItem` | 🔴 Tinggi |
| `/faq` | FAQ items | `FAQ` | 🔴 Tinggi |
| `/area/[city]` | Service areas/cities | `ServiceArea` | 🔴 Tinggi |
| `/career` | Job listings | `Career` / `JobListing` | 🟡 Medium |
| `/pricing` | Pricing plans | `PricingPlan` | 🟡 Medium |
| `/` (Home) | Testimonials | `Testimonial` | 🟡 Medium |

---

## Model Database yang Perlu Dibuat

### 1. TeamMember (Team Management)
```prisma
model TeamMember {
  id          String   @id @default(uuid())
  name        String
  position    String
  department  String   // e.g., "Cleaning", "Management", "Support"
  bio         String?  @db.Text
  avatar      String?  // Image URL
  email       String?
  phone       String?
  isActive    Boolean  @default(true)
  order       Int      @default(0) // Display order
  socialLinks Json?    // { linkedin, twitter, facebook }
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 2. CompanyStat (About Page Stats)
```prisma
model CompanyStat {
  id          String   @id @default(uuid())
  title       String   // e.g., "Years Experience", "Happy Clients"
  value       String   // e.g., "10+", "5000+"
  description String?
  icon        String?  // Lucide icon name
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 3. GalleryItem (Portfolio Gallery)
```prisma
model GalleryItem {
  id          String   @id @default(uuid())
  title       String
  description String?  @db.Text
  category    String   // e.g., "Residential", "Commercial", "Deep Cleaning"
  imageUrl    String
  beforeImage String?  // Optional before/after
  afterImage  String?  // Optional before/after
  location    String?  // Where the work was done
  serviceId   String?  // Link to related service
  isFeatured  Boolean  @default(false)
  isActive    Boolean  @default(true)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  service     Service? @relation(fields: [serviceId], references: [id])
}
```

### 4. FAQ (Frequently Asked Questions)
```prisma
model FAQ {
  id          String   @id @default(uuid())
  question    String
  answer      String   @db.Text
  category    String   // e.g., "General", "Services", "Pricing", "Booking"
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 5. ServiceArea (Coverage Areas)
```prisma
model ServiceArea {
  id          String   @id @default(uuid())
  city        String
  slug        String   @unique
  region      String   // Province/State
  description String?  @db.Text
  postalCodes String[] // Array of postal codes
  isActive    Boolean  @default(true)
  isFeatured  Boolean  @default(false)
  image       String?  // City image
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 6. Career / JobListing (Job Openings)
```prisma
model JobListing {
  id           String   @id @default(uuid())
  title        String
  department   String
  location     String
  type         String   // "Full-time", "Part-time", "Contract"
  description  String   @db.Text
  requirements String[] // Array of requirements
  benefits     String[] // Array of benefits
  salaryRange  String?  // e.g., "Rp 5.000.000 - 8.000.000"
  isActive     Boolean  @default(true)
  expiresAt    DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### 7. PricingPlan (Pricing Tiers)
```prisma
model PricingPlan {
  id           String   @id @default(uuid())
  name         String   // e.g., "Basic", "Premium", "Enterprise"
  slug         String   @unique
  description  String
  price        Decimal  @db.Decimal(10, 2)
  billingCycle String   // "monthly", "one-time", "yearly"
  features     String[] // Array of features
  isPopular    Boolean  @default(false)
  isActive     Boolean  @default(true)
  order        Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### 8. Testimonial (Customer Reviews)
```prisma
model Testimonial {
  id        String   @id @default(uuid())
  name      String
  role      String?  // e.g., "Homeowner", "Business Owner"
  company   String?
  content   String   @db.Text
  rating    Int      @default(5) // 1-5 stars
  avatar    String?
  isActive  Boolean  @default(true)
  isFeatured Boolean @default(false)
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## API Endpoints yang Perlu Dibuat

### Backend (apps/api/src)

```
# Team Management
GET    /team-members
GET    /team-members/:id
POST   /team-members       (Admin only)
PUT    /team-members/:id   (Admin only)
DELETE /team-members/:id   (Admin only)

# Company Stats
GET    /company-stats
POST   /company-stats      (Admin only)
PUT    /company-stats/:id  (Admin only)
DELETE /company-stats/:id  (Admin only)

# Gallery
GET    /gallery
GET    /gallery/:id
GET    /gallery/category/:category
POST   /gallery            (Admin only)
PUT    /gallery/:id        (Admin only)
DELETE /gallery/:id        (Admin only)

# FAQ
GET    /faq
GET    /faq/category/:category
POST   /faq                (Admin only)
PUT    /faq/:id            (Admin only)
DELETE /faq/:id            (Admin only)

# Service Areas
GET    /service-areas
GET    /service-areas/:slug
POST   /service-areas      (Admin only)
PUT    /service-areas/:id  (Admin only)
DELETE /service-areas/:id  (Admin only)

# Careers
GET    /careers            (Public - active only)
GET    /careers/:id
POST   /careers            (Admin only)
PUT    /careers/:id        (Admin only)
DELETE /careers/:id        (Admin only)

# Pricing Plans
GET    /pricing-plans
POST   /pricing-plans      (Admin only)
PUT    /pricing-plans/:id  (Admin only)
DELETE /pricing-plans/:id  (Admin only)

# Testimonials
GET    /testimonials
POST   /testimonials       (Admin only)
PUT    /testimonials/:id   (Admin only)
DELETE /testimonials/:id   (Admin only)
```

---

## Admin UI Pages yang Perlu Dibuat

### Dashboard Menu Structure

```
📊 Dashboard
├── 🏠 Home
├── 📋 Content Management
│   ├── Services      ✅ Sudah ada
│   ├── Blog Posts    ✅ Sudah ada
│   ├── 📁 Gallery    [BARU]
│   ├── 👥 Team Members [BARU]
│   ├── 📈 Company Stats [BARU]
│   ├── 💬 Testimonials [BARU]
│   ├── ❓ FAQ        [BARU]
│   └── 🏙️ Service Areas [BARU]
├── 🛒 Bookings       ✅ Sudah ada
├── 💼 Careers        [BARU]
├── 💵 Pricing Plans  [BARU]
└── 👤 Users          ✅ Sudah ada
```

---

## Implementasi Checklist

### Phase 1: Database & API (Prioritas Tinggi) ✅ COMPLETED
- [x] Update `prisma/schema.prisma` dengan model baru (8 models: TeamMember, CompanyStat, GalleryItem, FAQ, ServiceArea, JobListing, PricingPlan, Testimonial)
- [x] Generate Prisma Client: `npx prisma generate`
- [x] Buat seed data lengkap untuk testing
- [x] Implement API controllers untuk setiap modul:
  - [x] Team Members: `GET/POST/PUT/DELETE /team-members` (admin protected)
  - [x] Company Stats: `GET/POST/PUT/DELETE /company-stats` (admin protected)
  - [x] Gallery: `GET/POST/PUT/DELETE /gallery` (admin protected)
  - [x] FAQ: `GET/POST/PUT/DELETE /faq` (admin protected)
  - [x] Service Areas: `GET/POST/PUT/DELETE /service-areas` (admin protected)
  - [x] Job Listings: `GET/POST/PUT/DELETE /careers` (admin protected)
  - [x] Pricing Plans: `GET/POST/PUT/DELETE /pricing-plans` (admin protected)
  - [x] Testimonials: `GET/POST/PUT/DELETE /testimonials` (admin protected)
- [x] Add authentication guards (JWT + RolesGuard) untuk admin routes
- [x] Update `app.module.ts` dengan semua modul baru

### Phase 2: Admin UI Pages (Prioritas Tinggi) ✅ COMPLETED
- [x] `/admin/team` - Team members CRUD
- [x] `/admin/gallery` - Gallery CRUD
- [x] `/admin/faq` - FAQ CRUD
- [x] `/admin/areas` - Service areas CRUD
- [x] `/admin/careers` - Job listings CRUD
- [x] `/admin/pricing` - Pricing plans CRUD
- [x] `/admin/testimonials` - Testimonials CRUD

### Phase 3: Frontend Integration (Prioritas Tinggi) ✅ COMPLETED
- [x] Update `/gallery` page - fetch from API
- [x] Update `/faq` page - fetch from API
- [x] Update `/area/[city]` page - fetch from API

### Phase 4: Extended Features (Prioritas Medium) ✅ COMPLETED
- [x] `/admin/careers` - Job listings CRUD
- [x] `/admin/pricing` - Pricing plans CRUD
- [x] `/admin/testimonials` - Testimonials CRUD
- [x] Update `/career` page - fetch from API
- [x] Update `/pricing` page - fetch from API
- [x] Update homepage testimonials section

---

## Ringkasan Database Schema Update

### Models Baru (8 models)
1. ✅ `TeamMember`
2. ✅ `CompanyStat`
3. ✅ `GalleryItem`
4. ✅ `FAQ`
5. ✅ `ServiceArea`
6. ✅ `JobListing`
7. ✅ `PricingPlan`
8. ✅ `Testimonial`

### Existing Models (Tidak perlu modifikasi)
- ✅ `User`
- ✅ `Service`
- ✅ `BlogPost`
- ✅ `Booking`
- ✅ `BookingItem`

---

## Estimasi Waktu Pengembangan

| Phase | Estimasi | Task Utama |
|-------|----------|------------|
| Phase 1 | 2-3 hari | Database + API endpoints |
| Phase 2 | 3-4 hari | Admin UI pages |
| Phase 3 | 2-3 hari | Frontend integration |
| Phase 4 | 2-3 hari | Extended features |
| **Total** | **9-13 hari** | Full implementation |

---

## Catatan Penting

1. **Image Upload**: Semua model dengan image perlu integration dengan image upload service (Supabase Storage)

2. **SEO Considerations**: 
   - `ServiceArea` dan `BlogPost` sudah memiliki slug fields
   - Pastikan setiap content page memiliki meta tags dinamis

3. **Caching Strategy**: Implement caching untuk public API endpoints (services, gallery, FAQ) menggunakan Redis atau CDN

4. **Soft Delete**: Pertimbangkan soft delete untuk content yang penting (gunakan `deletedAt` field)

---

*Generated: 4 Maret 2026*
*Status: Services & Blog CRUD sudah berjalan dengan baik*
