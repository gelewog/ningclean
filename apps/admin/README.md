# Ningclean Admin Dashboard

Modern and professional admin dashboard for Ningclean cleaning services built with Next.js 14, Tailwind CSS, and Framer Motion.

## Features

### Pages

- **Dashboard** (`/admin`) - Overview with statistics, recent bookings, quick actions, and alerts
- **Bookings** (`/admin/bookings`) - Manage all bookings with filters, search, and status updates
- **Services** (`/admin/services`) - CRUD operations for cleaning services
- **Customers** (`/admin/customers`) - Customer list with order history
- **Blog** (`/admin/blog`) - Blog post management with rich text support
- **Settings** (`/admin/settings`) - Profile and password management

### Components

- **Sidebar** - Collapsible navigation with Framer Motion animations
- **Header** - Search bar and notification bell
- **DataTable** - Sortable, filterable data tables with pagination
- **StatCard** - Statistics cards with trend indicators
- **Modal** - Slide-up modal with animations
- **Pagination** - Animated pagination component
- **Form Components** - Input, Select, Textarea with validation
- **Toast Notifications** - Using Sonner for beautiful toasts

### Design System

- **Colors:**
  - Primary Blue: `#2563EB`
  - Secondary: `#1E40AF`
  - Accent: `#F59E0B`
  - Success: `#10B981`
  - Warning: `#F59E0B`
  - Error: `#EF4444`
  - Background: `#F8FAFC`
  - Sidebar: `#1E293B`

- **Font:** Inter (Google Fonts)

### Animations (Framer Motion)

- Sidebar collapse animation
- Page transition animations
- Table row hover effects
- Modal slide-up animation
- Staggered list animations
- Button hover/click feedback

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
apps/admin/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── bookings/
│   │   │   ├── blog/
│   │   │   ├── customers/
│   │   │   ├── services/
│   │   │   ├── settings/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── StatCard.tsx
│   │   └── ui/
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       ├── skeleton.tsx
│   │       ├── table.tsx
│   │       └── textarea.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## API Integration

The admin dashboard is configured to work with a NestJS backend API. The API endpoints are defined in `src/lib/api.ts`.

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Authentication

JWT authentication is expected. The token should be stored in localStorage and sent with each request via the Authorization header.

## Responsive Design

The dashboard is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## Notes

- This is a frontend-only admin dashboard
- Mock data is currently used for demonstration
- Connect to your NestJS backend by updating the API functions in `src/lib/api.ts`
