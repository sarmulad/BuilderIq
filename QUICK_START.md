# BuilderIQ - Quick Start Guide

Get BuilderIQ running locally in under 10 minutes!

## Prerequisites

- Node.js 18+ installed
- Python 3.11+ installed
- Docker Desktop installed (optional, for local database)
- Git installed

## Step 1: Clone Repository

\`\`\`bash
git clone <your-repo-url>
cd builderiq
\`\`\`

## Step 2: Install Dependencies

\`\`\`bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..

# Install scraper dependencies
cd scraper
pip install -r requirements.txt
cd ..
\`\`\`

## Step 3: Set Up Environment Variables

\`\`\`bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
# You'll need:
# - DATABASE_URL (Supabase)
# - REDIS_URL (Upstash)
# - OPENAI_API_KEY
# - SENDGRID_API_KEY
\`\`\`

**Quick tip:** Use `scripts/generate-secret.sh` to generate a secure SECRET_KEY

## Step 4: Set Up Database

### Option A: Use Docker (Easiest)

\`\`\`bash
# Start PostgreSQL and Redis
docker-compose up db redis -d

# Your DATABASE_URL will be:
# postgresql://builderiq:builderiq_dev@localhost:5432/builderiq
\`\`\`

### Option B: Use Supabase (Production)

1. Go to https://supabase.com
2. Create a new project
3. Copy the connection string from Settings → Database
4. Run migrations in SQL Editor:
   - `backend/migrations/001_init_schema.sql`
   - `backend/migrations/002_insert_builders.sql`
   - `backend/migrations/003_add_saved_searches.sql`

## Step 5: Start Services

Open 3 terminal windows:

### Terminal 1: Backend API
\`\`\`bash
cd backend
uvicorn main:app --reload --port 8000
\`\`\`

### Terminal 2: Frontend
\`\`\`bash
npm run dev
\`\`\`

### Terminal 3: Scraper (Optional)
\`\`\`bash
cd scraper
celery -A celery_app worker --loglevel=info
\`\`\`

## Step 6: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## Step 7: Create Admin User

1. Visit http://localhost:3000
2. Click "Sign Up"
3. Create an account
4. Go to your database (Supabase Table Editor or pgAdmin)
5. Find your user in the `users` table
6. Change `role` from `USER` to `ADMIN`

## You're Done!

Now you can:
- Browse the dashboard
- Test search and filters
- Generate marketing content with AI
- Run scrapers from the admin panel

## Troubleshooting

**Frontend can't connect to backend:**
- Check `NEXT_PUBLIC_API_URL` in your `.env`
- Ensure backend is running on port 8000
- Check browser console for CORS errors

**Database connection failed:**
- Verify `DATABASE_URL` is correct
- Ensure database is running
- Check if migrations were applied

**AI features not working:**
- Verify `OPENAI_API_KEY` is set
- Check if you have credits in OpenAI account
- Look for errors in backend terminal

## Next Steps

- Read `COMPLETE_SETUP_GUIDE.md` for production deployment
- Check `DEPLOYMENT.md` for hosting options
- Review backend API at http://localhost:8000/docs
