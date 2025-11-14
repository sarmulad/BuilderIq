# BuilderIQ - Complete Setup & Deployment Guide

## Project Overview

BuilderIQ is a production-ready builder incentive intelligence platform featuring:
- Agent dashboard with search and filtering
- AI-powered marketing content generator
- Admin moderation panel
- Subscription-based pricing (Free, Pro, Enterprise)
- Real-time incentive tracking and alerts

---

## Environment Variables Required

Create a `.env.local` file in the root with:

\`\`\`env
# Database
DATABASE_URL="postgresql://user:password@host:5432/builderiq"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# OpenAI (for marketing generator & normalization)
OPENAI_API_KEY="sk-..."

# Stripe (optional - for payments)
STRIPE_SECRET_KEY="sk_..."
STRIPE_PUBLISHABLE_KEY="pk_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."

# Vercel Deployment
NEXT_PUBLIC_APP_URL="https://your-domain.com"
\`\`\`

---

## Database Setup

### 1. Create PostgreSQL Database

\`\`\`bash
# Using Supabase (recommended)
# OR
# Local PostgreSQL
createdb builderiq
\`\`\`

### 2. Run Prisma Migrations

\`\`\`bash
npx prisma migrate dev --name init
npx prisma db seed  # Optional: seed with sample data
\`\`\`

### 3. Verify Schema

\`\`\`bash
npx prisma studio  # Opens Prisma Studio for data inspection
\`\`\`

---

## Installation & Local Development

### 1. Install Dependencies

\`\`\`bash
npm install
# OR
yarn install
\`\`\`

Required packages include:
- `@prisma/client` - ORM
- `next` - Framework
- `react` - UI
- `@radix-ui/*` - Components
- `recharts` - Analytics charts
- `jose` - JWT handling
- `bcryptjs` - Password hashing
- `zod` - Validation (optional)

### 2. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000`

### 3. Key Routes

- `/` - Landing page
- `/search` - Incentive search (public)
- `/auth/login` - User login
- `/auth/signup` - User signup
- `/app/dashboard` - Authenticated dashboard
- `/app/marketing` - Marketing content generator
- `/admin` - Admin panel (admin role only)
- `/pricing` - Pricing page

---

## Deployment to Vercel

### 1. Push to GitHub

\`\`\`bash
git add .
git commit -m "Initial BuilderIQ commit"
git push origin main
\`\`\`

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure environment variables (add all from .env.local)
5. Select PostgreSQL database (Vercel Postgres or external Supabase/Neon)
6. Deploy

### 3. Post-Deployment

\`\`\`bash
# Run migrations on Vercel deployment
vercel env pull
npx prisma migrate deploy
\`\`\`

---

## API Architecture

### Authentication Endpoints
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- Token-based JWT auth with Authorization header

### Incentive Endpoints
- `GET /api/incentives` - Search/filter incentives
- `GET /api/incentives/[id]` - Get single incentive
- `POST /api/incentives` - Create (builders only)
- `PATCH /api/incentives/[id]` - Update (admin only)

### User Endpoints
- `POST /api/favorites` - Add favorite
- `DELETE /api/favorites` - Remove favorite
- `GET /api/favorites` - List favorites

### AI Endpoints
- `POST /api/marketing-generator` - Generate marketing content

### Admin Endpoints
- `GET /api/admin/submissions` - List submissions
- `PATCH /api/admin/submissions/[id]/approve` - Approve
- `PATCH /api/admin/submissions/[id]/reject` - Reject

---

## Data Model Summary

### Core Tables
- **User** - Authentication, roles, subscriptions
- **Builder** - Builder company info
- **Community** - Builder communities/neighborhoods
- **Incentive** - Individual incentives (rate buydowns, credits, etc.)
- **Inventory** - Quick-move-in homes
- **SavedSearch** - User saved search filters
- **Favorite** - User favorited incentives
- **Event** - Analytics tracking (views, clicks, shares)
- **Submission** - Pending incentive submissions for moderation
- **Subscription** - User plan subscriptions

### Key Relationships
- User → Subscription → Plan
- Builder → Communities → Incentives
- User → SavedSearch / Favorites / Events

---

## Features Implemented

### Public Features
- Landing page with email capture
- Pricing page
- Limited public search (3 incentives)
- Weekly digest signup

### Free Tier
- Limited builder search (3)
- Weekly summary email
- Basic filtering

### Pro Tier ($49/month)
- Unlimited search
- AI marketing generator
- Daily/weekly alerts
- Favorites
- CSV export

### Enterprise ($199+/month)
- Everything in Pro
- Team collaboration (5 seats)
- Bulk export & analytics
- Branded dashboard
- API access

### Admin Features
- Submission queue with approval/rejection
- Analytics dashboard
- User management (extensible)
- Duplicate detection (ready to implement)

---

## Performance Optimizations

1. **Database**
   - Indexes on: builder_id, community_id, status, end_date
   - FTS (full-text search) ready for title/description
   - Connection pooling via Prisma

2. **Caching**
   - Implement Redis for popular searches
   - Cache builder lists (low change frequency)

3. **API**
   - Pagination (24 items per page)
   - Rate limiting ready (Upstash integration)
   - CORS configured for frontend

---

## Security Considerations

1. **Auth**
   - JWT tokens with 7-day expiry
   - Password hashing with bcryptjs (10 rounds)
   - Role-based access control (PUBLIC, USER, BUILDER, ADMIN)

2. **Database**
   - Row-level security (RLS) ready for Supabase
   - Input validation via Prisma
   - SQL injection protection via ORM

3. **API**
   - Authorization headers required for protected routes
   - CORS middleware configured
   - Rate limiting recommended for production

---

## Next Steps & Extensions

### Phase 2 (Ready to Implement)
- Web scraper for auto-ingestion (see Python templates in attachments)
- Email alert system (SendGrid/Resend integration)
- Stripe payment processing
- OAuth (Google Sign-In)

### Phase 3
- Real estate CRM integrations (Follow Up Boss, RealScout)
- Map view (Mapbox)
- Mobile app
- Analytics dashboard expansion

### Phase 4
- Affiliate program
- Data licensing module
- Builder featured listings
- Advanced deduplication

---

## Troubleshooting

### Database Connection Errors
\`\`\`bash
# Verify DATABASE_URL format
DATABASE_URL="postgresql://user:password@localhost:5432/builderiq"

# Test connection
psql $DATABASE_URL -c "SELECT 1"
\`\`\`

### Prisma Issues
\`\`\`bash
# Regenerate Prisma client
npx prisma generate

# Reset database (development only)
npx prisma migrate reset
\`\`\`

### JWT Token Issues
- Ensure JWT_SECRET is set and consistent
- Check token expiry (set to 7 days)
- Verify Authorization header format: "Bearer <token>"

### OpenAI API Errors
- Verify OPENAI_API_KEY is valid
- Check account has API quota
- Model "gpt-4-mini" may need adjustment based on availability

---

## Support & Resources

- **Prisma Documentation**: https://www.prisma.io/docs/
- **Next.js Documentation**: https://nextjs.org/docs
- **Vercel Deployment**: https://vercel.com/docs
- **OpenAI API**: https://platform.openai.com/docs

For issues, check logs in Vercel dashboard or local console output.
