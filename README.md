# BuilderIQ - Builder Incentive Intelligence Platform

> Professional B2B SaaS platform for real estate agents to discover and track new home builder incentives and inventory across Indiana.

## Architecture

BuilderIQ uses **Supabase** as the complete backend solution:

1. **Frontend** (Next.js) - User interface deployed on Vercel
2. **Backend** (Supabase) - PostgreSQL Database + Auth + Edge Functions
3. **Scraper** (Python + Celery) - Background workers deployed on Railway/Render

### Why Supabase?

- **All-in-one backend** - Database, Authentication, Storage, and Serverless Functions
- **Row Level Security** - Database-level security policies
- **Real-time subscriptions** - Built-in live updates
- **Auto-generated API** - REST API from database schema
- **Simpler architecture** - No need to manage separate API server

See `SUPABASE_SETUP.md` for detailed setup instructions.

## Quick Start

### Prerequisites

- Node.js 18+
- Supabase account (free tier available at [supabase.com](https://supabase.com))
- Python 3.11+ (for scraper service)

### Local Development

1. **Clone the repository**
\`\`\`bash
git clone https://github.com/yourusername/builderiq.git
cd builderiq
\`\`\`

2. **Create Supabase Project**
- Go to [supabase.com](https://supabase.com) and create a new project
- In SQL Editor, run migrations from `backend/migrations/` in order:
  - `001_init_schema.sql`
  - `002_insert_builders.sql`
  - `003_add_saved_searches.sql`

3. **Setup Frontend**
\`\`\`bash
npm install
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the app.

4. **Setup Scraper (Optional)**
\`\`\`bash
cd scraper
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with Supabase credentials
# Start worker
celery -A celery_app worker --loglevel=info
# Start scheduler (in separate terminal)
celery -A celery_app beat --loglevel=info
\`\`\`

## Features

### For Real Estate Agents
- Advanced search with 15+ filters
- Save favorite incentives
- Email alerts for new deals
- AI-powered marketing content generator
- Export data to CSV
- Saved searches with alerts

### For Administrators
- Submission moderation queue
- Analytics dashboard
- User management
- Automated scraping logs
- Audit trail

### Builders Covered
- D.R. Horton
- Lennar
- M/I Homes
- Arbor Homes
- More coming soon...

## Tech Stack

### Frontend
- Next.js 16 with App Router
- React 19
- Tailwind CSS v4
- TypeScript
- Supabase JavaScript Client

### Backend (Supabase)
- PostgreSQL Database
- Built-in Authentication
- Row Level Security (RLS)
- Edge Functions (Deno)
- Auto-generated REST API

### Scraper Service
- Python 3.11+
- Celery + Redis
- BeautifulSoup4
- OpenAI API for normalization
- Supabase Python Client

## API Usage

The frontend uses the Supabase JavaScript client directly:

\`\`\`typescript
import { supabaseAPI } from '@/lib/supabase-api'

// Authentication
await supabaseAPI.login('user@example.com', 'password')
const user = await supabaseAPI.getCurrentUser()

// Query incentives
const { items, total } = await supabaseAPI.getIncentives({
  builders: ['builder-id'],
  city: 'Indianapolis',
  limit: 24
})

// Add to favorites
await supabaseAPI.addFavorite('incentive-id')
\`\`\`

## Environment Variables

### Required for Frontend
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

### Required for Edge Functions
\`\`\`env
OPENAI_API_KEY=sk-...
SENDGRID_API_KEY=SG...
\`\`\`

### Required for Scraper
\`\`\`env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-...
\`\`\`

## Deployment

### Deploy Frontend to Vercel

\`\`\`bash
vercel deploy
\`\`\`

Add environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Deploy Edge Functions to Supabase

\`\`\`bash
supabase functions deploy generate-marketing
supabase functions deploy send-email-alerts

# Set secrets
supabase secrets set OPENAI_API_KEY=your-key
supabase secrets set SENDGRID_API_KEY=your-key
\`\`\`

### Deploy Scraper to Railway

\`\`\`bash
railway up
\`\`\`

See `DEPLOYMENT.md` and `SUPABASE_SETUP.md` for detailed instructions.

## Documentation

- [Supabase Setup Guide](./SUPABASE_SETUP.md) - Complete backend setup
- [Migration Guide](./MIGRATION_COMPLETE.md) - FastAPI → Supabase migration details
- [Project Structure](./PROJECT_STRUCTURE.md) - Codebase organization
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment
- [Quick Start](./QUICK_START.md) - Development setup

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

Proprietary - All rights reserved

## Support

For issues and questions:
- Email: support@builderiq.com
- Documentation: See project documentation files
- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)

---

Built with care for real estate professionals
