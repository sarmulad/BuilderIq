# BuilderIQ - Implementation Notes & API Examples

## Architecture Overview

BuilderIQ follows a clean, scalable architecture:

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js/React)                 │
│  Landing → Auth → Dashboard → Marketing Gen → Admin Panel   │
└──────────────┬──────────────────────────────────────────────┘
               │ HTTP/JSON
┌──────────────▼──────────────────────────────────────────────┐
│               Backend (Next.js API Routes)                  │
│  Auth → Incentives → Favorites → Marketing → Admin Routes   │
└──────────────┬──────────────────────────────────────────────┘
               │ Prisma ORM
┌──────────────▼──────────────────────────────────────────────┐
│              Database (PostgreSQL)                          │
│  Users, Builders, Communities, Incentives, Subscriptions    │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Authentication Flow

1. User signs up → `/api/auth/register`
   - Hash password with bcryptjs
   - Create user in DB
   - Auto-enroll in Free plan
   - Return JWT token + user

2. User logs in → `/api/auth/login`
   - Verify email exists
   - Compare password hash
   - Generate JWT token
   - Return token + user

3. Authenticated requests
   - Include: `Authorization: Bearer <token>`
   - Middleware verifies token
   - Attach user to request

## API Request Examples

### Register User

\`\`\`bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "agent@example.com",
    "password": "SecurePassword123",
    "name": "John Doe",
    "role": "USER"
  }'
\`\`\`

Response:
\`\`\`json
{
  "user": {
    "id": "cuid123",
    "email": "agent@example.com",
    "name": "John Doe",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

### Search Incentives

\`\`\`bash
curl "http://localhost:3000/api/incentives?q=buydown&city=Indianapolis&type=RATE_BUYDOWN&page=1"
\`\`\`

Response:
\`\`\`json
{
  "incentives": [
    {
      "id": "inc123",
      "title": "2-1 Rate Buydown",
      "descriptionAI": "Reduce your rate 2% first year, 1% second year",
      "incentiveType": "RATE_BUYDOWN",
      "valueText": "2-1 buydown to 3.99%",
      "endDate": "2025-12-31",
      "builder": {
        "name": "D.R. Horton"
      },
      "community": {
        "name": "Eaglebrook",
        "city": "Indianapolis"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 24,
    "total": 142,
    "pages": 6
  }
}
\`\`\`

### Add to Favorites

\`\`\`bash
curl -X POST http://localhost:3000/api/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "incentiveId": "inc123"
  }'
\`\`\`

### Generate Marketing Content

\`\`\`bash
curl -X POST http://localhost:3000/api/marketing-generator \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "incentiveId": "inc123"
  }'
\`\`\`

Response:
\`\`\`json
{
  "captions": [
    "Don't miss out! 2-1 rate buydown at Eaglebrook by D.R. Horton. Lock in a lower rate for the first 2 years! Limited time offer. 🏡 #RealEstate #NewHomes",
    "New incentive alert! Rate buydowns up to 3.99% at select D.R. Horton communities...",
    "..."
  ],
  "emailBlast": "Subject: Exclusive: 2-1 Rate Buydown at Eaglebrook\n\nDear Valued Clients,\n\nI wanted to bring to your attention an exciting opportunity...",
  "facebookPost": "We just found an amazing deal for you! 🎉\n\nD.R. Horton is offering a 2-1 rate buydown to 3.99% at Eaglebrook in Indianapolis...",
  "cta": "Schedule a showing today!"
}
\`\`\`

## Database Queries (Prisma Examples)

### Find Incentives with Filters

\`\`\`typescript
const incentives = await prisma.incentive.findMany({
  where: {
    status: 'APPROVED',
    endDate: { gt: new Date() },
    incentiveType: 'RATE_BUYDOWN',
    builder: {
      name: { contains: 'D.R. Horton', mode: 'insensitive' }
    },
    community: {
      city: { contains: 'Indianapolis', mode: 'insensitive' }
    }
  },
  include: { builder: true, community: true },
  orderBy: { priorityScore: 'desc' },
  take: 24,
  skip: 0
});
\`\`\`

### Get User Favorites

\`\`\`typescript
const favorites = await prisma.favorite.findMany({
  where: { userId: user.id },
  include: {
    incentive: {
      include: { builder: true, community: true }
    }
  }
});
\`\`\`

### Create Incentive Submission

\`\`\`typescript
const submission = await prisma.submission.create({
  data: {
    submittedByUserId: userId,
    payload: {
      title: "3% Rate Reduction",
      descriptionRaw: "Raw text from source...",
      incentiveType: "RATE_BUYDOWN",
      builderId: "builder123",
      // ... other fields
    },
    status: 'PENDING'
  }
});
\`\`\`

### Approve Submission (Admin)

\`\`\`typescript
// Step 1: Get submission
const submission = await prisma.submission.findUnique({
  where: { id: submissionId }
});

// Step 2: Create incentive
const incentive = await prisma.incentive.create({
  data: {
    ...submission.payload,
    status: 'APPROVED'
  }
});

// Step 3: Mark submission as approved
await prisma.submission.update({
  where: { id: submissionId },
  data: {
    status: 'APPROVED',
    reviewerUserId: adminUserId
  }
});
\`\`\`

## Extending the System

### Add Email Alerts

1. Create `SendAlert` service:
\`\`\`typescript
// lib/services/send-alert.ts
export async function sendAlert(userId: string, incentives: any[]) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  // Call Resend/SendGrid API
  await sendEmailViaResend({
    to: user.email,
    subject: 'New Builder Incentives Alert',
    html: renderEmailTemplate(incentives)
  });
}
\`\`\`

2. Create cron job (using cron package or Vercel cron):
\`\`\`typescript
// pages/api/cron/send-alerts.ts
export default async function handler(req: NextRequest) {
  const alerts = await prisma.searchAlert.findMany({
    where: { active: true }
  });
  
  for (const alert of alerts) {
    // Find matching incentives
    // Send alert email
  }
}
\`\`\`

### Add Stripe Payments

1. Create webhook handler:
\`\`\`typescript
// app/api/webhooks/stripe/route.ts
export async function POST(req: NextRequest) {
  const event = stripe.webhooks.constructEvent(
    body, signature, process.env.STRIPE_WEBHOOK_SECRET
  );
  
  if (event.type === 'customer.subscription.created') {
    // Update subscription in DB
    await prisma.subscription.update({...});
  }
}
\`\`\`

2. Add checkout flow in `/api/checkout`:
\`\`\`typescript
const session = await stripe.checkout.sessions.create({
  customer: stripeCustomerId,
  line_items: [{ price: priceId, quantity: 1 }],
  mode: 'subscription',
  success_url: `${domain}/app/dashboard?success=true`,
  cancel_url: `${domain}/pricing`
});
\`\`\`

### Add Web Scraper

1. Create scraper service:
\`\`\`typescript
// scripts/scrapers/drhorton.ts
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeDRHorton() {
  const response = await axios.get('https://www.drhorton.com/incentives');
  const $ = cheerio.load(response.data);
  
  const incentives = [];
  $('.incentive-item').each((_, el) => {
    incentives.push({
      title: $(el).find('.title').text(),
      description: $(el).find('.desc').text(),
      builderId: 'drhorton',
      sourceUrl: 'https://www.drhorton.com'
    });
  });
  
  return incentives;
}
\`\`\`

2. Add to cron job:
\`\`\`typescript
// Schedule weekly via vercel.json
{
  "crons": [
    { "path": "/api/cron/scrape-builders", "schedule": "0 0 * * 0" }
  ]
}
\`\`\`

## Performance Optimization Tips

1. **Database Indexing**
   - Already added indexes in schema
   - Monitor slow queries with Prisma logging

2. **Caching Strategy**
   - Cache builder list (rarely changes)
   - Cache top incentives (Redis)
   - Use Next.js revalidation for static data

3. **API Optimization**
   - Implement pagination (24 per page)
   - Use select() to limit fields
   - Add Rate Limiting (Upstash)

4. **Frontend**
   - Code splitting with dynamic imports
   - Image optimization
   - Lazy loading components

## Security Checklist

- [x] Password hashing (bcryptjs)
- [x] JWT token validation
- [x] Role-based access control
- [x] CORS headers configured
- [x] Input validation via Prisma
- [ ] HTTPS enforced (Vercel default)
- [ ] Rate limiting (implement with Upstash)
- [ ] SQL injection protection (via ORM)
- [ ] XSS protection (React default + CSP headers)
- [ ] CSRF protection (cookies + tokens)

## Monitoring & Logging

\`\`\`typescript
// lib/logger.ts
export function logEvent(event: string, data: any) {
  console.log(`[${new Date().toISOString()}] ${event}:`, data);
  
  // Optional: Send to Sentry/LogTail
  if (process.env.SENTRY_DSN) {
    Sentry.captureMessage(event);
  }
}
\`\`\`

## Testing Strategy

### Unit Tests (Jest)
\`\`\`typescript
describe('Auth', () => {
  it('should hash password on registration', async () => {
    // Test password hashing
  });
  
  it('should validate JWT token', async () => {
    // Test token validation
  });
});
\`\`\`

### Integration Tests
\`\`\`typescript
describe('API Routes', () => {
  it('should search incentives', async () => {
    const res = await fetch('/api/incentives?q=buydown');
    expect(res.status).toBe(200);
  });
});
\`\`\`

### E2E Tests (Playwright)
\`\`\`typescript
test('User can search and save favorite', async ({ page }) => {
  await page.goto('/search');
  await page.fill('input[placeholder="Search..."]', 'rate buydown');
  // ... assertions
});
\`\`\`

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| JWT token expired | Implement refresh tokens |
| Slow search | Add database indexes, implement caching |
| API rate limited | Use Upstash or custom middleware |
| Email not sending | Verify SendGrid/Resend credentials |
| OpenAI API timeout | Implement retry logic, queue system |
| CORS errors | Check middleware configuration |

## Next Phase Roadmap

**Q1 2025**
- Web scraper integration
- Email alert system
- Stripe payments

**Q2 2025**
- Mobile app (React Native)
- CRM integrations
- Map view

**Q3 2025**
- Advanced analytics
- Affiliate program
- Data licensing

---

For additional help, refer to official docs or check the codebase comments.
