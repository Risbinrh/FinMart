# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**FreshCatch** (FinMart) is a fish e-commerce platform built for the Tamil Nadu region. It's a monorepo containing:
- **Backend**: Medusa.js v2.12 headless commerce (my-medusa-store/)
- **Frontend**: Next.js 16 storefront with React 19 (storefront/)

The platform features 83 fish varieties with Tamil language support, zone-based delivery with GPS tracking, and delivery slot management.

## Development Commands

### Backend (my-medusa-store/)
```bash
# Navigate to backend
cd my-medusa-store

# Install dependencies
yarn install

# Run development server (port 9000)
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Database migrations
npx medusa db:migrate

# Run seed script (fish products + categories)
npx medusa exec ./src/scripts/seed.ts

# Run zone seeding
npx medusa exec ./src/scripts/seed-zones.ts

# Create admin user
npx medusa user -e admin@email.com -p password

# Test commands
yarn test:unit                    # Unit tests
yarn test:integration:http        # HTTP integration tests
yarn test:integration:modules     # Module integration tests
```

### Frontend (storefront/)
```bash
# Navigate to frontend
cd storefront

# Install dependencies
npm install

# Run development server (port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Architecture Overview

### Backend Architecture
- **Framework**: Medusa.js 2.12 (Node.js 20+, TypeScript 5.x)
- **Database**: PostgreSQL 14+ (primary), Redis 7.x (cache/sessions)
- **ORM**: MikroORM with PostgreSQL adapter
- **API Structure**: RESTful APIs with `/store/*` (public) and `/admin/*` (protected)
- **Custom Modules**: Zone-based delivery system

### Frontend Architecture
- **Framework**: Next.js 16 with App Router
- **UI**: Tailwind CSS 4.x + shadcn/ui components
- **State**: React Context for cart & user state
- **API Communication**: Next.js API routes proxy to Medusa backend

### Key Custom Modules

#### Zone Module (my-medusa-store/src/modules/zone/)
Custom Medusa module for zone-based delivery:
- **Model**: `Zone` entity with geographic data
- **Service**: `ZoneModuleService` with Haversine distance calculation
- **API Routes**:
  - `POST /store/zones/check` - Check delivery zone by coordinates
  - `GET /store/zones` - List all zones
  - `GET /store/delivery-slots` - Get available delivery slots

Zone structure:
- Zone A: 0-5km, Free delivery, Min order ₹300
- Zone B: 5-10km, ₹30 delivery, Min order ₹400
- Zone C: 10-15km, ₹50 delivery, Min order ₹500
- Zone D: 15-25km, ₹80 delivery, Min order ₹700

#### Delivery Slots
Three time slots available:
- **Sunrise**: 6:00 AM - 8:00 AM (🌅)
- **Morning**: 8:00 AM - 12:00 PM (🌞)
- **Evening**: 4:00 PM - 7:00 PM (🌆)

### Database Schema

Key tables/extensions:
- `product` - Extended with `name_tamil`, `nutritional_info`
- `product_category` - Extended with `name_tamil`, `icon`, `sort_order`
- `zone` (custom) - Zone definitions with geographic boundaries
- Standard Medusa tables: `cart`, `order`, `customer`, `address`, etc.

### API Communication Pattern

The storefront uses an API proxy pattern to forward requests:
1. Frontend calls `/api/store/[...path]`
2. Next.js API route proxies to Medusa backend at `localhost:9000/store/[...path]`
3. Proxy automatically adds `x-publishable-api-key` header

This solves SSR/client-side API key management issues.

## Environment Configuration

### Backend (.env in my-medusa-store/)
```env
DATABASE_URL=postgres://user:password@localhost:5432/FinMart
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:9000
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
```

### Frontend (.env.local in storefront/)
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxxx...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here  # Optional, for geocoding
```

**Important**: The publishable API key must be generated via seeding or using admin API. Hardcoded fallback exists in `storefront/src/app/api/store/[...path]/route.ts` but should be replaced with real key.

## File Structure Patterns

### Backend API Routes
```
my-medusa-store/src/api/
├── admin/
│   └── custom/route.ts          # Admin-specific endpoints
└── store/
    ├── custom/route.ts          # Store-specific endpoints
    ├── zones/
    │   ├── route.ts             # GET /store/zones
    │   └── check/route.ts       # POST /store/zones/check
    └── delivery-slots/route.ts  # GET /store/delivery-slots
```

Each route exports HTTP method handlers (GET, POST, DELETE, etc.) that receive `MedusaRequest` and `MedusaResponse`.

### Frontend Pages
```
storefront/src/app/
├── page.tsx                     # Home page
├── products/
│   ├── page.tsx                 # Product listing
│   └── [id]/page.tsx            # Product detail
├── cart/page.tsx                # Shopping cart
├── checkout/page.tsx            # Checkout flow
├── orders/
│   ├── page.tsx                 # Order history
│   └── [id]/page.tsx            # Order detail
├── recipes/
│   ├── page.tsx                 # Recipe listing
│   └── [id]/page.tsx            # Recipe detail
├── profile/page.tsx             # User profile
├── login/page.tsx               # Login
└── register/page.tsx            # Registration
```

### Key Components
```
storefront/src/components/
├── DeliverySlotPicker.tsx       # Delivery time selection UI
├── DeliveryChargeDisplay.tsx    # Zone-based pricing display
├── ProductCard.tsx              # Product grid item
└── home/
    ├── HeroBanner.tsx           # Homepage hero
    └── CategoryCarousel.tsx     # Category carousel
```

## Data Seeding

The seed script (`my-medusa-store/src/scripts/seed.ts`) creates:
- **34 fish products** across 9 categories
- Products with Tamil names (e.g., "Seer Fish - வஞ்சிரம்")
- Price in paise (₹750 = 75000 paise)
- Product variants for cleaning options: Whole, Cleaned, Cut Pieces, Fillet
- Weight variants: 500g, 1kg, 2kg

Fish categories:
1. Sea Fish - Premium (8 varieties)
2. Sea Fish - Regular (22 varieties)
3. Prawns (various types)
4. Crabs (8 varieties)
5. Squid & Cuttlefish (4 varieties)
6. River Fish (15 varieties)
7. Dried Fish (8 varieties)

## Important Conventions

### Currency Handling
- All prices stored in **paise** (1 Rupee = 100 paise)
- ₹750 = 75000 in database
- Use `formatCurrency()` helper: `formatCurrency(75000)` → "₹750"

### API Key Management
- Publishable API key required for all `/store/*` endpoints
- Key passed via `x-publishable-api-key` header
- Generate new keys via: `npx medusa exec ./src/scripts/create-key.ts`
- Multiple utility scripts available in `src/scripts/` for key management

### Zone Calculation
- Uses Haversine formula for distance calculation
- Center point: Chennai (13.0827°N, 80.2707°E)
- Algorithm in `ZoneModuleService.calculateDistance()`
- Zones sorted by radius (smallest first) to find most specific match

### TypeScript Patterns
- Medusa modules use class-based services extending `MedusaService`
- Next.js components use functional components with TypeScript
- Type definitions in `storefront/src/types/`

## Working with Medusa

### Accessing Services in API Routes
```typescript
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import ZoneModuleService from "../../../../modules/zone/service"
import { ZONE_MODULE } from "../../../../modules/zone"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
    const zoneService: ZoneModuleService = req.scope.resolve(ZONE_MODULE)
    // Use service...
}
```

### Creating Custom Modules
1. Create module directory: `src/modules/[module-name]/`
2. Define model: `models/[entity].ts` using MikroORM decorators
3. Create service: `service.ts` extending `MedusaService`
4. Export module: `index.ts` with `Module()` decorator
5. Register in `medusa-config.ts` modules array
6. Generate migration: Auto-generated on server start

### Running Migrations
Migrations are auto-generated by MikroORM. Snapshots stored in:
`src/modules/[module]/migrations/.snapshot-[module].json`

## Google Maps Integration

The zone system optionally uses Google Maps Geocoding API to convert addresses to coordinates.

- API key configured via `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- Geocoding logic in `storefront/src/lib/geocoding.ts`
- Falls back to browser geolocation if API unavailable
- See `Docs/google-maps-setup.md` for setup instructions

## Authentication Flow

- JWT-based authentication via Medusa's built-in system
- Sessions stored in Redis
- Login state persists via JWT tokens
- Protected routes check authentication before checkout

## Common Issues & Solutions

### Port conflicts
```bash
# Windows
netstat -ano | findstr :9000
taskkill /PID [process_id] /F

# Linux/Mac
lsof -ti:9000 | xargs kill -9
```

### Database connection errors
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database "FinMart" exists

### Lock file errors (storefront)
```bash
rm -rf storefront/.next/dev/lock
```

### API key issues
- Run seed script to generate key
- Copy key from output to storefront `.env.local`
- Restart Next.js server after changing .env.local

### CORS errors
- Ensure STORE_CORS includes frontend URL
- Default: `http://localhost:3000`
- Update for production deployment

## Deployment Notes

- **Backend**: Requires Node.js 20+, PostgreSQL 14+, Redis (optional)
- **Frontend**: Can deploy to Vercel, requires NEXT_PUBLIC_* env vars
- **Database**: Run migrations before deployment
- **Seeds**: Run seed scripts only once per environment

## Branch Information

Current working branch: `zone_based_delivery_system_feature_add`
Main branch: `main`

Recent work includes zone-based delivery implementation, Google Maps integration, and delivery slot picker UI.
