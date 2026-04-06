# NingClean Audit Report
Generated: 2026-04-06 | Updated: 2026-04-06 (post-fix commit af6bdb8)

## Summary

| Status | Count |
|--------|-------|
| ✅ FIXED | 13 |
| 🟡 Remaining | 2 |

---

## ✅ FIXED (Commit af6bdb8)

### 1. TestimonialsSection — Now uses API prop
- **Files**: `apps/web/src/components/sections/TestimonialsSection.tsx`, `apps/web/src/app/page.tsx`
- **Fix**: Removed hardcoded `featured` + `reviews` arrays. Component now accepts `testimonials` prop. Falls back to static data when API returns empty.

### 2. ImageShowcase — Now uses API prop
- **Files**: `apps/web/src/components/sections/ImageShowcase.tsx`, `apps/web/src/app/page.tsx`
- **Fix**: Added `galleryItems` prop. `page.tsx` fetches `getGalleryItems()`. Falls back to static images when API empty.

### 3. AreasSection — Now uses API prop
- **Files**: `apps/web/src/components/sections/AreasSection.tsx`, `apps/web/src/app/page.tsx`
- **Fix**: Added `serviceAreas` prop. `page.tsx` fetches `getServiceAreas()`. Falls back to static cities when API empty.

### 4. HeroSection — Now uses homepage settings API
- **Files**: `apps/web/src/components/sections/HeroSection.tsx`, `apps/web/src/app/page.tsx`
- **Fix**: Accepts `badge`, `headline`, `subheadline`, `ctaPrimaryText`, `ctaPrimaryLink`, `ctaSecondaryText`, `ctaSecondaryLink`, `stats`, `beforeAfterSlides` props. Page.tsx passes values from `/homepage-settings` API.

### 5. Navigation — Now uses navigation-settings API
- **File**: `apps/web/src/components/navigation/Navigation.tsx`
- **Fix**: Fetches `getNavigationSettings()` on mount. Renders `navLinks` dynamically (sorted by `order`, filtered by `isActive`). CTA button text/link from settings. Falls back to default links.

### 6. Footer — Now uses footer-settings API
- **File**: `apps/web/src/components/footer/Footer.tsx`
- **Fix**: Fetches `getFooterSettings()` on mount. Renders `footerColumns`, `socialLinks`, `contactInfo` dynamically. Supports show/hide for newsletter, socials, contact, status badge. Falls back to static defaults.

### 7. Homepage page.tsx — Fetches homepage settings
- **File**: `apps/web/src/app/page.tsx`
- **Fix**: Now fetches `getHomepageSettings()` alongside other data. Controls section visibility via `showFeaturesSection`, `showServicesSection`, etc. Passes all hero props to HeroSection.

### 8. SiteSettings GET — Made public (was auth-protected bug)
- **File**: `apps/api/src/site-settings/site-settings.controller.ts`
- **Fix**: Removed `@UseGuards` from controller class. Guards now only on `@Put()` endpoint. Public GET allows web app to read site settings.

### 9. BlogService.findAll — Now includes category relation
- **File**: `apps/api/src/blog/blog.service.ts`
- **Fix**: Added `category: true` to Prisma select query. Web blog pages now show category name.

### 10. Testimonial Type — Fixed field names
- **File**: `apps/web/src/types/api.ts`
- **Fix**: Changed `comment` → `content`, added `role`, `company`, `isActive`, `isFeatured`, `service?`. Now matches actual API response shape.

### 11. Homepage page.tsx — Now fetches gallery + service areas
- **File**: `apps/web/src/app/page.tsx`
- **Fix**: Added `getGalleryItems()` and `getServiceAreas()` to Promise.all, pass as props to ImageShowcase and AreasSection.

### 12. web api.ts — Added settings API functions
- **File**: `apps/web/src/lib/api.ts`
- **Fix**: Added `getSiteSettings()`, `getHomepageSettings()`, `getNavigationSettings()`, `getFooterSettings()` for public consumption by web components.

### 13. ImageShowcase Type — Fixed GalleryItem interface
- **File**: `apps/web/src/components/sections/ImageShowcase.tsx`
- **Fix**: Added proper `GalleryItem` interface matching API response. `ComparisonCard` now uses `GalleryItem` type.

---

## 🟡 REMAINING ITEMS

### 1. Blog Admin — `isPublished` default handling
- **Files**: `apps/api/src/blog/blog.service.ts`, admin blog form
- **Issue**: When creating a blog post via admin, `isPublished` may not be set to `true` by default, causing posts not to appear on web's `/blog` page.
- **Needed**: Ensure `BlogService.create()` sets `isPublished = true` as default, and admin blog form has proper isPublished toggle.

### 2. Booking Flow — Needs end-to-end verification
- **Issue**: Haven't tested full flow: web booking form → API creates booking → admin sees booking → admin updates status → web sees updated status.
- **Needed**: Manual test of the complete booking lifecycle. Also check if `Booking` model fields match between admin forms and API.

---

## 🟢 WORKING CORRECTLY (No Action Needed)

- **Services API** — `/services` public GET, `/services/:id` public ✅
- **Blog API** — `/blog` public GET, slug and ID endpoints public ✅
- **Gallery API** — `/gallery` public GET with category filter ✅
- **Testimonials API** — `/testimonials` public GET ✅
- **Service Areas API** — `/service-areas` public GET ✅
- **Bookings API** — POST public for customers, GET for admin ✅
- **Web Services Page** — fetches from API, filters, sorts correctly ✅
- **Web Blog Page** — fetches from API with pagination, shows category ✅
- **Web Gallery Page** — fetches from API with category filter ✅
- **ServicesSection** — uses `services` prop from page.tsx ✅
- **BlogSection** — uses `posts` prop from page.tsx ✅
- **Homepage section visibility** — controlled by homepage settings flags ✅
