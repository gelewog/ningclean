# Blog Page Redesign - Design Specification

**Date:** 2026-04-16  
**Author:** Claude  
**Status:** Approved

---

## 1. Layout Architecture

### Desktop Layout (>1024px)

```
┌─────────────────────────────────────────────────────────────────┐
│  Navigation (fixed top)                                          │
├──────────────┬──────────────────────────────────────────────────┤
│              │  BlogHeroSection                                  │
│   SIDEBAR    │  (title, subtitle, search bar)                     │
│   (280px)    ├──────────────────────────────────────────────────┤
│   sticky     │  View Toggle + Sort (top bar)                     │
│              │  ───────────────────────────────────────────────  │
│  - Categories│  GRID VIEW (default)                             │
│  - Archives  │  ┌─────┐ ┌─────┐ ┌─────┐                       │
│  - Tags      │  │Card │ │Card │ │Card │                       │
│  - Recent    │  └─────┘ └─────┘ └─────┘                       │
│              │  ┌─────┐ ┌─────┐ ┌─────┐                       │
│              │  │Card │ │Card │ │Card │                       │
│              │  └─────┘ └─────┘ └─────┘                       │
│              │  Load More                                       │
└──────────────┴──────────────────────────────────────────────────┘
```

### Mobile Layout (<1024px)

```
┌─────────────────────────────────┐
│  Navigation (fixed)              │
├─────────────────────────────────┤
│  BlogHeroSection (compact)       │
│  Search Bar                      │
├─────────────────────────────────┤
│  TABS (Categories) ← bottom      │
│  sheet / horizontal scroll       │
├─────────────────────────────────┤
│  GRID VIEW (2 column)            │
│  ┌─────┐ ┌─────┐                │
│  │Card │ │Card │                │
│  └─────┘ └─────┘                │
│  ┌─────┐ ┌─────┐                │
│  │Card │ │Card │                │
│  └─────┘ └─────┘                │
└─────────────────────────────────┘
```

### Color Palette

- **Dark Mode Background:** `#0a0a0f`
- **Dark Mode Cards:** `white/[0.03]` with `white/[0.08]` border
- **Light Mode Background:** `slate-50`
- **Light Mode Cards:** `white` with `slate-200` border
- **Accent:** Emerald-500 for primary actions, Blue for secondary
- **Ambient Glow:** Emerald glow in hero section

---

## 2. Components & States

### A. Sidebar Components

#### 1. CategoryFilter Widget
- Title: "Kategori" dengan icon
- Items: Semua, Deep Cleaning, Renovasi, Tips, dll
- States:
  - Default: text-slate-500 dark:text-slate-400
  - Hover: bg-emerald-500/10, text-emerald-600
  - Active/Selected: bg-emerald-500 text-white
- Behavior: Click → filter main content

#### 2. Archives Widget
- Title: "Arsip"
- Format: Grouped by year > month
- Example: "April 2026 (12)", "Maret 2026 (8)"
- States: Same pattern as categories

#### 3. Tags Cloud Widget
- Title: "Tags" dengan icon
- Layout: Word-wrap cloud, popular tags larger
- Max visible: ~15 tags dengan "Show more" option
- States:
  - Default: bg-slate-100 dark:bg-slate-800 text-slate-600
  - Hover: bg-emerald-500/10 text-emerald-600
  - Active: bg-emerald-500 text-white

#### 4. Recent Posts Widget
- Title: "Post Terbaru"
- Layout: Vertical list, 3-5 items
- Each item: Thumbnail (48x48) + Title + Date
- Card style: bg-white dark:bg-slate-900 rounded-xl

### B. Main Content Components

#### 1. View Toggle
```
┌─────────────────────────┐
│ [Grid] [List]          │  ← Toggle button group
└─────────────────────────┘
```
- Grid active: bg-emerald-500 text-white
- List active: bg-emerald-500 text-white
- Inactive: bg-slate-100 dark:bg-slate-800

#### 2. BlogCard - Grid View
- Cover Image: h-48, rounded-2xl with hover scale effect
- Tags: emerald badges
- Title: font-bold, group-hover:emerald, truncate 2 lines
- Excerpt: line-clamp-2
- Meta row: Author • 5 min • Date
- Bottom accent line on hover (scale-x animation)
- Frosted glass bg: white/[0.03] dark, border white/[0.08]
- Hover: shadow-xl, translate-y -1.5

#### 3. BlogCard - List View
- Horizontal layout: Thumbnail (80x80) left + Content right
- Title: single line truncate
- Excerpt: line-clamp-1
- Meta + "View →" link on right
- Hover: bg-emerald-500/5, shadow-sm

#### 4. Featured Card (First Item)
- Grid spans 2 columns on lg screens
- Larger image: h-64
- Larger title: text-xl lg:text-2xl
- Longer excerpt: 120 chars

### C. Loading & Empty States

#### Loading State
- Skeleton cards dengan pulse animation
- 6 skeleton cards (grid) atau 3 (list)
- Subtle shimmer effect

#### Empty State
- Illustration icon
- Text: "Belum ada artikel dalam kategori ini"
- CTA: "Lihat Semua Artikel" button

---

## 3. Interactions & Animations

### A. Page Load Animations

**Initial Load Sequence (staggered):**
1. Navigation fades in → 0ms
2. Sidebar slides in left → 100ms, ease-out
3. Hero section fades up → 200ms, ease-out
4. Cards stagger in → 400ms, staggerChildren 0.08s
   (each card: opacity 0→1, y 20→0)
5. Load More button fades in → after cards complete

**Card Animation:**
```typescript
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};
// Stagger delay: index * 0.06 seconds
```

### B. Hover Interactions

