# FreshCatch System Design - Chapter 2

**Sections 12-22** (Continuation of system_design.md)

---

## 12. Marketing & Conversion Optimization

### 12.1 Conversion Funnel

**Current Funnel:**
```
Homepage (100%) → Category (65%) → Product (29%) → Cart (7%) → Checkout (3%) → Order (1.8%)
```

**Target:** 1.8% → 3.5% conversion rate

**Optimization Strategies:**
- Homepage → Category: Personalized recommendations by zone
- Category → Product: Advanced filtering, freshness indicators
- Product → Cart: Trust badges, stock scarcity, reviews
- Cart → Checkout: Free delivery progress, cross-sell
- Checkout → Order: Express checkout, multiple payments

### 12.2 Cart Abandonment Recovery

**Email Sequence:**
1. **1 Hour**: Cart reminder
2. **24 Hours**: ₹50 discount + urgency
3. **3 Days**: Last chance + alternatives

**Recovery Rate Target:** 15-20%

### 12.3 Customer Segmentation

| Segment | Criteria | Strategy |
|---------|----------|----------|
| High-Value | >₹2000 or >5 orders | 5% cashback, exclusive access |
| Frequent | 3-5 orders/90 days | Weekly newsletters, recipes |
| Lapsed | >45 days inactive | ₹100 discount win-back |
| First-Time | No orders | 10% off, free delivery >₹500 |
| Zone-Based | A/B/C/D | Tailored delivery options |

### 12.4 Promotional Campaigns

**Seasonal:**
- Summer Festival (Apr-Jun): Premium fish 15% off
- Monsoon Specials (Jul-Sep): River fish discounts
- Flash Sales: Friday 6AM-12PM, 25-30% off

**Referral Program:**
- Referrer: ₹100 credit
- Referee: 15% off first order

### 12.5 A/B Testing

**Test Areas:**
- Homepage hero (static vs video)
- Product layout (single vs gallery)
- Checkout flow (single vs multi-step)
- Payment order (UPI first vs COD first)

---

## 13. Operations & Fulfillment

### 13.1 Order Processing Pipeline

```
Order Placed
    ↓ (30 sec)
Payment Verified
    ↓ (1 min)
Order Confirmed → SMS/Email
    ↓ (10-15 min)
Fish Preparation
    - Cleaning per variant
    - Quality check
    - Cold-chain packaging
    ↓ (5 min)
Delivery Partner Assigned
    ↓
Out for Delivery → Live Tracking
    ↓
Delivered → POD Photo
```

**Target Metrics:**
- Order-to-Delivery: <4 hours
- On-Time Delivery: >95%

### 13.2 Inventory Management

**Stock Rules:**
- Real-time updates on order confirmation
- Cart reservation: 15 minutes
- Low stock alerts at reorder point
- Auto-discount fish within 6 hours of expiry

### 13.3 Supplier Integration

**Supplier Network:**
- 5-10 fishing harbors (Chennai, Kasimedu, Ennore)
- 3-5 backup wholesalers
- Quality scoring (rating, freshness, on-time %)

**Selection Algorithm:** Price (30%) + Quality (30%) + Location (20%) + Reliability (20%)

### 13.4 Quality Control

**Freshness Scoring (1-10):**
- Eye clarity (25%)
- Gill color (25%)
- Smell (25%)
- Texture (15%)
- Skin mucus (10%)

**Rejection:** Score < 6 → Reject batch, notify supplier

### 13.5 Cold-Chain Logistics

**Temperature Control:**
- Storage: 0-4°C
- Preparation: <10°C
- Transit: Ice packs, insulated bags
- Delivery window: <4 hours from packaging

### 13.6 Returns & Refunds

**Policy:**
- Quality issues: Full refund + replacement
- Wrong item: Free replacement
- Late delivery: 20% discount next order
- Customer changed mind: No return (perishable)

**Refund Processing:**
- UPI/Card: 2-3 business days
- Wallet: Instant credit

---

## 14. Analytics & Insights

### 14.1 Event Tracking

**Key Events:**
```typescript
// Page views
track('page_view', { page: 'products', category: 'premium-fish' });

// Product interactions
track('product_view', { product_id, name, price });
track('add_to_cart', { product_id, variant_id, quantity, value });

// Checkout funnel
track('begin_checkout', { cart_id, value, item_count });
track('add_shipping_info', { zone, delivery_slot });
track('add_payment_info', { payment_method });
track('purchase', { order_id, value, items });

// Zone events
track('zone_check', { lat, lng, zone_result, distance });
```

