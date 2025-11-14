# BuilderIQ Project Structure

This project follows a **microservices architecture** with clear separation between frontend and backend services.

## Architecture Overview

\`\`\`
builderiq/
├── app/                          # Next.js Frontend (UI Only)
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (public)/
│   │   ├── about/
│   │   ├── contact/
│   │   ├── pricing/
│   │   ├── privacy/
│   │   └── terms/
│   ├── (app)/
│   │   ├── dashboard/
│   │   ├── search/
│   │   └── marketing/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/                   # React Components
│   ├── landing/
│   ├── dashboard/
│   ├── admin/
│   ├── marketing/
│   └── ui/
├── lib/                          # Frontend Utilities
│   ├── api-client.ts            # API calls to FastAPI backend
│   ├── utils.ts
│   └── constants.ts
├── hooks/                        # React Hooks
│   ├── use-auth.ts
│   ├── use-toast.ts
│   └── use-mobile.ts
├── public/                       # Static Assets
│   └── images/
├── backend/                      # FastAPI Backend (Python)
│   ├── routers/                 # API Endpoints
│   │   ├── auth.py
│   │   ├── incentives.py
│   │   ├── builders.py
│   │   ├── marketing.py
│   │   ├── admin.py
│   │   └── saved_searches.py
│   ├── migrations/              # SQL Migrations
│   ├── models.py                # SQLAlchemy Models
│   ├── schemas.py               # Pydantic Schemas
│   ├── database.py              # Database Connection
│   ├── security.py              # Auth & Security
│   ├── cache.py                 # Redis Cache
│   ├── email_service.py         # SendGrid Integration
│   ├── main.py                  # FastAPI App Entry
│   ├── config.py                # Configuration
│   ├── requirements.txt
│   └── Dockerfile
├── scraper/                      # Scraper Service (Python + Celery)
│   ├── base_scraper.py
│   ├── lennar_scraper.py
│   ├── mi_homes_scraper.py
│   ├── arbor_homes_scraper.py
│   ├── dr_horton_scraper.py
│   ├── tasks.py                 # Celery Tasks
│   ├── celery_app.py            # Celery Configuration
│   ├── celery_beat_schedule.py  # Scheduled Jobs
│   ├── database.py              # DB Connection
│   ├── models.py                # DB Models
│   ├── config.py                # Configuration
│   ├── requirements.txt
│   └── Dockerfile
├── scripts/                      # Deployment Scripts
│   ├── setup.sh
│   ├── local-dev.sh
│   └── deploy-railway.sh
├── docker-compose.yml            # Local Development
├── .env.example                  # Environment Variables Template
└── README.md
\`\`\`

## Service Separation

### 1. Frontend (Next.js)
- **Location**: Root `/app`, `/components`, `/lib`, `/hooks`
- **Purpose**: UI rendering, user interactions
- **Technology**: Next.js 15, React 19, Tailwind CSS
- **Communication**: Calls FastAPI backend via REST API
- **Deployment**: Vercel
- **Port**: 3000 (local dev)

### 2. Backend API (FastAPI)
- **Location**: `/backend`
- **Purpose**: Business logic, authentication, data management
- **Technology**: Python 3.11+, FastAPI, SQLAlchemy
- **Database**: Supabase (PostgreSQL)
- **Cache**: Redis (Upstash)
- **Deployment**: Railway / Render
- **Port**: 8000 (local dev)
- **API Base URL**: `http://localhost:8000` (dev) or `https://api.builderiq.com` (prod)

### 3. Scraper Service (Celery Workers)
- **Location**: `/scraper`
- **Purpose**: Web scraping, data ingestion, background jobs
- **Technology**: Python 3.11+, Celery, BeautifulSoup4, OpenAI
- **Queue**: Redis
- **Deployment**: Railway / Render (separate service)
- **Schedule**: Daily at 2 AM UTC via Celery Beat

## Key Principles

### Frontend Rules
- ✅ Only UI components and pages
- ✅ API calls via `lib/api-client.ts`
- ✅ No database connections
- ✅ No business logic
- ❌ No Next.js API routes (`app/api/*`)
- ❌ No Prisma or direct DB access

### Backend Rules
- ✅ All API endpoints in FastAPI
- ✅ Database operations via SQLAlchemy
- ✅ Authentication & authorization
- ✅ Caching with Redis
- ❌ No UI components
- ❌ No React code

### Scraper Rules
- ✅ Independent service
- ✅ Scheduled jobs via Celery Beat
- ✅ Direct database writes
- ✅ AI normalization with OpenAI
- ❌ No API endpoints (except admin triggers)
- ❌ No user-facing features

## Data Flow

\`\`\`
User Browser
    ↓
Next.js Frontend (Vercel)
    ↓ HTTP REST API
FastAPI Backend (Railway)
    ↓ PostgreSQL
Supabase Database
    ↑
Celery Scraper Workers (Railway)
\`\`\`

## Environment Variables

### Frontend (.env.local)
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8000
\`\`\`

### Backend (.env)
\`\`\`env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
OPENAI_API_KEY=...
SENDGRID_API_KEY=...
\`\`\`

### Scraper (.env)
\`\`\`env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
OPENAI_API_KEY=...
\`\`\`

## Development Workflow

### Start All Services Locally

\`\`\`bash
# Terminal 1 - Backend API
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Terminal 2 - Scraper Worker
cd scraper
source venv/bin/activate
celery -A celery_app worker --loglevel=info

# Terminal 3 - Scraper Scheduler
cd scraper
celery -A celery_app beat --loglevel=info

# Terminal 4 - Frontend
npm install
npm run dev
\`\`\`

Or use Docker Compose:
\`\`\`bash
docker-compose up
\`\`\`

## Deployment

- **Frontend**: Deploy to Vercel via GitHub integration
- **Backend**: Deploy to Railway with `backend/Dockerfile`
- **Scraper**: Deploy to Railway as separate service with `scraper/Dockerfile`
- **Database**: Managed by Supabase
- **Redis**: Managed by Upstash

## Common Issues

**Issue**: Frontend shows "Network Error"
**Fix**: Ensure `NEXT_PUBLIC_API_URL` points to running backend

**Issue**: Backend can't connect to database
**Fix**: Check `DATABASE_URL` is correct Supabase connection string

**Issue**: Scraper not running
**Fix**: Ensure Redis is running and accessible

**Issue**: CORS errors
**Fix**: Backend `main.py` should have CORS middleware with frontend URL

## Testing

\`\`\`bash
# Test Backend API
curl http://localhost:8000/health

# Test Frontend
curl http://localhost:3000

# Test Auth
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
\`\`\`

## Need Help?

See detailed setup guides:
- `COMPLETE_SETUP_GUIDE.md` - Full deployment instructions
- `QUICK_START.md` - Local development quickstart
- `DEPLOYMENT.md` - Production deployment guide