**BlogCard Hover:**
1. Card lifts up: translateY(-6px)
2. Shadow intensifies: shadow-sm → shadow-xl
3. Image scales: scale(1.05) over 700ms
4. Title color: slate → emerald
5. Bottom accent line: scaleX(0) → scaleX(1) from left
6. Overlay gradient: opacity 0 → 1

**Sidebar Widget Item Hover:**
1. Background: transparent → emerald-500/10
2. Text color: slate → emerald
3. 200ms transition

### C. View Mode Toggle Animation

**Grid ↔ List Switch:**
1. Current cards fade out: opacity 1→0, scale 0.95, 200ms
2. Layout changes
3. New view cards fade/scale in: staggered, 300ms total

### D. Sidebar Mobile Bottom Sheet

**Trigger:** Tap filter icon or scroll categories tab

**Open Animation:**
1. Backdrop fades in: 0→1, 300ms
2. Sheet slides up: y 100%→0, spring damping 30, stiffness 300
3. Handle bar appears at top

**Close Animation:**
1. Tap backdrop OR swipe down
2. Sheet slides down: y 0→100%, 300ms

**Swipe Gestures:**
- Swipe down on sheet → dismiss
- Sheet snaps to: 50% visible, 90% visible

---

## 4. Dark/Light Mode Support

### A. Theme Architecture

**Existing Theme System:**
- Uses Tailwind dark mode with class strategy
- html.dark class added/removed on toggle
- Theme saved to localStorage: 'ningclean-theme'

**Key Classes Used:**
- `dark .page-bg` → background
- `dark .page-text` → text color
- `dark .page-text-muted` → muted text
- `dark .page-card` → card backgrounds
- `dark .page-border` → border colors

### B. Blog Page Specific Dark Mode

**Sidebar Dark Mode:**
| Property | Light | Dark |
|----------|-------|------|
| Background | white | bg-slate-900/80 |
| Border | slate-200 | white/10 |
| Text Primary | slate-900 | white |
| Text Muted | slate-500 | white/50 |
| Widget Title | slate-700 | white/70 |
| Divider | slate-200 | white/10 |

**Card Dark Mode:**
| Property | Light | Dark |
|----------|-------|------|
| Background | white | bg-slate-900/80 |
| Border | slate-200 | white/10 |
| Shadow | shadow-sm | shadow-black/20 |
| Hover Shadow | shadow-xl | shadow-emerald-900/20 |

### C. Glassmorphism in Dark Mode

**Sidebar Glass Effect:**
```css
/* Light mode */
background: white;
backdrop-filter: blur(12px);
border: 1px solid slate-200;

/* Dark mode */
background: rgba(15, 23, 42, 0.8);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.08);
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
```

---

## 5. Data & Technical Considerations

### A. API Integration

**Endpoint:**
```
GET /api/blogposts
Query params:
  - page: number (default 1)
  - limit: number (default 9)
  - category: string (optional)
  - search: string (optional)
  - archive: string YYYY-MM (optional)
  - tags: string[] (optional)
```

**Response Shape:**
```typescript
interface PaginatedBlogPosts {
  data: BlogPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

**Fallback:** `mockBlogPosts` from `@/lib/mock/services`

### B. Sidebar Data

**Categories:** Derived from all posts' categories or fetch from API

**Archives:** Group posts by YYYY-MM

**Tags:** All unique tags from posts (max ~15 visible)

**Recent Posts:** Latest 5 posts

### C. State Management

```typescript
interface BlogPageState {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  
  // Filters
  viewMode: 'grid' | 'list';
  activeCategory: string;
  activeTags: string[];
  activeArchive: string | null;
  searchQuery: string;
  
  // Sidebar
  categories: string[];
  archives: Record<string, number>;
  tags: string[];
}
```

### D. Component File Structure

```
apps/web/src/
├── app/blog/
│   ├── page.tsx              # Main blog page
│   ├── loading.tsx          # Loading skeleton
│   └── metadata.ts
├── components/
│   ├── sections/
│   │   ├── BlogHeroSection.tsx    # Already exists
│   │   ├── BlogListSection.tsx    # Refactor for new layout
│   │   └── BlogSidebar.tsx       # NEW - sidebar widget container
│   ├── cards/
│   │   └── BlogCard.tsx           # Refactor for grid/list variants
│   ├── blog/                      # NEW - blog-specific components
│   │   ├── SidebarWidget.tsx       # Category, Archive, Tags, Recent
│   │   ├── ViewToggle.tsx         # Grid/List toggle
│   │   ├── BlogGrid.tsx           # Grid container
│   │   ├── BlogList.tsx           # List container
│   │   ├── BlogCardSkeleton.tsx   # Loading skeleton
│   │   └── MobileFilterSheet.tsx  # Bottom sheet for mobile
│   └── ui/
│       └── Badge.tsx               # Already exists
└── lib/
    └── mock/
        └── services.ts             # mockBlogPosts (fallback)
```

### E. Key Implementation Notes

1. **Sidebar Sticky:** CSS `position: sticky, top: 100px`
2. **Category Filter URL Sync:** Shallow routing for shareable URLs
3. **Infinite Scroll vs Load More:** Keep existing Load More button
4. **Mobile Bottom Sheet:** Framer Motion with gesture handling
5. **Featured Post:** First post (index === 0) spans 2 columns in grid

---

## Summary

This design transforms the blog page from a simple grid layout to a professional magazine-style layout with:
- **Sticky sidebar** on desktop with Category, Archive, Tags, and Recent Posts widgets
- **Bottom sheet** on mobile for filter access
- **Toggle between Grid and List views**
- **Glassmorphism aesthetic** matching the services page design
- **Full dark/light mode support**
- **Smooth animations** and micro-interactions
- **Full API integration** with mock data fallback