### 14.2 Business Metrics Dashboard

**Revenue Metrics:**
- Daily/Weekly/Monthly revenue
- Average order value (AOV)
- Revenue per zone
- Revenue by product category

**Customer Metrics:**
- New vs returning customers
- Customer lifetime value (CLV)
- Churn rate
- Net Promoter Score (NPS)

**Operational Metrics:**
- Orders per day
- On-time delivery rate
- Quality rejection rate
- Average fulfillment time

### 14.3 Product Analytics

- Best sellers by zone/season
- Slow-moving inventory
- Price elasticity analysis
- Category performance
- Freshness score trends

### 14.4 Customer Analytics

- Purchase frequency
- Basket composition
- Zone distribution
- Preferred delivery slots
- Segment migration

---

## 15. Performance & Scalability

### 15.1 Caching Strategy

**3-Layer Cache:**

```
Browser Cache (1 hour)
    ↓
CDN Cache (images, static assets)
    ↓
Redis Cache (API responses)
    ↓
PostgreSQL (persistent data)
```

**Cache Keys:**
```typescript
// Product list (5 min TTL)
cache.set('products:list:page:1', products, 300);

// Zone data (1 hour TTL)
cache.set('zones:all', zones, 3600);

// User cart (no TTL, invalidate on update)
cache.set(`cart:${cartId}`, cart);
```

### 15.2 Image Optimization

**Current:** Static images in `/public/images/`
**Planned:**
- WebP/AVIF format
- Responsive images (srcset)
- Lazy loading
- CDN delivery (CloudFront/Cloudflare)
- Image compression (85% quality)

### 15.3 Code Splitting

**Next.js Automatic:**
- Page-based splitting
- Dynamic imports for heavy components

```tsx
// Lazy load heavy components
const DeliveryMap = dynamic(() => import('@/components/DeliveryMap'), {
  loading: () => <MapSkeleton />,
  ssr: false
});
```

### 15.4 Database Optimization

**Indexes:** Product search, order lookup, zone queries
**Connection Pooling:** PgBouncer (max 100 connections)
**Query Optimization:** Avoid N+1, use joins

### 15.5 Horizontal Scaling

**Architecture for Scale:**
```
Load Balancer (nginx/ALB)
    ↓
App Servers (3+ instances)
    ↓
Redis Cluster (session/cache)
    ↓
PostgreSQL (primary + read replicas)
```

---

## 16. Security & Compliance

### 16.1 Authentication

**Customer Auth:**
- JWT tokens (httpOnly cookies)
- Session duration: 7 days
- Refresh token rotation
- Phone OTP verification

**Admin Auth:**
- API key + JWT
- Role-based access (admin, operator, viewer)
- IP whitelisting (optional)

### 16.2 Data Protection

**Encryption:**
- At rest: AES-256 (database)
- In transit: TLS 1.3 (HTTPS)
- Passwords: bcrypt (cost factor 12)

**PII Handling:**
- Mask phone numbers in logs
- Encrypt addresses
- Data retention: 2 years orders, 30 days logs

### 16.3 Input Validation

```typescript
// Server-side validation (Zod)
const OrderSchema = z.object({
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  address: z.string().min(10).max(500),
  total: z.number().positive(),
});

// Sanitize all user inputs
const sanitizedInput = DOMPurify.sanitize(userInput);
```

### 16.4 API Security

- Rate limiting: 100 req/min per IP
- CORS: Whitelist frontend domain only
- API key validation for all /store routes
- SQL injection prevention (parameterized queries)
- XSS prevention (Content Security Policy)

### 16.5 Payment Security

**PCI DSS Compliance:**
- No card data storage
- Tokenization via payment gateway (Razorpay)
- Secure checkout iframe
- 3D Secure for cards

### 16.6 GDPR/Data Privacy

- Privacy policy page
- Cookie consent banner
- Data export on request
- Account deletion capability
- Marketing opt-in/opt-out

---

## 17. Monitoring & Observability

### 17.1 Error Tracking

**Tool:** Sentry (planned)

```typescript
// Initialize Sentry
Sentry.init({
  dsn: 'https://...',
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

// Capture errors
try {
  await processOrder(orderId);
} catch (error) {
  Sentry.captureException(error, {
    tags: { orderId, zone },
    extra: { cartTotal, itemCount },
  });
}
```

