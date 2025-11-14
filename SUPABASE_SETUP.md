# Supabase Backend Setup Guide

BuilderIQ now uses **Supabase** as the complete backend solution, replacing FastAPI. This simplifies the architecture significantly.

## Architecture Overview

**Previous:** Next.js Frontend → FastAPI Backend → Supabase Database
**New:** Next.js Frontend → Supabase (Auth + Database + Edge Functions)

## Benefits

- **No separate backend to deploy** - Everything runs on Supabase
- **Built-in authentication** - Email/password, OAuth, magic links
- **Row Level Security (RLS)** - Database-level security
- **Real-time subscriptions** - Live updates for users
- **Auto-generated REST API** - Direct database queries from frontend
- **Edge Functions** - Serverless functions for complex logic (marketing generator, email alerts)
- **Cheaper and easier to scale** - Pay-as-you-go pricing

## Setup Instructions

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### Step 2: Run Database Migrations

In your Supabase dashboard, go to **SQL Editor** and run these scripts in order:

1. **001_init_schema.sql** - Creates all tables with RLS policies
2. **002_insert_builders.sql** - Adds initial builder data
3. **003_add_saved_searches.sql** - Adds saved searches table

Find these files in `backend/migrations/`

### Step 3: Configure Environment Variables

Create `.env.local` in the root directory:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-openai-key
SENDGRID_API_KEY=your-sendgrid-key
\`\`\`

### Step 4: Enable Email Auth

In Supabase Dashboard:
1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional)

### Step 5: Deploy Edge Functions (Optional)

Edge Functions handle complex server-side logic:

**Marketing Content Generator:**
\`\`\`bash
cd supabase/functions/generate-marketing
supabase functions deploy generate-marketing
\`\`\`

**Email Alerts:**
\`\`\`bash
cd supabase/functions/email-alerts
supabase functions deploy email-alerts
\`\`\`

Set Edge Function secrets:
\`\`\`bash
supabase secrets set OPENAI_API_KEY=your-key
supabase secrets set SENDGRID_API_KEY=your-key
\`\`\`

### Step 6: Update Scraper Service

The Python scraper now connects directly to Supabase:

1. Install Supabase Python client:
\`\`\`bash
cd scraper
pip install supabase-py
\`\`\`

2. Update scraper config with Supabase credentials
3. Run scrapers as scheduled jobs

## Local Development

### Frontend Only

\`\`\`bash
npm install
npm run dev
\`\`\`

The frontend will connect to your Supabase project in the cloud.

### With Local Supabase (Advanced)

\`\`\`bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Start local Supabase
supabase start

# Run migrations
supabase db reset

# Start frontend
npm run dev
\`\`\`

## API Usage

### Authentication Example

\`\`\`typescript
import { supabaseAPI } from '@/lib/supabase-api'

// Sign up
await supabaseAPI.signup('user@example.com', 'password', 'John Doe')

// Login
await supabaseAPI.login('user@example.com', 'password')

// Get current user
const user = await supabaseAPI.getCurrentUser()
\`\`\`

### Querying Data Example

\`\`\`typescript
// Get incentives with filters
const { items, total } = await supabaseAPI.getIncentives({
  builders: ['builder-id-1', 'builder-id-2'],
  city: 'Indianapolis',
  limit: 24,
  skip: 0
})

// Add to favorites
await supabaseAPI.addFavorite('incentive-id')

// Get builders
const builders = await supabaseAPI.getBuilders()
\`\`\`

## Security Notes

1. **RLS Policies** protect all data at the database level
2. **Anon key** is safe to expose in frontend code
3. **Service role key** should NEVER be exposed (only for server-side operations)
4. All authenticated requests automatically include user context

## Migration from FastAPI

If you were using the FastAPI backend:

1. ✅ Database schema is identical
2. ✅ All API methods have Supabase equivalents
3. ✅ Authentication works the same way
4. ❌ No need to run FastAPI server anymore
5. ❌ No need to manage JWT tokens manually

## Deployment

### Deploy Frontend to Vercel

\`\`\`bash
vercel deploy
\`\`\`

Add environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY` (for Edge Functions)
- `SENDGRID_API_KEY` (for Edge Functions)

### Deploy Scraper Service

The scraper service can run anywhere:
- **Railway** - Easiest option with Docker support
- **Heroku** - Classic platform
- **AWS Lambda** - Serverless option
- **Google Cloud Run** - Containerized serverless

Just ensure it has:
- Supabase credentials
- Scheduled job runner (Celery Beat or cron)

## Cost Comparison

**Before (FastAPI):**
- Frontend: Vercel ($20/mo)
- Backend: Railway/Render ($10-25/mo)
- Database: Supabase ($25/mo)
- Redis: Upstash ($10/mo)
- **Total: ~$65-80/mo**

**After (Supabase Only):**
- Frontend: Vercel ($20/mo)
- Backend: Supabase ($25/mo includes DB + Auth + Functions + Storage)
- **Total: ~$45/mo**

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
