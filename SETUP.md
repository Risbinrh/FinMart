# FreshCatch - Setup Guide

Fresh fish delivery application for Tamil Nadu region.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/FreshCatch.git
cd FreshCatch

# Setup Backend
cd my-medusa-store
yarn install
npx medusa db:migrate
npx medusa exec ./src/scripts/seed.ts

# Setup Frontend (new terminal)
cd storefront
npm install
cp .env.local.example .env.local
# Edit .env.local and add your API key from seed output

# Run (2 terminals)
# Terminal 1: cd my-medusa-store && yarn dev
# Terminal 2: cd storefront && npm run dev
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v20 or higher
- **Yarn** package manager (`npm install -g yarn`)
- **PostgreSQL** v14 or higher
- **Redis** (optional, fake redis will be used if not available)

## Project Structure

```
FinMart/
├── my-medusa-store/     # Medusa.js Backend & Admin
├── storefront/          # Next.js Customer Frontend
└── Docs/                # Documentation
```

## Step 1: Database Setup

1. Install PostgreSQL if not already installed:
```bash
sudo apt install postgresql postgresql-contrib
```

2. Create database:
```bash
sudo -u postgres psql
CREATE DATABASE "FinMart";
CREATE USER medusa_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE "FinMart" TO medusa_user;
\q
```

3. Update database connection in `my-medusa-store/medusa-config.ts` if needed:
```typescript
DATABASE_URL=postgres://medusa_user:your_password@localhost:5432/FinMart
```

## Step 2: Medusa Backend Setup

```bash
# Navigate to backend folder
cd my-medusa-store

# Install dependencies
yarn install

# Run database migrations
npx medusa db:migrate

# Seed fish products data (34 fish products, categories, etc.)
npx medusa exec ./src/scripts/seed.ts
```

**Note:** After seeding, copy the Publishable API Key from the output:
```
🔑 Publishable API Key: pk_xxxxx...
```

## Step 3: Storefront Setup

```bash
# Navigate to storefront folder
cd storefront

# Install dependencies
npm install

# Create environment file (if not exists)
cp .env.local.example .env.local
```

Edit `.env.local` with your API key:
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxxx...  # Your API key from seed
```

## Step 4: Running the Application

### Terminal 1 - Start Medusa Backend
```bash
cd my-medusa-store
yarn dev
```
- Backend API: http://localhost:9000
- Admin Panel: http://localhost:9000/app

### Terminal 2 - Start Next.js Storefront
```bash
cd storefront
npm run dev
```
- Storefront: http://localhost:3000

## Step 5: Create Admin User (First Time Only)

```bash
cd my-medusa-store
npx medusa user -e admin@freshcatch.com -p admin123
```

Then login at http://localhost:9000/app with:
- Email: admin@freshcatch.com
- Password: admin123

## Quick Commands Reference

| Command | Description |
|---------|-------------|
| `yarn dev` | Start Medusa backend (in my-medusa-store/) |
| `npm run dev` | Start Next.js storefront (in storefront/) |
| `npx medusa db:migrate` | Run database migrations |
| `npx medusa exec ./src/scripts/seed.ts` | Seed fish products |
| `npx medusa user -e EMAIL -p PASS` | Create admin user |

## Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 9000
lsof -ti:9000 | xargs kill -9
```

### Lock file error in storefront
```bash
rm -rf storefront/.next/dev/lock
```

### Database connection error
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify database exists: `psql -l | grep FinMart`

### Redis not found warning
This is okay for development. A fake redis instance will be used automatically.

## What's Included

### Fish Products (34 items)
- Sea Fish Premium: Seer Fish, King Fish, Pomfret, Red Snapper, etc.
- Sea Fish Regular: Mackerel, Sardine, Anchovy, etc.
- Prawns: Tiger, White, Flower, etc.
- Crabs: Mud Crab, Blue Swimmer, Green Crab
- Squid: Squid, Cuttlefish, Baby Squid
- River Fish: Rohu, Catla, Tilapia, Murrel
- Dried Fish: Dried Sardine, Anchovy, Prawns

### Features
- Products with Tamil names (வஞ்சிரம், இறால், நண்டு, etc.)
- INR currency with prices in paise
- Cleaning options: Whole, Cleaned, Cut Pieces, Fillet
- Quantity variants: 500g, 1kg, 2kg
- 3 Delivery slots: Sunrise (6-8 AM), Morning (8 AM-12 PM), Evening (4-7 PM)
- 5% GST tax configured

## Pages Available

| Page | URL |
|------|-----|
| Home | http://localhost:3000 |
| Products | http://localhost:3000/products |
| Product Detail | http://localhost:3000/products/[id] |
| Cart | http://localhost:3000/cart |
| Checkout | http://localhost:3000/checkout |
| Orders | http://localhost:3000/orders |
| Order Detail | http://localhost:3000/orders/[id] |
| Profile | http://localhost:3000/profile |
| Recipes | http://localhost:3000/recipes |
| Login | http://localhost:3000/login |
| Register | http://localhost:3000/register |

## Tech Stack

- **Backend:** Medusa.js v2.12
- **Frontend:** Next.js 16, React 19, Tailwind CSS
- **UI Components:** shadcn/ui
- **Database:** PostgreSQL
- **Admin:** Medusa built-in admin panel

## Support

For issues, check the documentation in `/Docs` folder:
- `PRD.md` - Product Requirements
- `UI-Design-Plan.md` - UI Design specifications
- `Fish-Catalog.md` - Complete fish catalog (83 varieties)