### 17.2 Logging Strategy

**Log Levels:**
- ERROR: Payment failures, API errors
- WARN: Low stock, slow queries
- INFO: Orders, user actions
- DEBUG: Detailed flow (dev only)

**Structured Logging:**
```typescript
logger.info('Order placed', {
  orderId: 'order_01...',
  customerId: 'cus_01...',
  total: 82500,
  zone: 'Zone A',
  deliverySlot: 'morning',
});
```

### 17.3 Health Checks

```typescript
// GET /health
{
  "status": "healthy",
  "timestamp": "2025-01-20T10:00:00Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "medusa": "running"
  },
  "version": "1.0.0"
}
```

### 17.4 Alerting

**Critical Alerts (immediate):**
- API down
- Payment gateway failure
- Database connection lost
- Error rate > 5%

**Warning Alerts (15 min):**
- Response time > 2s
- Low inventory
- High cart abandonment

**Channels:** SMS, Email, Slack

### 17.5 Performance Monitoring

**Metrics:**
- Response time (p50, p95, p99)
- Error rate
- Request throughput
- Database query time
- Cache hit ratio

---

## 18. Deployment & DevOps

### 18.1 Environment Strategy

| Environment | Purpose | URL |
|-------------|---------|-----|
| Development | Local dev | localhost:3000/9000 |
| Staging | Pre-production testing | staging.freshcatch.in |
| Production | Live customers | freshcatch.in |

### 18.2 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test
      - run: npm run lint
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Production
        run: |
          # Deploy backend to Railway/Render
          # Deploy frontend to Vercel
```

### 18.3 Deployment Checklist

**Pre-Deployment:**
- [ ] All tests passing
- [ ] No lint errors
- [ ] Database migrations ready
- [ ] Environment variables set
- [ ] Backup database

**Post-Deployment:**
- [ ] Health check passing
- [ ] Smoke test critical flows
- [ ] Monitor error rates
- [ ] Check performance metrics

### 18.4 Rollback Procedure

```bash
# Instant rollback via Vercel/Railway
vercel rollback [deployment-id]

# Database rollback (if needed)
npx medusa db:rollback
```

### 18.5 Infrastructure

**Current (Development):**
- Backend: Local (localhost:9000)
- Frontend: Local (localhost:3000)
- Database: Local PostgreSQL

**Production (Planned):**
- Backend: Railway / Render / AWS ECS
- Frontend: Vercel
- Database: Railway PostgreSQL / AWS RDS
- Cache: Redis Cloud / ElastiCache
- CDN: Cloudflare / CloudFront
- Storage: AWS S3 (images)

---

## 19. Mobile Strategy

### 19.1 Responsive Design

**Breakpoints:**
```css
/* Mobile first */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

**Mobile-Specific UX:**
- Bottom navigation bar
- Swipe gestures for carousel
- Touch-friendly buttons (min 44px)
- Sticky cart summary
- Pull-to-refresh

### 19.2 PWA Features (Planned)

