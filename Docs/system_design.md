# FreshCatch - Production System Design Document
## Fish Ecommerce Platform for Tamil Nadu

**Version**: 2.0
**Last Updated**: December 2024
**Status**: 30% Production-Ready (MVP Phase)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Implementation Status Dashboard](#2-implementation-status-dashboard)
3. [System Architecture](#3-system-architecture)
4. [Design System](#4-design-system)
5. [User Experience Design](#5-user-experience-design)
6. [Core Modules](#6-core-modules)
7. [Fish-Specific Features](#7-fish-specific-features)
8. [Database Design](#8-database-design)
9. [API Architecture](#9-api-architecture)
10. [Frontend Architecture](#10-frontend-architecture)
11. [Ecommerce Features](#11-ecommerce-features)
12. [Marketing & Conversion](#12-marketing--conversion)
13. [Operations](#13-operations)
14. [Analytics & Insights](#14-analytics--insights)
15. [Performance & Scalability](#15-performance--scalability)
16. [Security & Compliance](#16-security--compliance)
17. [Monitoring & Observability](#17-monitoring--observability)
18. [Deployment & DevOps](#18-deployment--devops)
19. [Mobile Strategy](#19-mobile-strategy)
20. [Implementation Roadmap](#20-implementation-roadmap)
21. [Success Metrics](#21-success-metrics)
22. [Risk Assessment & Mitigation](#22-risk-assessment--mitigation)

---

## 1. Executive Summary

### 1.1 Project Overview

**FreshCatch** (FinMart) is a specialized fish ecommerce platform designed for the Tamil Nadu region of India, enabling customers to order fresh fish with zone-based delivery, bilingual support (English/Tamil), and integrated recipe features.

**Core Value Proposition:**
- **Fresh Daily Catch**: Direct from fishing communities to customer doorsteps
- **Zone-Based Delivery**: GPS-powered delivery zones with precise pricing
- **Bilingual**: Complete Tamil language support for local accessibility
- **Recipe Integration**: Fish-to-recipe recommendations for cooking inspiration
- **Quality Guarantee**: Freshness indicators and catch-date tracking

### 1.2 Technology Foundation

| Layer | Technology | Version | Status |
|-------|------------|---------|--------|
| **Backend** | Medusa.js | 2.12.3 | ✓ Implemented |
| **Frontend** | Next.js | 16.1.1 | ✓ Implemented |
| **UI Framework** | React | 19.2.3 | ✓ Implemented |
| **Styling** | Tailwind CSS | 4.x | ✓ Implemented |
| **Database** | PostgreSQL | 14+ | ✓ Implemented |
| **ORM** | MikroORM | Latest | ✓ Implemented |
| **Cache** | Redis | 7.x | ✗ Planned |
| **Search** | Elasticsearch | 8.x | ✗ Planned |
| **Runtime** | Node.js | 20+ | ✓ Implemented |
| **Language** | TypeScript | 5.6.2 | ✓ Implemented |

### 1.3 Current Implementation Status

**Overall Production Readiness: 30-35%**

✓ **Fully Implemented** (75-100%):
- Product catalog with 34 fish varieties across 9 categories
- Shopping cart with persistence (localStorage)
- 3-step checkout flow (address, delivery slot, payment UI)
- Zone-based delivery with Haversine GPS calculation
- Responsive UI with mobile-first design
- Basic authentication (demo mode + API foundation)

⚠ **Partially Implemented** (25-75%):
- User authentication (demo mode works, real auth needs UI)
- Order management (viewing works, editing/cancellation missing)
- Product filtering (category only, no price/freshness filters)
- Payment integration (UI only, no real gateway)

✗ **Not Implemented** (0-25%):
- Payment gateway (Razorpay/PhonePe integration)
- SMS notifications (OTP, order updates)
- Email notifications (transactional emails)
- Product reviews and ratings
- Caching layer (Redis)
- Advanced search (Elasticsearch)
- Inventory management
- Returns/refunds
- Analytics tracking
- Monitoring/observability

### 1.4 Key Differentiators

1. **Fish-Specific Design**: Unlike generic grocery platforms, built specifically for fresh fish commerce
2. **Zone-Based Pricing**: Dynamic delivery charges based on GPS distance (4 zones)
3. **Freshness First**: Catch date tracking, freshness indicators, same-day delivery
4. **Bilingual UX**: Tamil names, descriptions, and UI throughout
5. **Cleaning Options**: Whole, Cleaned, Cut Pieces, Fillet - with visual guides
6. **Recipe Integration**: Link products to traditional Tamil fish recipes

---

## 2. Implementation Status Dashboard

### 2.1 Feature Completion Matrix

| Category | Feature | Status | Completion | Priority | ETA |
|----------|---------|--------|------------|----------|-----|
| **Product Catalog** ||||
| | Fish products (34 varieties) | ✓ | 100% | Critical | Done |
| | Categories (9 categories) | ✓ | 100% | Critical | Done |
| | Product variants (cleaning, weight) | ✓ | 80% | Critical | Done |
| | Product images | ✓ | 75% | High | Done |
| | Tamil names/descriptions | ✓ | 90% | High | Done |
| | Nutritional information | ⚠ | 30% | Medium | Phase 1 |
| | Freshness indicators | ⚠ | 40% | High | Phase 1 |
| | Seasonal availability | ✗ | 0% | Medium | Phase 2 |
| **Zone & Delivery** ||||
| | Zone definition (4 zones) | ✓ | 100% | Critical | Done |
| | GPS-based zone detection | ✓ | 75% | Critical | Done |
| | Delivery slot selection | ✓ | 90% | Critical | Done |
| | Delivery charge calculation | ✓ | 95% | Critical | Done |
| | Min order amount validation | ✓ | 80% | High | Done |
| | Google Maps geocoding | ⚠ | 50% | Medium | Phase 1 |
| **Cart & Checkout** ||||
| | Add to cart | ✓ | 100% | Critical | Done |
| | Update quantities | ✓ | 100% | Critical | Done |
| | Remove items | ✓ | 100% | Critical | Done |
| | Cart persistence | ✓ | 90% | Critical | Done |
| | Coupon codes | ⚠ | 40% | Medium | Phase 1 |
| | Checkout flow (3 steps) | ✓ | 80% | Critical | Done |
| | Address form | ✓ | 90% | Critical | Done |
| | Payment method selection | ⚠ | 30% | Critical | Phase 1 |
| | Order confirmation | ✓ | 85% | Critical | Done |
| **Authentication** ||||
| | Phone-based OTP (demo) | ✓ | 70% | Critical | Done |
| | Email/password auth | ⚠ | 40% | High | Phase 1 |
| | User profile | ✓ | 75% | High | Done |
| | Address management | ⚠ | 50% | High | Phase 1 |
| | Session management | ✓ | 80% | Critical | Done |
| **Orders** ||||
| | Order creation | ✓ | 80% | Critical | Done |
| | Order history | ✓ | 85% | Critical | Done |
| | Order detail view | ⚠ | 60% | High | Phase 1 |
| | Order tracking | ⚠ | 30% | High | Phase 1 |
| | Order cancellation | ✗ | 0% | Medium | Phase 2 |
| | Reorder | ✗ | 0% | Medium | Phase 2 |
| **Payments** ||||
| | Razorpay integration | ✗ | 0% | Critical | Phase 1 |
| | UPI payments | ✗ | 0% | Critical | Phase 1 |
| | Cash on delivery | ⚠ | 50% | Critical | Phase 1 |
| | Card payments | ✗ | 0% | High | Phase 1 |
| | Payment verification | ✗ | 0% | Critical | Phase 1 |
| **Notifications** ||||
| | SMS OTP | ✗ | 0% | Critical | Phase 1 |
| | Order confirmation SMS | ✗ | 0% | High | Phase 1 |
| | Delivery updates SMS | ✗ | 0% | High | Phase 1 |
| | Email confirmations | ✗ | 0% | High | Phase 1 |
| | Push notifications | ✗ | 0% | Medium | Phase 2 |
| **Search & Discovery** ||||
| | Basic text search | ✓ | 60% | High | Done |
| | Category filtering | ✓ | 90% | High | Done |
| | Price range filter | ✗ | 0% | Medium | Phase 1 |
| | Freshness filter | ✗ | 0% | Medium | Phase 1 |
| | Autocomplete | ✗ | 0% | Medium | Phase 2 |
| | Faceted filters | ✗ | 0% | Medium | Phase 2 |
| **Recommendations** ||||
| | Related products | ✗ | 0% | Medium | Phase 2 |
| | Recently viewed | ✗ | 0% | Low | Phase 2 |
| | Trending products | ⚠ | 20% | Medium | Phase 2 |
| | Recipe-based | ✗ | 0% | Medium | Phase 2 |
| **Reviews & Ratings** ||||
| | Product ratings display | ⚠ | 30% | High | Phase 1 |
| | Review submission | ✗ | 0% | High | Phase 1 |
| | Review moderation | ✗ | 0% | Medium | Phase 2 |
| | Verified purchase badge | ✗ | 0% | Low | Phase 3 |
| **Infrastructure** ||||
| | Redis caching | ✗ | 0% | High | Phase 1 |
| | CDN integration | ✗ | 0% | High | Phase 1 |
| | Error tracking | ✗ | 0% | High | Phase 1 |
| | Performance monitoring | ✗ | 0% | Medium | Phase 2 |
| | Analytics integration | ✗ | 0% | High | Phase 1 |

### 2.2 Production Readiness Checklist

**Before Launch (Phase 1 - Critical):**
- [ ] Real payment gateway integration (Razorpay)
- [ ] SMS provider for OTP and notifications
- [ ] Email service for transactional emails
- [ ] Redis caching layer
- [ ] Error tracking (Sentry or similar)
- [ ] Real user authentication (replace demo mode)
- [ ] Input validation and sanitization
- [ ] Rate limiting and DDoS protection
- [ ] SSL certificate and HTTPS
- [ ] Database backup strategy
- [ ] Deployment automation
- [ ] Basic analytics tracking

**Post-Launch Priorities (Phase 1-2):**
- [ ] Product reviews and ratings
- [ ] Advanced search filters
- [ ] Inventory management
- [ ] Customer support system
- [ ] Order cancellation/returns
- [ ] Performance optimization
- [ ] CDN for static assets
- [ ] Admin dashboard improvements

### 2.3 Technical Debt

| Debt Item | Impact | Effort | Priority |
|-----------|--------|--------|----------|
| Hardcoded coupon codes | Medium | Low | Phase 1 |
| Demo authentication mode | High | Medium | Phase 1 |
| No input validation schemas | High | Low | Phase 1 |
| Missing error boundaries | Medium | Low | Phase 1 |
| Hardcoded zone center coordinates | Medium | Low | Phase 1 |
| No API rate limiting | High | Medium | Phase 1 |
| localStorage cart (should be backend) | Low | Medium | Phase 2 |
| Inline styles in components | Low | Low | Phase 2 |
| Missing unit tests | Medium | High | Phase 2 |
| No E2E tests | Medium | High | Phase 2 |

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          FRESHCATCH ARCHITECTURE                             │
│                          Current Implementation (v1.0)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                        CLIENT LAYER                                   │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │   │
│  │  │   Web App   │  │ Mobile PWA  │  │  Future:    │                  │   │
│  │  │  (Next.js)  │  │  (Next.js)  │  │Native Apps  │                  │   │
│  │  │   :3000     │  │             │  │  (Phase 3)  │                  │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                  │   │
│  └─────────┼────────────────┼────────────────┼─────────────────────────┘   │
│            │                │                │                              │
│            └────────────────┴────────┬───────┴──────────────────────────────│
│                                      │                                       │
│  ┌───────────────────────────────────┼───────────────────────────────────┐   │
│  │              NEXT.JS API PROXY (CORS Handler)                         │   │
│  │              /api/store/[...path] → Medusa Backend                    │   │
│  │              Adds: x-publishable-api-key header                       │   │
│  └───────────────────────────────────┼───────────────────────────────────┘   │
│                                      │                                       │
│  ┌───────────────────────────────────┼───────────────────────────────────┐   │
│  │                        APPLICATION LAYER                              │   │
│  │  ┌────────────────────────────────┴────────────────────────────────┐  │   │
│  │  │                    MEDUSA.JS BACKEND (:9000)                    │  │   │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │  │   │
│  │  │  │ Store API   │  │  Admin API  │  │   Admin Panel           │  │  │   │
│  │  │  │ /store/*    │  │  /admin/*   │  │   /app                  │  │  │   │
│  │  │  └─────────────┘  └─────────────┘  └─────────────────────────┘  │  │   │
│  │  │  ┌─────────────────────────────────────────────────────────────┐│  │   │
│  │  │  │                    CUSTOM MODULES                           ││  │   │
│  │  │  │              [ Zone Module - GPS-based delivery ]           ││  │   │
│  │  │  │              [ Future: Recipe, Referral, Reviews ]          ││  │   │
│  │  │  └─────────────────────────────────────────────────────────────┘│  │   │
│  │  └─────────────────────────────────────────────────────────────────┘  │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                      │                                       │
│  ┌───────────────────────────────────┼───────────────────────────────────┐   │
│  │                          DATA LAYER                                   │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │   │
│  │  │ PostgreSQL  │  │   Redis     │  │    Future:  │                  │   │
│  │  │  (Primary)  │  │  (Planned)  │  │Elasticsearch│                  │   │
│  │  │   :5432     │  │             │  │   & S3      │                  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                  │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │                      EXTERNAL SERVICES (Planned)                      │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │   │
│  │  │Razorpay │ │ Google  │ │  MSG91  │ │SendGrid │ │Analytics│         │   │
│  │  │(Pending)│ │  Maps   │ │(Pending)│ │(Pending)│ │(Pending)│         │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘         │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Technology Stack (Current vs Planned)

#### Frontend Stack

| Component | Technology | Version | Status | Purpose |
|-----------|------------|---------|--------|---------|
| Framework | Next.js | 16.1.1 | ✓ Current | SSR/SSG React framework with App Router |
| UI Library | React | 19.2.3 | ✓ Current | Component-based UI |
| Styling | Tailwind CSS | 4.x | ✓ Current | Utility-first CSS framework |
| Components | Radix UI | Latest | ✓ Current | Accessible headless UI primitives |
| UI Patterns | shadcn/ui | Latest | ✓ Current | Pre-styled component templates |
| State | React Context | Built-in | ✓ Current | Cart & user state management |
| Icons | Lucide React | 0.562.0 | ✓ Current | Icon library |
| Forms | Native HTML5 | - | ✓ Current | Form handling |
| Validation | None | - | ✗ Planned | Zod/Yup for schema validation (Phase 1) |

#### Backend Stack

| Component | Technology | Version | Status | Purpose |
|-----------|------------|---------|--------|---------|
| Commerce Engine | Medusa.js | 2.12.3 | ✓ Current | Headless commerce platform |
| Runtime | Node.js | 20.x | ✓ Current | JavaScript runtime |
| Language | TypeScript | 5.6.2 | ✓ Current | Type-safe development |
| Database | PostgreSQL | 14+ | ✓ Current | Primary data store |
| ORM | MikroORM | Latest | ✓ Current | Database abstraction |
| Cache | Redis | 7.x | ✗ Planned | Session & data caching (Phase 1) |
| Admin | Medusa Admin | Built-in | ✓ Current | Admin dashboard |
| Search | Medusa Default | - | ✓ Current | Basic text search |
| Search (Advanced) | Elasticsearch | 8.x | ✗ Planned | Full-text search (Phase 2) |

#### Infrastructure (Current: Local Development)

| Component | Technology | Status | Notes |
|-----------|------------|--------|-------|
| Hosting (Frontend) | Local / Vercel | ✗ Planned | Deploy to Vercel in Phase 1 |
| Hosting (Backend) | Local / AWS/Railway | ✗ Planned | Deploy to cloud in Phase 1 |
| CDN | None | ✗ Planned | CloudFlare in Phase 1 |
| File Storage | Local | ✗ Planned | AWS S3/Cloudinary in Phase 1 |
| Container | None | ✗ Planned | Docker in Phase 2 |
| CI/CD | None | ✗ Planned | GitHub Actions in Phase 1 |

### 3.3 Data Flow Architecture

```
┌──────────────┐
│ User Browser │
└──────┬───────┘
       │ 1. Request /products
       ▼
┌──────────────────┐
│ Next.js Frontend │
│  (Port 3000)     │
└──────┬───────────┘
       │ 2. API Call: /api/store/products
       ▼
┌──────────────────────┐
│ Next.js API Proxy    │
│ /api/store/[...path] │  3. Adds x-publishable-api-key header
└──────┬───────────────┘
       │ 4. Proxies to http://localhost:9000/store/products
       ▼
┌───────────────────────┐
│ Medusa Backend        │
│   (Port 9000)         │  5. Validates API key
│                       │  6. Queries PostgreSQL
└──────┬────────────────┘
       │ 7. Returns product data (JSON)
       ▼
┌──────────────────┐
│ PostgreSQL DB    │
│  (Port 5432)     │  8. Returns rows
└──────┬───────────┘
       │
       ▼
  Response flows back through chain to browser
```

**Key Pattern: API Proxy**
- Frontend calls `/api/store/*` (Next.js route)
- Next.js proxy adds `x-publishable-api-key` header
- Request forwarded to Medusa backend
- Solves: CORS issues, API key security (not exposed to client)

### 3.4 Component Communication

```
┌────────────────────────────────────────────────────────────────┐
│                     React Component Tree                        │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  RootLayout (app/layout.tsx)                                   │
│    ↓                                                            │
│  Providers (AuthProvider → CartProvider)                       │
│    ├─→ Header (sticky nav)                                     │
│    │    ├─→ Search (client component)                          │
│    │    ├─→ CartIcon (useCart hook → shows count)             │
│    │    └─→ UserButton (useAuth hook → shows login state)     │
│    ├─→ {children} (page content)                               │
│    │    └─→ Page-specific components                           │
│    ├─→ MobileNav (bottom tab, mobile only)                     │
│    └─→ Footer                                                   │
│                                                                 │
│  State Flow:                                                    │
│  ┌──────────────┐   ┌──────────────┐                          │
│  │ CartContext  │   │ AuthContext  │                          │
│  │              │   │              │                          │
│  │ - cart       │   │ - customer   │                          │
│  │ - itemCount  │   │ - isAuth     │                          │
│  │ - addToCart()│   │ - login()    │                          │
│  │ - update()   │   │ - logout()   │                          │
│  └──────┬───────┘   └──────┬───────┘                          │
│         │                  │                                   │
│         ▼                  ▼                                   │
│   localStorage         localStorage                            │
│   cart_id              demo_customer                           │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## 4. Design System

### 4.1 Color Palette (OKLCH Color Space)

FreshCatch uses the modern OKLCH color space for perceptually uniform colors that work beautifully in both light and dark modes.

#### Primary Colors

```css
/* Ocean Blue - Primary actions, links, highlights */
--primary: oklch(0.48 0.14 230);              /* Deep ocean blue */
--primary-foreground: oklch(0.99 0 0);        /* White text on primary */

/* Fresh Teal - Success states, freshness indicators */
--secondary: oklch(0.58 0.11 190);            /* Fresh teal */
--secondary-foreground: oklch(0.99 0 0);      /* White text */

/* Coral - Offers, CTAs, urgency */
--accent: oklch(0.68 0.16 40);                /* Coral/salmon */
--accent-foreground: oklch(0.15 0.015 240);   /* Dark text */
```

#### Surface Colors

```css
/* Backgrounds */
--background: oklch(0.99 0.002 200);          /* Near-white with slight cool tint */
--card: oklch(1 0 0);                         /* Pure white cards */
--muted: oklch(0.96 0.008 180);               /* Seafoam light gray */
--muted-foreground: oklch(0.42 0.018 240);    /* Secondary text */
```

#### Semantic Colors

```css
/* Destructive - Errors, dangerous actions */
--destructive: oklch(0.58 0.22 25);           /* Red */
--destructive-foreground: oklch(0.99 0 0);    /* White text */

/* Borders & Inputs */
--border: oklch(0.92 0.006 200);              /* Light gray borders */
--input: oklch(0.96 0.008 200);               /* Input backgrounds */
--ring: oklch(0.48 0.14 230);                 /* Focus rings (primary) */
```

#### Dark Mode

```css
.dark {
  --background: oklch(0.145 0 0);             /* Dark charcoal */
  --foreground: oklch(0.985 0 0);             /* Near-white text */
  --card: oklch(0.205 0 0);                   /* Lighter dark */
  --primary: oklch(0.58 0.14 230);            /* Brighter blue */
  --muted: oklch(0.26 0 0);                   /* Dark muted */
  --accent: oklch(0.78 0.16 40);              /* Brighter coral */
  --border: oklch(0.26 0.006 200);            /* Dark borders */
}
```

#### Usage Guidelines

| Use Case | Color | Example |

|----------|-------|---------|
| Primary CTA | `bg-primary text-primary-foreground` | "Add to Cart" button |
| Secondary CTA | `bg-secondary text-secondary-foreground` | "Buy Now" button |
| Destructive action | `bg-destructive text-destructive-foreground` | "Remove Item" |
| Highlight/Badge | `bg-accent text-accent-foreground` | "Fresh Today" badge |
| Links | `text-primary hover:underline` | Navigation links |
| Success state | `text-secondary` | "Item added" message |
| Error state | `text-destructive` | Validation errors |

### 4.2 Typography System

#### Font Stack

```css
/* Primary: Geist Sans (Next.js default) */
font-family: var(--font-geist-sans), system-ui, sans-serif;

/* Monospace: Geist Mono */
font-family: var(--font-geist-mono), 'Courier New', monospace;

/* Future: Tamil Support */
font-family: 'Noto Sans Tamil', var(--font-geist-sans), sans-serif;
```

#### Type Scale

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| **H1** | 32-40px | Bold (700) | 1.2 | Page titles, hero headings |
| **H2** | 24-32px | Semibold (600) | 1.3 | Section headers |
| **H3** | 20-24px | Semibold (600) | 1.4 | Subsection headers |
| **H4** | 18px | Semibold (600) | 1.4 | Card titles |
| **Body** | 16px | Regular (400) | 1.6 | Main content |
| **Body Small** | 14px | Regular (400) | 1.5 | Secondary text |
| **Caption** | 12px | Regular (400) | 1.4 | Helper text, labels |
| **Button** | 14-16px | Medium (500) | 1 | Button text |
| **Monospace** | 14px | Regular (400) | 1.5 | Codes, prices |

#### Tailwind Classes

```css
/* Headings */
.text-4xl      /* 36px - H1 */
.text-3xl      /* 30px - H2 */
.text-2xl      /* 24px - H3 */
.text-xl       /* 20px - H4 */
.text-lg       /* 18px - Large body */
.text-base     /* 16px - Body */
.text-sm       /* 14px - Small */
.text-xs       /* 12px - Caption */

/* Weights */
.font-bold     /* 700 */
.font-semibold /* 600 */
.font-medium   /* 500 */
.font-normal   /* 400 */
```

### 4.3 Spacing System

Based on 4px unit:

| Token | Size | Usage |
|-------|------|-------|
| `spacing-1` | 4px | Minimal gaps |
| `spacing-2` | 8px | Tight spacing |
| `spacing-3` | 12px | Standard gaps |
| `spacing-4` | 16px | Card padding, standard spacing |
| `spacing-6` | 24px | Section gaps |
| `spacing-8` | 32px | Large gaps |
| `spacing-12` | 48px | Major section spacing |
| `spacing-16` | 64px | Hero spacing |

**Common Patterns:**
- Card padding: `p-4` (16px)
- Section gap: `gap-6` (24px)
- Grid gap: `gap-4` (16px)
- Button padding: `px-4 py-2` (16px x 8px)

### 4.4 Border Radius

```css
--radius: 0.75rem; /* 12px - base radius */
```

| Size | Value | Usage |
|------|-------|-------|
| `rounded-sm` | 8px | Small elements |
| `rounded-md` | 10px | Medium elements |
| `rounded-lg` | 12px | Standard (cards, buttons) |
| `rounded-xl` | 16px | Large cards |
| `rounded-2xl` | 20px | Hero sections |
| `rounded-full` | 9999px | Circles (avatar, badges) |

### 4.5 Shadow System

```css
/* Elevation levels */
--shadow-sm:   0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow:      0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md:   0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg:   0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl:   0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl:  0 25px 50px -12px rgb(0 0 0 / 0.25);
```

**Usage:**
- Product cards: `shadow` → `shadow-lg` on hover
- Modals/Sheets: `shadow-xl`
- Sticky headers: `shadow-sm`

### 4.6 Component Library

#### Button Variants

```tsx
<Button variant="default" size="default">    // Primary CTA
<Button variant="secondary">                 // Secondary action
<Button variant="outline">                   // Tertiary action
<Button variant="ghost">                     // Minimal action
<Button variant="destructive">               // Dangerous action
<Button variant="link">                      // Link styling

// Sizes
<Button size="sm">      // Small (h-8, px-3)
<Button size="default"> // Default (h-9, px-4)
<Button size="lg">      // Large (h-10, px-6)
<Button size="icon">    // Icon only (square)
```

#### Card Components

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    {/* Actions */}
  </CardFooter>
</Card>
```

#### Input Components

```tsx
<Input type="text" placeholder="..." />
<Input type="email" placeholder="..." />
<Input type="tel" inputMode="numeric" />
<Input type="password" />
```

#### Other Primitives

- `<Badge>` - Labels and tags
- `<Avatar>` - User profile pictures
- `<Separator>` - Divider lines
- `<Skeleton>` - Loading placeholders
- `<Sheet>` - Side drawer/modal
- `<Tabs>` - Tabbed content
- `<Select>` - Dropdown selection (Radix UI)

### 4.7 Animation Standards

#### Transition Durations

```css
/* Default smooth transition */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Fast interactions */
transition: all 0.15s ease-out;

/* Slow reveals */
transition: all 0.5s ease-out;
```

#### Keyframe Animations

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scale In */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Shimmer (Loading) */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
```

#### Motion Patterns

| Pattern | Effect | Use Case |
|---------|--------|----------|
| `hover:scale-105` | Slight grow | Product cards |
| `hover:-translate-y-1` | Lift up | Interactive cards |
| `hover:shadow-lg` | Shadow increase | Elevated elements |
| `animate-spin` | Continuous rotation | Loading spinners |
| `animate-pulse` | Fade in/out | Skeleton screens |
| `animate-bounce` | Bounce | Success celebration |

---

## 5. User Experience Design

### 5.1 Customer Journey Maps

#### A. First-Time Visitor Journey

```
Entry Point → Landing Page → Discovery → Product Detail → Add to Cart →
Checkout → Register/Login → Payment → Order Confirmation → Retention
```

**Detailed Flow:**

1. **Entry (0-5 seconds)**
   - Hero banner with rotating creative images
   - Value proposition: "Fresh Fish Delivered Daily"
   - CTA: "Shop Now" or category selection

2. **Discovery (5-60 seconds)**
   - Category carousel (visual browsing)
   - Featured products grid
   - Search bar prominent in header
   - **Decision Point**: Browse by category OR search for specific fish

3. **Exploration (1-5 minutes)**
   - Product listing with filters
   - Visual product cards with Tamil names
   - Freshness indicators catch attention
   - Sort by price/popularity

4. **Product Detail (30-120 seconds)**
   - Large product images
   - Price clearly displayed
   - Cleaning options explained
   - Nutritional info builds trust
   - Reviews (future) add social proof
   - **Decision Point**: Add to cart OR continue browsing

5. **Cart Review (30-60 seconds)**
   - See all items
   - Update quantities
   - Apply coupon code (discovery moment)
   - See delivery charge (zone-based)
   - **Decision Point**: Proceed to checkout OR continue shopping

6. **Authentication (30-90 seconds)**
   - Phone number entry
   - OTP verification (demo mode for now)
   - Quick and frictionless
   - **Decision Point**: Complete login OR abandon

7. **Checkout (2-5 minutes)**
   - **Step 1**: Delivery address
     - Pre-filled if logged in
     - Zone automatically detected
   - **Step 2**: Delivery slot selection
     - Visual time slots with icons
     - Pricing clearly shown
   - **Step 3**: Payment method
     - COD, UPI, Cards
   - Review and place order

8. **Confirmation (10-20 seconds)**
   - Order ID generated
   - Success animation
   - Delivery details confirmed
   - SMS confirmation (future)
   - **Decision Point**: Track order OR continue shopping

9. **Retention**
   - Email with order details (future)
   - Order tracking page
   - Post-delivery review request
   - Personalized recommendations

#### B. Returning Customer Journey

```
Entry → Quick Search/Reorder → Add to Cart → Express Checkout → Confirmation
```

**Optimizations for Returning Customers:**
- Personalized homepage (recently viewed, recommended)
- Quick reorder from order history
- Saved addresses for 1-click checkout
- Loyalty points/rewards (future)

#### C. Mobile Shopper Journey

```
Entry → Thumb-Friendly Browse → Quick Add → Mobile Checkout → Done
```

**Mobile-Specific Optimizations:**
- Bottom tab navigation (thumb zone)
- Large touch targets (min 44x44px)
- Horizontal scroll carousels
- Sticky "Add to Cart" button
- Auto-advance OTP inputs
- Mobile payment options (UPI, PhonePe)

### 5.2 User Flows (Visual Diagrams)

#### Browse Flow

```
┌─────────────┐
│  Home Page  │
└──────┬──────┘
       │
       ├─────────────┬─────────────┬──────────────┐
       ▼             ▼             ▼              ▼
  ┌─────────┐  ┌──────────┐  ┌─────────┐   ┌────────┐
  │  Hero   │  │ Category │  │Featured │   │ Search │
  │ Banner  │  │ Carousel │  │Products │   │  Bar   │
  └────┬────┘  └─────┬────┘  └────┬────┘   └───┬────┘
       │             │             │            │
       └─────────────┴─────────────┴────────────┘
                     │
                     ▼
          ┌────────────────────┐
          │ Product Listing    │
          │ - Category Filter  │
          │ - Search Results   │
          │ - Sort Options     │
          └─────────┬──────────┘
                    │
                    ▼
          ┌───────────────────┐
          │ Product Detail    │
          │ - Images          │
          │ - Variants        │
          │ - Description     │
          │ - Reviews         │
          └─────────┬─────────┘
                    │
                    ▼
          ┌───────────────────┐
          │ Add to Cart       │
          └───────────────────┘
```

#### Checkout Flow

```
┌──────────┐
│   Cart   │
└────┬─────┘
     │ Review items
     │ Apply coupon
     ▼
┌──────────────┐      ┌────────────────┐
│ Login Check  │─No──→│ Phone Login    │
└──────┬───────┘      │ (OTP)          │
       │ Yes          └────────┬───────┘
       │                       │
       └───────────────────────┘
                │
                ▼
     ┌──────────────────┐
     │ Checkout Step 1  │
     │ Delivery Address │
     │ - Name, Phone    │
     │ - Address        │
     │ - Pincode        │
     └────────┬─────────┘
              │ Zone detected
              ▼
     ┌──────────────────┐
     │ Checkout Step 2  │
     │ Delivery Slot    │
     │ - Date selector  │
     │ - Time slots     │
     └────────┬─────────┘
              │
              ▼
     ┌──────────────────┐
     │ Checkout Step 3  │
     │ Payment Method   │
     │ - COD            │
     │ - UPI            │
     │ - Card           │
     └────────┬─────────┘
              │
              ▼
     ┌──────────────────┐
     │ Order Summary    │
     │ - Review all     │
     │ - Terms agree    │
     │ - Place Order    │
     └────────┬─────────┘
              │
              ▼
     ┌──────────────────┐
     │ Processing...    │
     │ (2s animation)   │
     └────────┬─────────┘
              │
              ▼
     ┌──────────────────┐
     │ Success Screen   │
     │ - Order ID       │
     │ - Delivery info  │
     │ - Track button   │
     └──────────────────┘
```

#### Search & Filter Flow

```
┌────────────────┐
│ Products Page  │
└───────┬────────┘
        │
        ├──────────────┬───────────────┐
        ▼              ▼               ▼
  ┌──────────┐  ┌──────────┐   ┌──────────┐
  │  Search  │  │ Category │   │   Sort   │
  │   Bar    │  │  Filter  │   │ Options  │
  └────┬─────┘  └────┬─────┘   └────┬─────┘
       │             │              │
       │ (Type query)│ (Select)     │ (Price/Pop)
       │             │              │
       └─────────────┴──────────────┘
                     │
                     ▼
          ┌──────────────────┐
          │  Filter Applied  │
          │  - Update URL    │
          │  - Re-fetch      │
          │  - Show results  │
          └──────┬───────────┘
                 │
                 ▼
       ┌─────────────────────┐
       │ Product Grid        │
       │ - Skeleton loading  │
       │ - Real results      │
       │ - Empty state       │
       └─────────────────────┘
```

### 5.3 Mobile vs Desktop Navigation Patterns

#### Desktop Navigation (≥1024px)

```
┌──────────────────────────────────────────────────────────────┐
│ [Logo]  [Search..................]  Home Products Recipes    │
│                                      About  [User] [Cart(2)] │
└──────────────────────────────────────────────────────────────┘
```

- **Sticky header** at top
- **Horizontal nav** with all links visible
- **Search bar** prominent and expanded
- **Cart icon** with badge showing item count
- **User avatar** or login button

#### Mobile Navigation (<768px)

**Top Bar:**
```
┌──────────────────────────────────┐
│ [Logo]      [🔍] [User] [Cart(2)]│
└──────────────────────────────────┘
```

**Bottom Tab Bar (Fixed):**
```
┌──────────────────────────────────┐
│ [🏠]  [🔍]  [🛒]  [📦]  [👤]    │
│ Home Search Cart Orders Profile  │
└──────────────────────────────────┘
```

- **Minimalist top bar** (logo + essential icons)
- **Bottom tab navigation** for primary actions
- **Search icon** opens full-screen search modal
- **Hamburger menu** for secondary nav
- **Sticky bottom nav** always accessible (thumb zone)

### 5.4 Accessibility Standards

#### WCAG 2.1 AA Compliance Goals

1. **Perceivable**
   - ✓ Text alternatives for images (alt attributes)
   - ⚠ Sufficient color contrast (needs audit)
   - ✓ Resizable text (rem units, not px)
   - ✗ Captions for videos (no videos yet)

2. **Operable**
   - ✓ Keyboard accessible (all interactive elements)
   - ✓ No keyboard traps
   - ⚠ Skip navigation links (needs implementation)
   - ✓ Focus visible (blue rings)
   - ✓ Touch targets ≥44x44px (mobile)

3. **Understandable**
   - ✓ Language attribute (`lang="en"`)
   - ✓ Consistent navigation
   - ✓ Form labels and instructions
   - ✓ Error identification

4. **Robust**
   - ✓ Valid HTML5
   - ✓ ARIA labels where needed
   - ✓ Compatible with assistive technologies

#### Keyboard Navigation Map

| Key | Action |
|-----|--------|
| `Tab` | Move to next focusable element |
| `Shift + Tab` | Move to previous element |
| `Enter` | Activate button/link |
| `Space` | Toggle checkbox/button |
| `Esc` | Close modal/dropdown |
| `Arrow keys` | Navigate dropdown/carousel |
| `Number keys` | OTP input (auto-advance) |

#### Screen Reader Optimization

```html
<!-- Product Card Example -->
<article role="article" aria-label="Seer Fish product">
  <img src="..." alt="Seer Fish (வஞ்சிரம்) - Fresh catch">
  <h3>Seer Fish</h3>
  <p aria-label="Price">₹750 per kg</p>
  <button aria-label="Add Seer Fish to cart">
    Add to Cart
  </button>
</article>

<!-- Form Labels -->
<label for="phone">Phone Number *</label>
<input
  id="phone"
  type="tel"
  aria-required="true"
  aria-invalid="false"
  aria-describedby="phone-help"
/>
<span id="phone-help">Enter 10-digit mobile number</span>
```

---

## 6. Core Modules

### 6.1 Product Catalog Module

#### Product Data Model

```typescript
interface Product {
  id: string;
  title: string;                    // "Seer Fish"
  subtitle?: string;                // "வஞ்சிரம் (Vanjaram)" - Tamil name
  handle: string;                   // "seer-fish" - URL slug
  description: string;              // Rich text description
  thumbnail: string;                // Main product image URL
  images: string[];                 // Additional images

  // Category
  categories: ProductCategory[];    // Many-to-many

  // Pricing
  variants: ProductVariant[];       // Different SKUs

  // Metadata (custom)
  metadata: {
    name_tamil?: string;            // Tamil name
    freshness_score?: number;       // 1-10 freshness rating
    catch_date?: string;            // When caught
    nutritional_info?: {
      calories: number;             // Per 100g
      protein: number;              // In grams
      fat: number;
      omega3: number;
    };
    best_for?: string[];            // ["frying", "grilling", "curry"]
    season?: string[];              // ["Jun", "Jul", "Aug"]
  };

  // Status
  status: 'draft' | 'published';
  is_giftcard: boolean;
  discountable: boolean;

  // Timestamps
  created_at: Date;
  updated_at: Date;
}

interface ProductVariant {
  id: string;
  product_id: string;
  title: string;                    // "Cleaned - 1kg"
  sku: string;                      // "SEER-CLN-1KG"

  // Pricing (in paise: ₹750 = 75000)
  prices: {
    amount: number;                 // 75000 paise
    currency_code: string;          // "INR"
    region_id: string;
  }[];

  // Options
  options: {
    cleaning_type?: 'whole' | 'cleaned' | 'cut' | 'fillet';
    weight_grams?: 500 | 1000 | 2000;
  };

  // Inventory
  manage_inventory: boolean;
  allow_backorder: boolean;
  inventory_quantity?: number;

  // Physical
  weight?: number;
  length?: number;
  height?: number;
  width?: number;
}

interface ProductCategory {
  id: string;
  name: string;                     // "Sea Fish - Premium"
  handle: string;                   // "sea-fish-premium"
  description?: string;
  parent_category_id?: string;      // For nesting

  // Custom
  metadata: {
    name_tamil?: string;            // Tamil category name
    icon?: string;                  // Icon or emoji
    sort_order?: number;            // Display order
  };

  // Hierarchy
  parent?: ProductCategory;
  children?: ProductCategory[];
  products?: Product[];

  is_active: boolean;
  is_internal: boolean;
}
```

#### Categories (9 Categories)

1. **Sea Fish - Premium**
   - Tamil: கடல் மீன் - உயர்தரம்
   - Products: Seer Fish, King Fish, Pomfret (White/Black), Red Snapper, Grouper, Barramundi, Emperor Fish
   - Characteristics: High-value, premium pricing, special occasions

2. **Sea Fish - Regular**
   - Tamil: கடல் மீன் - வழக்கமான
   - Products: Mackerel, Sardine, Anchovy, Tuna, Salmon (imported), Indian Salmon, Lady Fish, Ribbon Fish, etc.
   - Characteristics: Daily cooking, affordable

3. **Sea Fish - Small**
   - Tamil: கடல் மீன் - சிறிய
   - Products: Silver Fish, Small Sardines, Small Mackerel
   - Characteristics: Frying, curry, economical

4. **River Fish**
   - Tamil: நதி மீன்
   - Products: Rohu, Catla, Tilapia, Murrel (Snakehead), Catfish, Climbing Perch, etc.
   - Characteristics: Freshwater, mild flavor

5. **Prawns & Shrimp**
   - Tamil: இறால்
   - Products: Tiger Prawns, White Prawns, Flower Prawns, Jumbo Prawns, etc.
   - Characteristics: High protein, versatile cooking

6. **Crabs**
   - Tamil: நண்டு
   - Products: Mud Crab, Blue Swimmer, Green Crab, Red Crab, etc.
   - Characteristics: Delicacy, meat extraction

7. **Squid & Cuttlefish**
   - Tamil: கணவாய்
   - Products: Squid, Cuttlefish, Baby Squid, Giant Squid
   - Characteristics: Tender, quick cooking

8. **Lobster & Special**
   - Tamil: இரால் மற்றும் சிறப்பு
   - Products: Lobster, Rock Lobster, Spiny Lobster, Clams, Oysters
   - Characteristics: Premium delicacies

9. **Dried Fish**
   - Tamil: உலர் மீன்
   - Products: Dried Sardine, Dried Anchovy, Dried Prawns, Dried Mackerel, etc.
   - Characteristics: Long shelf life, intense flavor

#### Cleaning Options

| Type | Tamil | Description | Use Cases |
|------|-------|-------------|-----------|
| **Whole** | முழு மீன் | Unprocessed, as caught | Traditional curry, whole grilling |
| **Cleaned** | சுத்தம் செய்த | Gutted, scaled, ready to cook | Most recipes, convenience |
| **Cut Pieces** | துண்டுகள் | Cut into curry pieces | Fish curry, frying |
| **Fillet** | மீன் சதை | Boneless fillet | Pan frying, kids' meals |

#### Product Search & Filtering

**Current Implementation:**
```typescript
// Basic text search (Medusa default)
GET /store/products?q=pomfret

// Category filter
GET /store/products?category_id[]=cat_123

// Limit & offset
GET /store/products?limit=20&offset=0
```

**Planned Enhancements (Phase 1-2):**
```typescript
// Price range
GET /store/products?price_min=10000&price_max=50000

// Cleaning type
GET /store/products?cleaning_type=cleaned

// Weight
GET /store/products?weight=1000

// Freshness
GET /store/products?freshness=today

// Multiple filters
GET /store/products?category=sea-fish&price_max=50000&cleaning=cleaned
```

### 6.2 Zone-Based Delivery Module

The zone module is a custom Medusa module that handles GPS-based delivery zone detection and pricing.

#### Zone Data Model

```typescript
// my-medusa-store/src/modules/zone/models/zone.ts
@Entity()
class Zone {
  @PrimaryKey()
  id: string;

  @Property()
  zone_name: string;                 // "Zone A", "Zone B", "Zone C", "Zone D"

  @Property()
  description?: string;              // "Primary delivery zone"

  // GPS Center Point (e.g., Chennai: 13.0827, 80.2707)
  @Property({ type: 'decimal' })
  center_lat: number;

  @Property({ type: 'decimal' })
  center_lng: number;

  // Radius in kilometers
  @Property({ type: 'decimal' })
  radius_km: number;                 // 0-5, 5-10, 10-15, 15-25

  // Pricing
  @Property()
  delivery_charge: number;           // In paise: 0, 3000, 5000, 8000

  @Property()
  min_order_amount: number;          // In paise: 30000, 40000, 50000, 70000

  // Delivery slots (JSON)
  @Property({ type: 'json', nullable: true })
  delivery_slots?: {
    id: string;
    name: string;
    name_tamil: string;
    time_range: string;
    icon: string;
    charge?: number;                 // Additional charge (in paise)
  }[];

  // Status
  @Property()
  is_active: boolean;

  @Property()
  sort_order: number;                // Display priority

  // Timestamps
  @Property()
  created_at: Date;

  @Property()
  updated_at: Date;
}
```

#### Zone Configuration (4 Zones)

| Zone | Distance | Delivery Charge | Min Order | Priority |
|------|----------|-----------------|-----------|----------|
| **Zone A** | 0-5 km | Free (₹0) | ₹300 | Highest |
| **Zone B** | 5-10 km | ₹30 | ₹400 | High |
| **Zone C** | 10-15 km | ₹50 | ₹500 | Medium |
| **Zone D** | 15-25 km | ₹80 | ₹700 | Low |

#### Haversine Distance Calculation

```typescript
// my-medusa-store/src/modules/zone/service.ts
calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = this.toRad(lat2 - lat1);
  const dLng = this.toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.toRad(lat1)) *
    Math.cos(this.toRad(lat2)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance; // Returns kilometers
}
```

**Algorithm:**
1. User enters delivery address
2. Address geocoded to lat/lng (Google Maps API or browser geolocation)
3. Calculate distance from zone center to delivery location
4. Find smallest zone that contains the location
5. Return zone with delivery charge and min order amount

#### Zone Detection API

```
POST /store/zones/check
Content-Type: application/json

{
  "latitude": 13.0827,
  "longitude": 80.2707
}

Response:
{
  "zone": {
    "id": "zone_01",
    "zone_name": "Zone A",
    "delivery_charge": 0,
    "min_order_amount": 30000,
    "delivery_slots": [...]
  }
}
```

#### Delivery Slots (3 Slots)

```typescript
interface DeliverySlot {
  id: string;
  name: string;
  name_tamil: string;
  time_range: string;
  icon: string;
  description: string;
  charge?: number;  // Additional charge (optional)
}

// Default slots
const deliverySlots = [
  {
    id: 'sunrise',
    name: 'Sunrise Delivery',
    name_tamil: 'விடியற்காலை டெலிவரி',
    time_range: '6:00 AM - 8:00 AM',
    icon: '🌅',
    description: 'Perfect for early morning cooking',
    charge: 0
  },
  {
    id: 'morning',
    name: 'Morning Delivery',
    name_tamil: 'காலை டெலிவரி',
    time_range: '8:00 AM - 12:00 PM',
    icon: '🌞',
    description: 'Standard morning delivery',
    charge: 0
  },
  {
    id: 'evening',
    name: 'Evening Delivery',
    name_tamil: 'மாலை டெலிவரி',
    time_range: '4:00 PM - 7:00 PM',
    icon: '🌆',
    description: 'Evening delivery for dinner prep',
    charge: 3000  // ₹30 additional
  }
];
```

### 6.3 Cart System

#### Cart State Management

```typescript
// storefront/src/context/CartContext.tsx
interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  itemCount: number;

  // Actions
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineItemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  clearError: () => void;
}

// Cart structure (from Medusa)
interface Cart {
  id: string;
  email?: string;
  customer_id?: string;
  region_id: string;

  // Items
  items: LineItem[];

  // Address
  shipping_address?: Address;
  billing_address?: Address;

  // Totals (in paise)
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  tax_total: number;
  total: number;

  // Payment
  payment_sessions: PaymentSession[];
  payment_id?: string;

  // Metadata
  metadata?: {
    coupon_code?: string;
    discount_amount?: number;
    delivery_slot?: string;
    delivery_date?: string;
  };

  created_at: Date;
  updated_at: Date;
}

interface LineItem {
  id: string;
  cart_id: string;
  variant_id: string;
  product_id: string;

  title: string;
  description: string;
  thumbnail: string;

  quantity: number;
  unit_price: number;    // In paise
  total: number;         // quantity * unit_price

  // Variant details
  variant: {
    title: string;
    sku: string;
    options: Record<string, any>;
  };

  metadata?: Record<string, any>;
}
```

#### Cart Persistence

```typescript
// On cart creation
const cart = await medusa.createCart({ region_id: 'reg_india' });
localStorage.setItem('freshcatch_cart_id', cart.id);

// On page load
const cartId = localStorage.getItem('freshcatch_cart_id');
if (cartId) {
  const cart = await medusa.getCart(cartId);
  setCart(cart);
}

// On cart update
await medusa.addToCart(cartId, variantId, quantity);
await refreshCart(); // Re-fetch to get updated totals
```

#### Coupon System (Current: Hardcoded)

```typescript
// storefront/src/app/cart/page.tsx
const hardcodedCoupons = {
  'FRESH50': { discount: 5000, type: 'flat' },      // ₹50 off
  'FIRST100': { discount: 10000, type: 'flat' }     // ₹100 off
};

// Apply coupon
const applyCoupon = (code: string) => {
  if (hardcodedCoupons[code]) {
    setAppliedCoupon(code);
    setDiscount(hardcodedCoupons[code].discount);
  } else {
    alert('Invalid coupon code');
  }
};
```

**Planned: Real Coupon API (Phase 1)**
- Store coupons in database
- Validate via backend API
- Support percentage discounts
- Usage limits and expiry

### 6.4 Order Management

#### Order Lifecycle

```
PENDING → CONFIRMED → PREPARING → PACKED → DISPATCHED →
OUT_FOR_DELIVERY → DELIVERED → COMPLETED

                   ↓ (if issues)
                CANCELLED / REFUNDED
```

#### Order Data Model

```typescript
interface Order {
  id: string;
  display_id: string;              // Human-readable: FC202412291234
  cart_id: string;
  customer_id: string;

  // Address
  shipping_address: Address;
  billing_address: Address;

  // Items
  items: OrderItem[];

  // Pricing (in paise)
  subtotal: number;
  shipping_total: number;
  tax_total: number;
  discount_total: number;
  total: number;

  // Payment
  payment_status: 'awaiting' | 'paid' | 'refunded';
  payment_method: 'cod' | 'upi' | 'card';

  // Fulfillment
  fulfillment_status: 'not_fulfilled' | 'partially_fulfilled' | 'fulfilled';
  status: 'pending' | 'completed' | 'cancelled';

  // Metadata
  metadata?: {
    delivery_slot: string;
    delivery_date: string;
    zone_id: string;
    special_instructions?: string;
  };

  // Timestamps
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
  cancelled_at?: Date;
}
```

#### Order Creation Flow

```typescript
// 1. Update cart with customer details
await medusa.updateCart(cartId, {
  email: customer.email,
  shipping_address: addressData,
  billing_address: addressData
});

// 2. Add shipping method
await medusa.addShippingMethod(cartId, {
  option_id: shippingOptionId
});

// 3. Create payment session
await medusa.createPaymentSessions(cartId);

// 4. Complete cart → creates order
const order = await medusa.completeCart(cartId);

// 5. Clear cart from localStorage
localStorage.removeItem('freshcatch_cart_id');

// 6. Redirect to success page
router.push(`/checkout/success?order_id=${order.id}`);
```

### 6.5 Authentication Module

#### Current: Hybrid Authentication

```typescript
// Demo Mode (for testing without backend)
interface DemoAuthState {
  mode: 'demo';
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
  };
}

// Real Mode (Medusa API)
interface RealAuthState {
  mode: 'real';
  customer: MedusaCustomer;
  token: string;  // JWT
}
```

#### Phone-Based OTP Flow (Demo)

```
1. User enters phone number
2. Generate 6-digit OTP (demo: displayed on screen)
3. User enters OTP
4. Validate OTP
5. Create or retrieve customer
6. Store in localStorage
7. Update AuthContext state
```

```typescript
// Demo OTP generation
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Demo customer creation
const loginWithPhone = (phone: string, name?: string) => {
  const customer = {
    id: `demo_${Date.now()}`,
    firstName: name || 'Customer',
    lastName: '',
    phone,
    email: `${phone}@freshcatch.demo`
  };

  localStorage.setItem('freshcatch_demo_customer', JSON.stringify(customer));
  setCustomer(customer);
  setIsAuthenticated(true);
};
```

#### Real Authentication (Partial Implementation)

```typescript
// Email/Password Login
const login = async (email: string, password: string) => {
  const response = await medusa.login(email, password);
  // Response includes JWT token + customer data
  // Stored in HTTP-only cookies by Medusa
};

// Customer Registration
const register = async (data: RegisterData) => {
  await medusa.register({
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    password: data.password,
    phone: data.phone
  });
};

// Get Current Customer
const customer = await medusa.getCustomer();
```

**Planned (Phase 1):**
- Real SMS OTP integration (MSG91)
- Phone number as primary identifier
- Email as optional
- Social login (Google, Facebook)

---

## 7. Fish-Specific Features

### 7.1 Freshness Indicators

Freshness is THE critical factor in fish ecommerce. We track and display freshness at multiple levels.

#### Freshness Scoring (1-10 Scale)

```typescript
interface FreshnessMetadata {
  catch_date: string;           // ISO date: "2024-12-29"
  arrival_date: string;         // When it arrived at facility
  freshness_score: number;      // 1-10 (calculated)
  storage_temp: number;         // Celsius (4°C ideal)
  quality_check: {
    eyes: 'clear' | 'cloudy';
    gills: 'bright red' | 'dull';
    smell: 'fresh' | 'slight' | 'strong';
    texture: 'firm' | 'soft';
  };
}

// Calculate freshness score
function calculateFreshnessScore(catchDate: Date): number {
  const hoursOld = (Date.now() - catchDate.getTime()) / (1000 * 60 * 60);

  if (hoursOld < 6) return 10;      // Caught today morning
  if (hoursOld < 12) return 9;      // Caught today
  if (hoursOld < 24) return 8;      // Yesterday
  if (hoursOld < 48) return 6;      // 2 days old
  if (hoursOld < 72) return 4;      // 3 days old
  return 2;                         // Older (frozen?)
}
```

#### Visual Freshness Badges

| Score | Badge | Color | Text |
|-------|-------|-------|------|
| 9-10 | 🐟✨ | Green | "Caught Today" |
| 7-8 | 🐟 | Blue | "Fresh - 1 Day" |
| 5-6 | ⚠ | Yellow | "2-3 Days Old" |
| <5 | ❄ | Gray | "Frozen/Processed" |

#### UI Implementation

```tsx
<ProductCard>
  {product.metadata.freshness_score >= 9 && (
    <Badge className="bg-green-600 text-white">
      🐟✨ Caught Today
    </Badge>
  )}

  {product.metadata.catch_date && (
    <span className="text-xs text-muted-foreground">
      Caught: {formatDate(product.metadata.catch_date)}
    </span>
  )}
</ProductCard>
```

### 7.2 Cleaning Options Visualization

Each cleaning type has specific instructions and visuals.

#### Cleaning Type Details

```typescript
interface CleaningOption {
  type: 'whole' | 'cleaned' | 'cut' | 'fillet';
  tamil_name: string;
  description: string;
  process_steps: string[];
  best_for: string[];
  price_modifier: number;       // Multiplier (fillet costs 1.2x whole)
  prep_time_minutes: number;    // Prep time saved
  image_guide?: string;         // Visual guide URL
}

const cleaningOptions: CleaningOption[] = [
  {
    type: 'whole',
    tamil_name: 'முழு மீன்',
    description: 'Unprocessed fish as caught, with scales and gut',
    process_steps: [],
    best_for: ['Traditional curry', 'Whole grilling', 'Fish head curry'],
    price_modifier: 1.0,
    prep_time_minutes: 15,
    image_guide: '/guides/cleaning-whole.png'
  },
  {
    type: 'cleaned',
    tamil_name: 'சுத்தம் செய்த',
    description: 'Gutted, scaled, and ready to cook',
    process_steps: ['Descaling', 'Gut removal', 'Gills removed', 'Washed'],
    best_for: ['Fish curry', 'Frying', 'Most recipes'],
    price_modifier: 1.1,
    prep_time_minutes: 5,
    image_guide: '/guides/cleaning-cleaned.png'
  },
  {
    type: 'cut',
    tamil_name: 'துண்டுகள்',
    description: 'Cut into curry-sized pieces with bones',
    process_steps: ['Cleaned', 'Cut into 2-inch pieces', 'Bone-in'],
    best_for: ['Fish curry', 'Fish fry', 'Gravy dishes'],
    price_modifier: 1.15,
    prep_time_minutes: 0,
    image_guide: '/guides/cleaning-cut.png'
  },
  {
    type: 'fillet',
    tamil_name: 'மீன் சதை',
    description: 'Boneless fillet, ready for pan frying',
    process_steps: ['Cleaned', 'Filleted', 'Deboned', 'Skinned (optional)'],
    best_for: ['Pan frying', 'Kids meals', 'Quick cooking'],
    price_modifier: 1.25,
    prep_time_minutes: 0,
    image_guide: '/guides/cleaning-fillet.png'
  }
];
```

#### Product Variants by Cleaning Type

Each fish product has 4 cleaning variants x 3 weight options = 12 SKUs

```
Seer Fish:
├─ Whole
│  ├─ 500g (₹375)
│  ├─ 1kg (₹750)
│  └─ 2kg (₹1500)
├─ Cleaned
│  ├─ 500g (₹412)
│  ├─ 1kg (₹825)
│  └─ 2kg (₹1650)
├─ Cut Pieces
│  ├─ 500g (₹431)
│  ├─ 1kg (₹862)
│  └─ 2kg (₹1725)
└─ Fillet
   ├─ 500g (₹468)
   ├─ 1kg (₹937)
   └─ 2kg (₹1875)
```

### 7.3 Seasonal Availability Calendar

Many fish species are seasonal in Tamil Nadu coastal waters.

#### Seasonal Data

```typescript
interface SeasonalAvailability {
  species: string;
  peak_months: string[];        // ["Jun", "Jul", "Aug"]
  available_months: string[];   // Broader availability
  reason: string;               // Why seasonal
  alternative?: string;         // Suggest alternative when out of season
}

const seasonalData = [
  {
    species: 'Seer Fish',
    peak_months: ['Jun', 'Jul', 'Aug', 'Sep'],
    available_months: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    reason: 'Monsoon season spawning',
    alternative: 'King Fish'
  },
  {
    species: 'Pomfret',
    peak_months: ['Nov', 'Dec', 'Jan', 'Feb'],
    available_months: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    reason: 'Winter months',
    alternative: 'Silver Pomfret'
  },
  {
    species: 'Tiger Prawns',
    peak_months: ['Apr', 'May', 'Jun'],
    available_months: ['Mar', 'Apr', 'May', 'Jun', 'Jul'],
    reason: 'Summer breeding season',
    alternative: 'White Prawns'
  }
];
```

#### UI Indicators

```tsx
<ProductCard>
  {isCurrentlyInSeason(product) && (
    <Badge className="bg-green-600">
      🌊 In Season
    </Badge>
  )}

  {isPeakSeason(product) && (
    <Badge className="bg-blue-600 animate-pulse">
      ⭐ Peak Season - Best Quality!
    </Badge>
  )}

  {!isCurrentlyAvailable(product) && (
    <div className="text-sm text-amber-600">
      Out of season. Try {product.metadata.alternative} instead.
    </div>
  )}
</ProductCard>
```

### 7.4 Nutritional Information

Fish is highly nutritious. We display detailed nutrition facts.

#### Nutritional Data Model

```typescript
interface NutritionalInfo {
  serving_size: string;           // "Per 100g"
  calories: number;               // kcal
  protein: number;                // grams
  total_fat: number;              // grams
  saturated_fat: number;          // grams
  omega3_fatty_acids: number;     // grams
  cholesterol: number;            // mg
  sodium: number;                 // mg
  vitamins: {
    vitamin_a?: number;           // IU
    vitamin_d?: number;           // IU
    vitamin_b12?: number;         // mcg
  };
  minerals: {
    calcium?: number;             // mg
    iron?: number;                // mg
    phosphorus?: number;          // mg
  };
}

// Example: Seer Fish Nutrition
const seerFishNutrition: NutritionalInfo = {
  serving_size: "Per 100g",
  calories: 114,
  protein: 24.2,
  total_fat: 1.7,
  saturated_fat: 0.4,
  omega3_fatty_acids: 0.8,
  cholesterol: 56,
  sodium: 67,
  vitamins: {
    vitamin_a: 147,
    vitamin_d: 40,
    vitamin_b12: 1.2
  },
  minerals: {
    calcium: 12,
    iron: 0.8,
    phosphorus: 210
  }
};
```

#### Nutrition Facts Table

```tsx
<Tabs>
  <TabsList>
    <TabsTrigger value="description">Description</TabsTrigger>
    <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
    <TabsTrigger value="reviews">Reviews</TabsTrigger>
  </TabsList>

  <TabsContent value="nutrition">
    <table className="w-full">
      <thead>
        <tr>
          <th colSpan={2}>Nutrition Facts</th>
        </tr>
        <tr>
          <td colSpan={2}>{nutrition.serving_size}</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Calories</td>
          <td>{nutrition.calories} kcal</td>
        </tr>
        <tr className="font-semibold">
          <td>Protein</td>
          <td>{nutrition.protein}g</td>
        </tr>
        <tr>
          <td>Total Fat</td>
          <td>{nutrition.total_fat}g</td>
        </tr>
        <tr className="text-blue-600">
          <td>Omega-3</td>
          <td>{nutrition.omega3_fatty_acids}g</td>
        </tr>
      </tbody>
    </table>
  </TabsContent>
</Tabs>
```

### 7.5 Tamil Language Integration

Complete bilingual support for local Tamil Nadu customers.

#### Multilingual Data Structure

```typescript
interface MultilingualProduct {
  // English (primary)
  title: string;
  description: string;

  // Tamil
  title_tamil: string;
  description_tamil?: string;

  // Display pattern
  display_name: string;  // "Seer Fish - வஞ்சிரம் (Vanjaram)"
}

// Implementation
const displayProductName = (product: Product) => {
  const english = product.title;
  const tamil = product.metadata.name_tamil || product.subtitle;
  return tamil ? `${english} - ${tamil}` : english;
};
```

#### Common Tamil Fish Names

| English | Tamil | Transliteration |
|---------|-------|-----------------|
| Seer Fish | வஞ்சிரம் | Vanjaram |
| Pomfret | வாவல் | Vaaval |
| King Fish | நெய்மீன் | Neymeen |
| Mackerel | காண்டை | Kaandai |
| Sardine | மத்தி | Mathi |
| Prawn | இறால் | Iraal |
| Crab | நண்டு | Nandu |
| Squid | கணவாய் | Kanavai |
| Tuna | சூரை | Soorai |
| Red Snapper | ஸ்னாப்பர் | Snapper |

#### UI Language Toggle (Future)

```tsx
<Select value={language} onValueChange={setLanguage}>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="en">English</SelectItem>
    <SelectItem value="ta">தமிழ்</SelectItem>
    <SelectItem value="both">Both (Default)</SelectItem>
  </SelectContent>
</Select>
```

### 7.6 Cold Chain & Delivery Handling

Fresh fish requires special handling to maintain quality.

#### Temperature Monitoring

```typescript
interface ColdChainTracking {
  product_id: string;
  temperature_log: {
    timestamp: Date;
    temperature_celsius: number;
    location: string;
  }[];
  packaging: {
    ice_packs: number;
    insulated_box: boolean;
    gel_packs: boolean;
  };
  max_transit_time_hours: number;  // 4 hours for fresh fish
  delivery_instructions: string;
}
```

#### Packaging Guidelines

| Product Type | Packaging | Max Transit | Ice Requirement |
|--------------|-----------|-------------|-----------------|
| Fresh Fish | Insulated box + ice | 4 hours | 2 kg ice per 5 kg fish |
| Prawns/Crabs | Sealed bag + ice | 3 hours | 3 kg ice per 5 kg |
| Frozen Fish | Insulated box + gel packs | 6 hours | Gel packs |
| Dried Fish | Standard packaging | 24 hours | No ice needed |

#### Delivery Guarantees

```typescript
const deliveryGuarantees = {
  fresh_fish: {
    max_delivery_time: '4 hours from dispatch',
    temperature_range: '0-4°C',
    quality_guarantee: 'Fresh or full refund',
    packaging: 'Insulated ice box'
  },
  frozen_fish: {
    max_delivery_time: '6 hours from dispatch',
    temperature_range: '-18°C',
    quality_guarantee: 'Frozen or full refund',
    packaging: 'Insulated with gel packs'
  }
};
```

---

*Due to character limits, this document continues in the next section...*

## 8. Database Design

### 8.1 Entity Relationship Diagram

**Core Entities:**
```
Customer ──┬── Cart ──── CartItem ──── ProductVariant
           │
           └── Order ──── OrderItem ──── ProductVariant
                  │
                  ├── Address
                  ├── Payment
                  └── Fulfillment

Product ──── ProductVariant ──── VariantOption
   │
   └── ProductCategory

Zone (Custom Module)
   │
   ├── DeliverySlot
   └── ZonePricing
```

### 8.2 Core Tables

**Customer Table:**
```sql
CREATE TABLE customer (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  has_account BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB  -- Preferences, zone, segment
);
```

**Product Table (Extended):**
```sql
CREATE TABLE product (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  name_tamil VARCHAR(255),  -- Tamil name
  handle VARCHAR(255) UNIQUE,
  description TEXT,
  nutritional_info JSONB,  -- {protein: 20g, omega3: 2g, ...}
  is_giftcard BOOLEAN DEFAULT false,
  thumbnail VARCHAR(500),
  weight INT,  -- Default weight in grams
  length INT,  -- For fish
  height INT,
  width INT,
  hs_code VARCHAR(50),
  origin_country VARCHAR(2),
  freshness_score DECIMAL(3,1),  -- 1.0-10.0
  catch_date DATE,
  seasonal_availability JSONB,  -- {months: [1,2,3,...]}
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Product Category Table (Extended):**
```sql
CREATE TABLE product_category (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_tamil VARCHAR(255),
  handle VARCHAR(255) UNIQUE,
  description TEXT,
  icon VARCHAR(50),  -- Emoji or icon name
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  parent_category_id VARCHAR(36),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_category_id) REFERENCES product_category(id)
);
```

**Product Variant Table:**
```sql
CREATE TABLE product_variant (
  id VARCHAR(36) PRIMARY KEY,
  product_id VARCHAR(36) NOT NULL,
  title VARCHAR(255),  -- "500g - Cleaned"
  sku VARCHAR(100) UNIQUE,
  barcode VARCHAR(100),
  ean VARCHAR(100),
  upc VARCHAR(100),
  inventory_quantity INT DEFAULT 0,
  allow_backorder BOOLEAN DEFAULT false,
  manage_inventory BOOLEAN DEFAULT true,
  weight INT,  -- Weight in grams
  length INT,
  height INT,
  width INT,
  material VARCHAR(100),  -- Cleaning type
  metadata JSONB,  -- {cleaning_type: 'whole', weight_option: '500g'}
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);
```

**Zone Table (Custom):**
```sql
CREATE TABLE zone (
  id VARCHAR(36) PRIMARY KEY,
  zone_name VARCHAR(100) NOT NULL,  -- "Zone A", "Zone B", etc.
  center_lat DECIMAL(10, 7) NOT NULL,  -- 13.0827 (Chennai)
  center_lng DECIMAL(10, 7) NOT NULL,  -- 80.2707
  radius_km DECIMAL(5, 2) NOT NULL,  -- 5.00, 10.00, etc.
  delivery_charge INT NOT NULL,  -- In paise (0, 3000, 5000, 8000)
  min_order_amount INT NOT NULL,  -- In paise (30000, 40000, etc.)
  delivery_slots JSONB,  -- [{id, name, start, end, icon}]
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Cart Table:**
```sql
CREATE TABLE cart (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255),
  customer_id VARCHAR(36),
  region_id VARCHAR(36),
  payment_id VARCHAR(36),
  type VARCHAR(50) DEFAULT 'default',
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB,  -- {zone, deliverySlot, ...}
  FOREIGN KEY (customer_id) REFERENCES customer(id)
);
```

**Cart Item Table:**
```sql
CREATE TABLE cart_item (
  id VARCHAR(36) PRIMARY KEY,
  cart_id VARCHAR(36) NOT NULL,
  variant_id VARCHAR(36) NOT NULL,
  quantity INT NOT NULL,
  unit_price INT,  -- In paise
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
  FOREIGN KEY (variant_id) REFERENCES product_variant(id)
);
```

**Order Table:**
```sql
CREATE TABLE order (
  id VARCHAR(36) PRIMARY KEY,
  display_id INT UNIQUE AUTO_INCREMENT,  -- #1001, #1002
  customer_id VARCHAR(36) NOT NULL,
  email VARCHAR(255) NOT NULL,
  cart_id VARCHAR(36),
  region_id VARCHAR(36),
  currency_code VARCHAR(3) DEFAULT 'INR',
  tax_total INT DEFAULT 0,
  shipping_total INT DEFAULT 0,  -- Delivery charge
  discount_total INT DEFAULT 0,
  subtotal INT NOT NULL,
  total INT NOT NULL,  -- All in paise
  status VARCHAR(50) DEFAULT 'pending',  -- pending, confirmed, processing, shipped, delivered, cancelled
  payment_status VARCHAR(50) DEFAULT 'pending',
  fulfillment_status VARCHAR(50) DEFAULT 'not_fulfilled',
  delivery_slot_id VARCHAR(36),
  delivery_slot_date DATE,
  zone_id VARCHAR(36),
  metadata JSONB,  -- {freshnessScores, specialInstructions}
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer(id),
  FOREIGN KEY (cart_id) REFERENCES cart(id),
  FOREIGN KEY (zone_id) REFERENCES zone(id)
);
```

**Address Table:**
```sql
CREATE TABLE address (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36),
  company VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  address_1 VARCHAR(500) NOT NULL,
  address_2 VARCHAR(500),
  city VARCHAR(100) NOT NULL,
  country_code VARCHAR(2) DEFAULT 'IN',
  province VARCHAR(100),  -- Tamil Nadu
  postal_code VARCHAR(20),
  phone VARCHAR(20),
  coordinates JSONB,  -- {lat: 13.0827, lng: 80.2707}
  zone_id VARCHAR(36),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer(id),
  FOREIGN KEY (zone_id) REFERENCES zone(id)
);
```

### 8.3 Indexes

**Performance Optimization:**
```sql
-- Product search
CREATE INDEX idx_product_title ON product(title);
CREATE INDEX idx_product_handle ON product(handle);
CREATE INDEX idx_product_name_tamil ON product(name_tamil);
CREATE INDEX idx_product_freshness ON product(freshness_score DESC);
CREATE INDEX idx_product_catch_date ON product(catch_date DESC);

-- Product variants
CREATE INDEX idx_variant_product_id ON product_variant(product_id);
CREATE INDEX idx_variant_sku ON product_variant(sku);

-- Orders
CREATE INDEX idx_order_customer ON order(customer_id);
CREATE INDEX idx_order_status ON order(status);
CREATE INDEX idx_order_created ON order(created_at DESC);
CREATE INDEX idx_order_display_id ON order(display_id);

-- Cart
CREATE INDEX idx_cart_customer ON cart(customer_id);
CREATE INDEX idx_cart_email ON cart(email);

-- Zone lookup (most frequent query)
CREATE INDEX idx_zone_active ON zone(is_active);

-- Address zone lookup
CREATE INDEX idx_address_zone ON address(zone_id);
CREATE INDEX idx_address_customer ON address(customer_id);
```

### 8.4 Data Validation

**Zod Schemas:**
```typescript
import { z } from 'zod';

// Product schema
export const ProductSchema = z.object({
  title: z.string().min(3).max(255),
  name_tamil: z.string().optional(),
  description: z.string().optional(),
  freshness_score: z.number().min(1).max(10).optional(),
  catch_date: z.date().optional(),
  nutritional_info: z.object({
    protein: z.string(),
    omega3: z.string(),
    calories: z.string(),
  }).optional(),
});

// Order schema
export const OrderSchema = z.object({
  customer_id: z.string().uuid(),
  email: z.string().email(),
  total: z.number().int().positive(),
  delivery_slot_id: z.string(),
  delivery_slot_date: z.date(),
  zone_id: z.string().uuid(),
  shipping_address: z.object({
    address_1: z.string().min(5),
    city: z.string(),
    phone: z.string().regex(/^[6-9]\d{9}$/), // Indian mobile
    coordinates: z.object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    }),
  }),
});

// Zone check schema
export const ZoneCheckSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});
```

### 8.5 Seed Data

**Zone Seeding:**
```typescript
// my-medusa-store/src/scripts/seed-zones.ts
const zones = [
  {
    zone_name: 'Zone A',
    center_lat: 13.0827,
    center_lng: 80.2707,
    radius_km: 5.0,
    delivery_charge: 0,  // Free
    min_order_amount: 30000,  // ₹300
    delivery_slots: [
      { id: 'sunrise', name: 'Sunrise', start: '06:00', end: '08:00', icon: '🌅' },
      { id: 'morning', name: 'Morning', start: '08:00', end: '12:00', icon: '🌞' },
      { id: 'evening', name: 'Evening', start: '16:00', end: '19:00', icon: '🌆' },
    ],
    is_active: true,
  },
  // Zone B, C, D...
];
```

---

## 9. API Architecture

### 9.1 Store API Endpoints

**Base URL**: `http://localhost:9000/store`

#### Product Endpoints

**GET /store/products**
```typescript
// List all products with filtering
Request:
GET /store/products?q=seer&limit=20&offset=0

Response: 200 OK
{
  "products": [
    {
      "id": "prod_01JQWE...",
      "title": "Seer Fish",
      "name_tamil": "வஞ்சிரம்",
      "handle": "seer-fish",
      "description": "Premium quality seer fish...",
      "thumbnail": "https://.../seer.jpg",
      "freshness_score": 9.5,
      "catch_date": "2025-01-15",
      "variants": [
        {
          "id": "variant_01...",
          "title": "500g - Whole",
          "calculated_price": 37500,  // ₹375
          "inventory_quantity": 25
        }
      ],
      "categories": [...]
    }
  ],
  "count": 34,
  "limit": 20,
  "offset": 0
}
```

**GET /store/products/:id**
```typescript
// Get single product details
Request:
GET /store/products/prod_01JQWE...

Response: 200 OK
{
  "product": {
    "id": "prod_01JQWE...",
    "title": "Seer Fish",
    "name_tamil": "வஞ்சிரம்",
    "description": "...",
    "freshness_score": 9.5,
    "nutritional_info": {
      "protein": "20g per 100g",
      "omega3": "2.2g",
      "calories": "134 kcal"
    },
    "seasonal_availability": { "months": [1,2,3,10,11,12] },
    "variants": [...],
    "images": [...]
  }
}
```

#### Zone Endpoints (Custom)

**POST /store/zones/check**
```typescript
// Check delivery zone by GPS coordinates
Request:
POST /store/zones/check
{
  "latitude": 13.0827,
  "longitude": 80.2707
}

Response: 200 OK
{
  "zone": {
    "id": "zone_01...",
    "zone_name": "Zone A",
    "radius_km": 5.0,
    "delivery_charge": 0,  // ₹0 (free)
    "min_order_amount": 30000,  // ₹300
    "distance_km": 2.3,
    "delivery_slots": [
      {
        "id": "sunrise",
        "name": "Sunrise",
        "start": "06:00",
        "end": "08:00",
        "icon": "🌅",
        "available": true
      },
      {
        "id": "morning",
        "name": "Morning",
        "start": "08:00",
        "end": "12:00",
        "icon": "🌞",
        "available": true
      },
      {
        "id": "evening",
        "name": "Evening",
        "start": "16:00",
        "end": "19:00",
        "icon": "🌆",
        "available": false
      }
    ]
  }
}

// Not in service area
Response: 404 Not Found
{
  "error": "ZONE_NOT_FOUND",
  "message": "Sorry, we don't deliver to your location yet",
  "nearest_zone": "Zone D",
  "distance_km": 28.5
}
```

**GET /store/zones**
```typescript
// List all delivery zones
Request:
GET /store/zones

Response: 200 OK
{
  "zones": [
    {
      "id": "zone_01...",
      "zone_name": "Zone A",
      "radius_km": 5.0,
      "delivery_charge": 0,
      "min_order_amount": 30000
    },
    // Zone B, C, D...
  ]
}
```

**GET /store/delivery-slots**
```typescript
// Get available delivery slots for a date
Request:
GET /store/delivery-slots?date=2025-01-20&zone_id=zone_01...

Response: 200 OK
{
  "slots": [
    {
      "id": "sunrise",
      "name": "Sunrise",
      "start": "06:00",
      "end": "08:00",
      "icon": "🌅",
      "available": true,
      "capacity": 50,
      "booked": 12
    },
    {
      "id": "morning",
      "name": "Morning",
      "start": "08:00",
      "end": "12:00",
      "icon": "🌞",
      "available": true,
      "capacity": 100,
      "booked": 67
    }
  ]
}
```

#### Cart Endpoints

**POST /store/carts**
```typescript
// Create new cart
Request:
POST /store/carts
{
  "region_id": "reg_01...",
  "country_code": "in"
}

Response: 200 OK
{
  "cart": {
    "id": "cart_01...",
    "email": null,
    "customer_id": null,
    "items": [],
    "region": {...},
    "total": 0,
    "subtotal": 0,
    "tax_total": 0,
    "shipping_total": 0
  }
}
```

**POST /store/carts/:id/line-items**
```typescript
// Add item to cart
Request:
POST /store/carts/cart_01.../line-items
{
  "variant_id": "variant_01...",
  "quantity": 2
}

Response: 200 OK
{
  "cart": {
    "id": "cart_01...",
    "items": [
      {
        "id": "item_01...",
        "variant_id": "variant_01...",
        "title": "Seer Fish",
        "variant_title": "500g - Cleaned",
        "quantity": 2,
        "unit_price": 41250,  // ₹412.50 (10% cleaning fee)
        "total": 82500,  // ₹825
        "thumbnail": "...",
        "product": {...}
      }
    ],
    "subtotal": 82500,
    "total": 82500
  }
}
```

**POST /store/carts/:id/line-items/:line_id**
```typescript
// Update cart item quantity
Request:
POST /store/carts/cart_01.../line-items/item_01...
{
  "quantity": 3
}

Response: 200 OK
{
  "cart": {
    "id": "cart_01...",
    "items": [{...}],
    "subtotal": 123750,  // ₹1237.50
    "total": 123750
  }
}
```

**DELETE /store/carts/:id/line-items/:line_id**
```typescript
// Remove item from cart
Request:
DELETE /store/carts/cart_01.../line-items/item_01...

Response: 200 OK
{
  "cart": {
    "id": "cart_01...",
    "items": [],
    "total": 0
  }
}
```

**POST /store/carts/:id/complete**
```typescript
// Complete cart and create order
Request:
POST /store/carts/cart_01.../complete

Response: 200 OK
{
  "type": "order",
  "data": {
    "id": "order_01...",
    "display_id": 1001,
    "status": "pending",
    "customer_id": "cus_01...",
    "email": "customer@example.com",
    "total": 123750,
    "items": [...],
    "shipping_address": {...},
    "payment": {...}
  }
}
```

#### Auth Endpoints

**POST /store/auth**
```typescript
// Customer login
Request:
POST /store/auth
{
  "email": "customer@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "customer": {
    "id": "cus_01...",
    "email": "customer@example.com",
    "first_name": "Rajesh",
    "last_name": "Kumar",
    "phone": "+919876543210",
    "has_account": true,
    "metadata": {
      "preferred_zone": "zone_01...",
      "segment": ["frequent_buyer"]
    }
  }
}

// Invalid credentials
Response: 401 Unauthorized
{
  "error": "INVALID_CREDENTIALS",
  "message": "Invalid email or password"
}
```

**POST /store/customers**
```typescript
// Customer registration
Request:
POST /store/customers
{
  "email": "newcustomer@example.com",
  "password": "password123",
  "first_name": "Priya",
  "last_name": "Sharma",
  "phone": "+919876543210"
}

Response: 200 OK
{
  "customer": {
    "id": "cus_02...",
    "email": "newcustomer@example.com",
    "first_name": "Priya",
    "last_name": "Sharma",
    "phone": "+919876543210",
    "has_account": true
  }
}

// Email already exists
Response: 422 Unprocessable Entity
{
  "error": "DUPLICATE_EMAIL",
  "message": "A customer with this email already exists"
}
```

**DELETE /store/auth**
```typescript
// Customer logout
Request:
DELETE /store/auth

Response: 200 OK
{
  "message": "Logged out successfully"
}
```

#### Order Endpoints

**GET /store/customers/me/orders**
```typescript
// Get customer's orders
Request:
GET /store/customers/me/orders?limit=10&offset=0

Response: 200 OK
{
  "orders": [
    {
      "id": "order_01...",
      "display_id": 1001,
      "status": "delivered",
      "total": 123750,  // ₹1237.50
      "items": [
        {
          "title": "Seer Fish",
          "variant_title": "500g - Cleaned",
          "quantity": 2,
          "unit_price": 41250,
          "total": 82500
        }
      ],
      "shipping_address": {
        "address_1": "123 Anna Nagar",
        "city": "Chennai",
        "postal_code": "600040"
      },
      "delivery_slot": "Morning (8:00 AM - 12:00 PM)",
      "created_at": "2025-01-15T10:30:00Z",
      "delivered_at": "2025-01-15T11:45:00Z"
    }
  ],
  "count": 5,
  "limit": 10,
  "offset": 0
}
```

**GET /store/orders/:id**
```typescript
// Get order details
Request:
GET /store/orders/order_01...

Response: 200 OK
{
  "order": {
    "id": "order_01...",
    "display_id": 1001,
    "status": "processing",
    "payment_status": "captured",
    "fulfillment_status": "fulfilled",
    "items": [...],
    "shipping_address": {...},
    "billing_address": {...},
    "total": 123750,
    "shipping_total": 0,
    "tax_total": 0,
    "discount_total": 0,
    "zone": {
      "zone_name": "Zone A",
      "delivery_charge": 0
    },
    "delivery_slot": "Morning",
    "delivery_slot_date": "2025-01-20",
    "tracking": {
      "status": "picked_up",
      "estimated_delivery": "2025-01-20T11:30:00Z",
      "partner": {
        "name": "Delivery Partner",
        "phone": "+919876543210"
      }
    },
    "created_at": "2025-01-20T09:15:00Z"
  }
}
```

### 9.2 Admin API Endpoints

**Base URL**: `http://localhost:9000/admin`

#### Product Management

**POST /admin/products**
```typescript
// Create new product
Request:
POST /admin/products
{
  "title": "Pomfret",
  "name_tamil": "வாவல் மீன்",
  "description": "Premium white pomfret...",
  "thumbnail": "https://.../pomfret.jpg",
  "freshness_score": 9.0,
  "catch_date": "2025-01-20",
  "nutritional_info": {
    "protein": "18g",
    "omega3": "1.5g"
  },
  "status": "published"
}

Response: 201 Created
{
  "product": {
    "id": "prod_03...",
    "title": "Pomfret",
    "name_tamil": "வாவல் மீன்",
    //...
  }
}
```

**POST /admin/products/:id/variants**
```typescript
// Add product variant
Request:
POST /admin/products/prod_03.../variants
{
  "title": "1kg - Cleaned",
  "sku": "POMF-1KG-CLN",
  "prices": [
    {
      "amount": 66000,  // ₹660
      "currency_code": "inr"
    }
  ],
  "inventory_quantity": 50,
  "metadata": {
    "cleaning_type": "cleaned",
    "weight_option": "1kg"
  }
}

Response: 201 Created
{
  "variant": {
    "id": "variant_03...",
    "title": "1kg - Cleaned",
    "sku": "POMF-1KG-CLN",
    "prices": [...]
  }
}
```

#### Order Management

**GET /admin/orders**
```typescript
// List all orders with filters
Request:
GET /admin/orders?status=pending&limit=50

Response: 200 OK
{
  "orders": [...],
  "count": 120,
  "limit": 50,
  "offset": 0
}
```

**POST /admin/orders/:id/fulfillment**
```typescript
// Create fulfillment
Request:
POST /admin/orders/order_01.../fulfillment
{
  "items": [
    {
      "item_id": "item_01...",
      "quantity": 2
    }
  ],
  "no_notification": false
}

Response: 200 OK
{
  "order": {
    "id": "order_01...",
    "fulfillment_status": "fulfilled",
    "fulfillments": [
      {
        "id": "ful_01...",
        "items": [...],
        "shipped_at": "2025-01-20T10:00:00Z"
      }
    ]
  }
}
```

### 9.3 API Proxy Pattern (Storefront)

**Implementation:** `storefront/src/app/api/store/[...path]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_...';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${MEDUSA_BACKEND_URL}/store/${path.join('/')}${searchParams ? `?${searchParams}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-publishable-api-key': PUBLISHABLE_API_KEY,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const body = await request.json();
  const url = `${MEDUSA_BACKEND_URL}/store/${path.join('/')}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'x-publishable-api-key': PUBLISHABLE_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    credentials: 'include',
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

// DELETE, PUT methods similar...
```

**Why API Proxy?**
1. **Security**: API key not exposed in client-side code
2. **CORS**: Avoid cross-origin issues between Next.js (port 3000) and Medusa (port 9000)
3. **SSR**: Works with server-side rendering
4. **Flexibility**: Easy to add middleware (logging, rate limiting)

### 9.4 Error Handling

**Standard Error Response:**
```typescript
interface ApiError {
  error: string;  // Error code
  message: string;  // Human-readable message
  details?: any;  // Additional context
}

// Examples:
{
  "error": "ZONE_NOT_FOUND",
  "message": "Sorry, we don't deliver to your location yet",
  "details": {
    "nearest_zone": "Zone D",
    "distance_km": 28.5
  }
}

{
  "error": "INSUFFICIENT_INVENTORY",
  "message": "Not enough stock available",
  "details": {
    "requested": 10,
    "available": 3
  }
}

{
  "error": "VALIDATION_ERROR",
  "message": "Invalid request data",
  "details": {
    "fields": {
      "phone": "Invalid phone number format"
    }
  }
}
```

**HTTP Status Codes:**
- `200 OK`: Successful GET/POST/PUT
- `201 Created`: Successful resource creation
- `204 No Content`: Successful DELETE
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server error

### 9.5 Authentication & Authorization

**JWT-Based Authentication:**
```typescript
// Login flow
POST /store/auth
→ Returns JWT token in cookie
→ Subsequent requests include cookie

// Protected endpoints
GET /store/customers/me/orders
→ Requires valid JWT
→ Returns 401 if not authenticated

// Logout
DELETE /store/auth
→ Clears JWT cookie
```

**API Key for Store Routes:**
```typescript
// All /store/* routes require publishable API key
Headers: {
  'x-publishable-api-key': 'pk_...'
}

// Admin routes require admin API key
Headers: {
  'x-medusa-access-token': 'admin_token...'
}
```

---

## 10. Frontend Architecture

### 10.1 Next.js App Structure

**App Router Directory:**
```
storefront/src/app/
├── layout.tsx              # Root layout with providers
├── page.tsx                # Homepage
├── products/
│   ├── page.tsx            # Product listing
│   └── [id]/page.tsx      # Product detail
├── cart/page.tsx           # Shopping cart
├── checkout/page.tsx       # Checkout
├── orders/
│   ├── page.tsx            # Order history
│   └── [id]/page.tsx      # Order detail
├── profile/page.tsx        # User profile
├── login/page.tsx          # Login
├── register/page.tsx       # Registration
└── api/store/[...path]/route.ts  # API proxy
```

### 10.2 State Management - Cart Context

```tsx
// storefront/src/context/CartContext.tsx
'use client';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineItemId: string) => Promise<void>;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState<Cart | null>(null);

  useEffect(() => {
    // Load cart from localStorage
    const savedCartId = localStorage.getItem('cart_id');
    if (savedCartId) {
      fetchCart(savedCartId);
    } else {
      createCart();
    }
  }, []);

  const addToCart = async (variantId, quantity) => {
    const response = await fetch(`/api/store/carts/${cart.id}/line-items`, {
      method: 'POST',
      body: JSON.stringify({ variant_id: variantId, quantity }),
    });
    const data = await response.json();
    setCart(data.cart);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, ... }}>
      {children}
    </CartContext.Provider>
  );
}
```

### 10.3 State Management - Auth Context

```tsx
// storefront/src/context/AuthContext.tsx
'use client';

interface AuthContextType {
  customer: Customer | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState<Customer | null>(null);

  const login = async (email, password) => {
    const response = await fetch('/api/store/auth', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    setCustomer(data.customer);
  };

  return (
    <AuthContext.Provider value={{ customer, login, logout, ... }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 10.4 Root Layout with Providers

```tsx
// storefront/src/app/layout.tsx
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 10.5 Component Patterns

**Server Component (SSR):**
```tsx
// storefront/src/app/products/page.tsx
export default async function ProductsPage() {
  const response = await fetch('http://localhost:9000/store/products');
  const { products } = await response.json();

  return <ProductGrid products={products} />;
}
```

**Client Component:**
```tsx
// storefront/src/components/ProductCard.tsx
'use client';

export function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <img src={product.thumbnail} alt={product.title} />
      <h3>{product.title}</h3>
      <p>{product.name_tamil}</p>
      <p>₹{product.price / 100}</p>
      <button onClick={() => addToCart(product.variant_id, 1)}>
        Add to Cart
      </button>
    </div>
  );
}
```

### 10.6 API Integration

**Zone Check:**
```tsx
const checkZone = async (lat, lng) => {
  const response = await fetch('/api/store/zones/check', {
    method: 'POST',
    body: JSON.stringify({ latitude: lat, longitude: lng }),
  });
  const { zone } = await response.json();
  return zone;
};
```

**Checkout:**
```tsx
const completeOrder = async () => {
  const response = await fetch(`/api/store/carts/${cartId}/complete`, {
    method: 'POST',
    body: JSON.stringify({
      shipping_address: { ... },
      delivery_slot_id: selectedSlot,
    }),
  });
  const { data } = await response.json();
  router.push(`/orders/${data.id}`);
};
```

### 10.7 Tailwind CSS Styling

```tsx
<div className="rounded-lg border p-4 hover:shadow-lg transition-shadow">
  <img className="w-full h-48 object-cover rounded-md" />
  <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
  <p className="text-sm text-gray-600">{name_tamil}</p>
  <p className="text-xl font-bold text-primary">₹{price}</p>
  <button className="w-full mt-4 bg-primary text-white py-2 rounded-md">
    Add to Cart
  </button>
</div>
```

---

## 11. Ecommerce Features

### 11.1 Product Discovery & Search

**Current:** Basic text search via Medusa `q` parameter
**Planned:** Advanced filtering + Elasticsearch

**Current Search:**
```tsx
// Simple text search
const products = await fetch('/api/store/products?q=seer');
```

**Planned Advanced Filtering:**
```tsx
const filters = {
  category: 'premium-fish',
  price_min: 50000,   // ₹500
  price_max: 100000,  // ₹1000
  freshness_min: 8,
  cleaning_type: ['cleaned', 'fillet'],
  in_stock: true,
  sort_by: 'freshness_desc'
};
```

**Future: Elasticsearch Integration:**
- Full-text search with Tamil language support
- Auto-complete suggestions
- Fuzzy matching (typo tolerance)
- Faceted search (category, price, freshness)
- Search analytics (trending queries)

### 11.2 Recommendation Engine

**5 Recommendation Types:**

1. **Product-Based**: "Customers who bought this also bought..."
2. **Collaborative Filtering**: Based on similar customers' purchases
3. **Recipe-Based**: "Perfect for Seer Fish Curry recipe"
4. **Trending**: Popular in user's zone this week
5. **Seasonal**: Fish in season right now

**Implementation:**
```tsx
// Recommendation API
GET /api/recommendations?type=product&product_id=prod_01...
GET /api/recommendations?type=trending&zone_id=zone_01...
GET /api/recommendations?type=seasonal&month=1

Response:
{
  "recommendations": [
    {
      "product_id": "prod_02...",
      "title": "Pomfret",
      "score": 0.85,
      "reason": "Often bought together"
    }
  ]
}
```

### 11.3 Cart Optimization

**Features:**
- **Persistent Cart**: localStorage + backend sync
- **Cart Abandonment Detection**: Track inactivity (5 min)
- **Free Delivery Progress**: "Add ₹200 more for free delivery"
- **Upselling**: "Complete your meal with..."
- **Cross-selling**: "Customers also added..."
- **Stock Alerts**: "Only 3 left at this price"

**Cart Summary:**
```tsx
<CartSummary>
  Subtotal: ₹825
  Delivery: ₹30 (Free for Zone A)
  Discount: -₹50
  Total: ₹805

  {totalNeededForFreeDelivery && (
    <FreeDeliveryProgress>
      Add ₹{remaining} more for FREE delivery
    </FreeDeliveryProgress>
  )}
</CartSummary>
```

### 11.4 Checkout Optimization

**Conversion Strategies:**

1. **Express Checkout**: One-click for returning customers
2. **Guest Checkout**: No account required
3. **Autofill**: Address autocomplete, saved addresses
4. **Multiple Payment Options**: UPI, Cards, COD, Wallets
5. **Order Summary**: Clear breakdown with freshness scores
6. **Delivery Slot Selection**: Visual calendar with availability
7. **Trust Signals**: Freshness guarantee, secure payment badges

**Checkout Flow:**
```
Cart Review
    ↓
Login / Guest
    ↓
Delivery Address (with GPS zone check)
    ↓
Delivery Slot Selection
    ↓
Payment Method
    ↓
Order Review
    ↓
Place Order
    ↓
Confirmation (SMS/WhatsApp)
```

### 11.5 Post-Purchase Experience

**Order Tracking:**
- Real-time delivery partner location
- SMS/WhatsApp updates at each stage
- Estimated delivery time
- Call delivery partner button

**Order Stages:**
1. Order Confirmed
2. Preparing Your Order (fish being cleaned)
3. Out for Delivery (live tracking)
4. Delivered (POD photo)

**Follow-up:**
- Review request (24 hours after delivery)
- Recipe suggestions based on order
- Reorder reminder (7 days later)
- Loyalty points/cashback

---

## Continued in Chapter 2

**Sections 12-22 are in:** `system_design_chapter_2.md`

Remaining sections cover:
- 12. Marketing & Conversion Optimization
- 13. Operations & Fulfillment
- 14. Analytics & Insights
- 15. Performance & Scalability
- 16. Security & Compliance
- 17. Monitoring & Observability
- 18. Deployment & DevOps
- 19. Mobile Strategy
- 20. Implementation Roadmap
- 21. Success Metrics
- 22. Risk Assessment & Mitigation

---

**Document Status:** Complete (22 sections across 2 files)
**Last Updated:** 2025-01-20
