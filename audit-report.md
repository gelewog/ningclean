# NingClean Audit Report
Generated: 2026-04-06

## Summary

| Status | Count |
|--------|-------|
| ✅ Fixed | 7 |
| 🔴 Critical - Not Fixed | 6 |
| 🟡 Medium - Not Fixed | 3 |

---

## 🔴 CRITICAL ISSUES (Not Fixed Yet)

### 1. Navigation — All hardcoded (Admin → Web: BROKEN)
- **File**: `apps/web/src/components/navigation/Navigation.tsx`
- **Problem**: navLinks, logo, CTA button all hardcoded. Admin navigation settings completely ignored.
- **Impact**: Editing Navigation in admin panel has ZERO effect on website.
- **Fix needed**: Fetch from `/navigation-settings` API, render links dynamically from `navLinks` array. Add CTA text/link from settings.

### 2. Footer — All hardcoded (Admin → Web: BROKEN)
- **File**: `apps/web/src/components/footer/Footer.tsx`
- **Problem**: All footer links, contact info, social links, newsletter text hardcoded. Admin footer settings ignored.
- **Impact**: Footer settings in admin do nothing.
- **Fix needed**: Fetch from `/footer-settings` API. Render `footerColumns`, `socialLinks`, `contactInfo` dynamically.

### 3. HeroSection — All hardcoded (Admin → Web: BROKEN)
- **File**: `apps/web/src/components/sections/HeroSection.tsx`
- **Problem**: Badge text, headline, subheadline, CTA buttons, stats numbers, before/after slides ALL hardcoded.
- **Impact**: HomepageSettings hero section in admin does nothing.
- **Fix needed**: Fetch from `/homepage-settings` API. Use `heroBadge`, `heroHeadline`, `heroSubheadline`, `stats*`, `beforeAfterSlides`, `ctaPrimaryText`, `ctaSecondaryText`.

### 4. Homepage does NOT read HomepageSettings
- **File**: `apps/web/src/app/page.tsx`
- **Problem**: Homepage never fetches `/homepage-settings`. Doesn't pass section visibility flags to section components.
- **Impact**: `showFeaturesSection`, `showTestimonialsSection`, etc. toggles in admin have zero effect.
- **Fix needed**: Fetch homepage settings, conditionally render sections based on visibility flags.

### 5. SiteSettings GET was auth-protected (FIXED)
- **File**: `apps/api/src/site-settings/site-settings.controller.ts`
- **Problem**: `@UseGuards` was on controller level, blocking public GET.
- **Status**: ✅ FIXED — moved guards to PUT only.

### 6. No Settings API in web app
- **File**: `apps/web/src/lib/api.ts`
- **Problem**: No functions to fetch site-settings, homepage-settings, navigation-settings, footer-settings from web app.
- **Impact**: Even if components were fixed, there's no API client functions to call them.
- **Fix needed**: Add `getSiteSettings()`, `getHomepageSettings()`, `getNavigationSettings()`, `getFooterSettings()` to web's api.ts.

---

## 🟡 MEDIUM ISSUES (Not Fixed Yet)

### 7. Blog: Admin creates post without `isPublished` field
- **Files**: `apps/api/src/blog/blog.service.ts`, admin blog form
- **Problem**: Blog `create` doesn't set `isPublished = true` by default, and the admin blog page may not handle the field properly. Web only shows `publishedAt` posts.
- **Fix needed**: Ensure admin blog form has isPublished toggle. Update BlogService.create to default isPublished to true.

### 8. Blog: Admin create/edit doesn't handle `category` relation
- **Problem**: When creating a blog post, admin sends `category` as string but Prisma expects `categoryId` or nested create.
- **Fix needed**: Check blog DTO and admin form to ensure proper category handling.

### 9. Services in Admin use `image` but API might expect different field
- **Problem**: Need to verify that `service.image` in admin matches the Service type in web.
- **Status**: Need verification.

---

## ✅ FIXED ISSUES

### 1. TestimonialsSection — Now uses API prop
- **Files**: `TestimonialsSection.tsx`, `page.tsx`
- **Fix**: Removed hardcoded `featured` + `reviews` arrays. Now accepts `testimonials` prop. Falls back to static data only when API returns empty.

### 2. ImageShowcase — Now uses API prop
- **Files**: `ImageShowcase.tsx`, `page.tsx`
- **Fix**: Added `galleryItems` prop. Added `getGalleryItems()` fetch in page.tsx. Falls back to static images only when API empty.

### 3. AreasSection — Now uses API prop
- **Files**: `AreasSection.tsx`, `page.tsx`
- **Fix**: Added `serviceAreas` prop. Added `getServiceAreas()` fetch in page.tsx. Falls back to static cities only when API empty.

### 4. Testimonial Type — Fixed field names
- **File**: `apps/web/src/types/api.ts`
- **Fix**: Changed `comment` → `content`, added `role`, `company`, `isActive`, `isFeatured`, `service?` to match actual API response.

### 5. BlogService.findAll — Now includes category
- **File**: `apps/api/src/blog/blog.service.ts`
- **Fix**: Added `category: true` to Prisma select query.

### 6. SiteSettings GET — Made public
- **File**: `apps/api/src/site-settings/site-settings.controller.ts`
- **Fix**: Removed `@UseGuards` from controller, moved guards only to `@Put()` endpoint.

### 7. Homepage page.tsx — Now fetches gallery + areas
- **File**: `apps/web/src/app/page.tsx`
- **Fix**: Added `getGalleryItems()` and `getServiceAreas()` to Promise.all, pass as props.

---

## 🟢 WORKING CORRECTLY (No Action Needed)

- **Services API** — `/services` public GET, `/services/:id` public. ✅
- **Blog API** — `/blog` public GET. ✅
- **Gallery API** — `/gallery` public GET. ✅
- **Testimonials API** — `/testimonials` public GET, admin endpoints protected. ✅
- **Service Areas API** — `/service-areas` public GET. ✅
- **Bookings API** — POST public for customers. ✅
- **Web Services Page** — fetches from API, filters, sorts correctly. ✅
- **Web Blog Page** — fetches from API with pagination. ✅
- **Web Gallery Page** — fetches from API with category filter. ✅
- **ServicesSection** — already uses API data via `services` prop. ✅
- **BlogSection** — uses `posts` prop from page.tsx which fetches API. ✅

---

## Priority Order for Remaining Fixes

1. **Add settings API functions to web app** (`api.ts`) — prerequisite for everything below
2. **Fix Navigation** — fetch navigation settings, render dynamic links
3. **Fix Footer** — fetch footer settings, render dynamic columns/socials
4. **Fix HeroSection** — fetch homepage settings hero data
5. **Fix Homepage page.tsx** — fetch homepage settings, handle section visibility
6. **Fix Blog admin** — ensure isPublished and category handling