**Service Worker:**
```typescript
// Offline support
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

**App Manifest:**
```json
{
  "name": "FreshCatch",
  "short_name": "FreshCatch",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#0066cc",
  "icons": [...]
}
```

**Features:**
- Add to home screen
- Offline product browsing
- Push notifications
- Background sync for orders

### 19.3 Native Apps (Future)

**Phase 3 Consideration:**
- React Native for iOS/Android
- Share 80% code with web
- Native features: GPS, camera, push
- App store distribution

### 19.4 Mobile Optimization

- Image lazy loading
- Skeleton screens
- Reduced JS bundle
- Touch-optimized inputs
- Mobile payment integration (GPay, PhonePe)

---

## 20. Implementation Roadmap

### Phase 0: Current State (30% Complete)

**Done:**
- ✅ Medusa.js backend setup
- ✅ Next.js storefront
- ✅ 34 fish products seeded
- ✅ Zone module (Haversine calculation)
- ✅ API proxy pattern
- ✅ Basic auth flow
- ✅ Cart persistence

**Not Done:**
- ❌ Payment integration
- ❌ Real order processing
- ❌ Inventory management
- ❌ Delivery partner integration

### Phase 1: MVP (Target: 60%)

**Priority 1 - Core Commerce:**
- [ ] Razorpay payment integration
- [ ] Complete checkout flow
- [ ] Order confirmation emails/SMS
- [ ] Basic order management (admin)
- [ ] Inventory tracking

**Priority 2 - Operations:**
- [ ] Delivery slot booking
- [ ] Order status updates
- [ ] Basic delivery tracking

### Phase 2: Growth (Target: 80%)

- [ ] Advanced search & filtering
- [ ] Customer reviews & ratings
- [ ] Recommendation engine
- [ ] Loyalty program
- [ ] Marketing campaigns
- [ ] Analytics dashboard
- [ ] PWA features

### Phase 3: Scale (Target: 100%)

- [ ] Redis caching layer
- [ ] Elasticsearch integration
- [ ] Multi-warehouse support
- [ ] Native mobile apps
- [ ] Real-time inventory
- [ ] AI-powered recommendations
- [ ] Full observability stack

---

## 21. Success Metrics

### 21.1 Technical KPIs

| Metric | Current | Target |
|--------|---------|--------|
| Page Load Time | ~3s | <1.5s |
| API Response Time | ~500ms | <200ms |
| Uptime | N/A | 99.9% |
| Error Rate | N/A | <0.1% |
| Test Coverage | ~0% | >80% |

### 21.2 Business KPIs

| Metric | Current | Target (Year 1) |
|--------|---------|-----------------|
| Monthly Orders | 0 | 5,000 |
| Monthly Revenue | ₹0 | ₹25 Lakhs |
| Avg Order Value | N/A | ₹500 |
| Conversion Rate | N/A | 3% |
| Customer Retention | N/A | 40% |
| NPS Score | N/A | 50+ |

### 21.3 Operational KPIs

| Metric | Target |
|--------|--------|
| On-Time Delivery | >95% |
| Order Accuracy | >99% |
| Freshness Score (delivered) | >8.0 |
| Customer Support Response | <15 min |
| Refund Rate | <2% |

---

## 22. Risk Assessment & Mitigation

### 22.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Database failure | Low | Critical | Daily backups, read replicas |
| API overload | Medium | High | Rate limiting, caching, scaling |
| Payment gateway down | Low | Critical | Fallback to COD, retry queue |
| Security breach | Low | Critical | Encryption, audits, monitoring |
| Third-party API failure | Medium | Medium | Graceful degradation, fallbacks |

### 22.2 Business Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Low customer adoption | Medium | High | Marketing, referral program |
| High cart abandonment | High | Medium | Recovery emails, UX optimization |
| Supplier quality issues | Medium | High | Multiple suppliers, quality checks |
| Competition | Medium | Medium | Unique value prop, loyalty |
| Seasonal demand fluctuation | High | Medium | Dynamic pricing, inventory planning |

### 22.3 Operational Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Cold-chain failure | Medium | Critical | Temperature monitoring, backup ice |
| Delivery delays | Medium | High | Multiple partners, buffer time |
| Inventory stockout | Medium | High | Safety stock, auto-reorder |
| Staff shortage | Low | Medium | Cross-training, backup staff |
| Regulatory changes | Low | Medium | Compliance monitoring |

### 22.4 Contingency Plans

**Database Failure:**
1. Automatic failover to replica
2. Restore from latest backup (<1 hour old)
3. Notify customers of delay

**Payment Gateway Down:**
1. Switch to backup gateway (Cashfree)
2. Offer COD only
3. Queue orders for processing

**Delivery Partner Unavailable:**
1. Reallocate to other partners
2. Extend delivery window
3. Offer compensation if late

**Quality Issue Detected:**
1. Pull affected inventory
2. Notify affected customers
3. Full refund + replacement
4. Supplier penalty/review

---

## Document Summary

**Total Sections:** 22
**Status:** Complete

**Chapter 1 (system_design.md):** Sections 1-11
- Executive Summary
- Implementation Status
- System Architecture
- Design System
- User Experience
- Core Modules
- Fish-Specific Features
- Database Design
- API Architecture
- Frontend Architecture
- Ecommerce Features

**Chapter 2 (this file):** Sections 12-22
- Marketing & Conversion
- Operations & Fulfillment
- Analytics & Insights
- Performance & Scalability
- Security & Compliance
- Monitoring & Observability
- Deployment & DevOps
- Mobile Strategy
- Implementation Roadmap
- Success Metrics
- Risk Assessment

---

**Last Updated:** 2025-01-20
**Author:** System Design Team
**Version:** 1.0
