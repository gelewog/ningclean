# Ningclean - NestJS Backend

Jasa cleaning rumah API backend menggunakan NestJS + Prisma + PostgreSQL.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- pnpm / npm / yarn

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
```

Edit `.env` sesuai konfigurasi database kamu:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ningclean"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
```

### 3. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with sample data
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run start:dev
```

API akan running di `http://localhost:3000`
Swagger docs tersedia di `http://localhost:3000/api/docs`

## Default Users (After Seed)

| Role   | Email               | Password   |
|--------|---------------------|------------|
| Admin  | admin@ningclean.id  | admin123   |
| Customer | customer1@ningclean.id | cust123 |
| Customer | customer2@ningclean.id | cust123 |
| Customer | customer3@ningclean.id | cust123 |

## API Endpoints

### Authentication
- `POST /auth/register` - Register user baru
- `POST /auth/login` - Login user

### Services
- `GET /services` - List semua services (public)
- `GET /services/:id` - Get service by ID (public)
- `POST /services` - Create service (admin)
- `PUT /services/:id` - Update service (admin)
- `DELETE /services/:id` - Delete service (admin)

### Bookings
- `GET /bookings` - List bookings (customer: own, admin: all)
- `GET /bookings/:id` - Get booking by ID
- `POST /bookings` - Create booking (authenticated)
- `PUT /bookings/:id/status` - Update booking status (admin)

### Blog
- `GET /blog` - List semua blog posts (public)
- `GET /blog/:slug` - Get blog post by slug (public)
- `POST /blog` - Create blog post (admin)
- `PUT /blog/:id` - Update blog post (admin)
- `DELETE /blog/:id` - Delete blog post (admin)

### Admin
- `GET /admin/stats` - Dashboard statistics (admin)

## Project Structure

```
ningclean/
├── apps/
│   └── api/                    # NestJS API application
│       └── src/
│           ├── auth/           # Authentication module
│           ├── services/       # Services module
│           ├── bookings/       # Bookings module
│           ├── blog/           # Blog module
│           ├── admin/          # Admin module
│           ├── prisma/         # Prisma service
│           └── common/         # Shared guards, decorators, dto
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed script
├── .env.example                # Environment template
└── README.md
```

## Supabase Integration

Project ini sudah siap untuk diintegrasikan dengan Supabase. Untuk menggunakan Supabase:

1. Install Supabase client: `npm install @supabase/supabase-js`
2. Tambahkan konfigurasi di `.env`:
   ```
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
3. Update Prisma datasource untuk menggunakan Supabase connection string

## License

MIT
