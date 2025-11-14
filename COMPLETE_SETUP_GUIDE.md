# BuilderIQ - Complete Setup & Deployment Guide

## 🚀 Quick Start Overview

BuilderIQ is a microservices-based real estate intelligence platform with three main components:

1. **Frontend** (Next.js) - User interface
2. **Backend API** (FastAPI/Python) - Business logic & data serving
3. **Scraper Service** (Celery/Python) - Automated data collection

---

## 📋 Prerequisites

Before you begin, sign up for these services:

- **Supabase** (Database) - https://supabase.com
- **Upstash** (Redis) - https://upstash.com
- **SendGrid** (Email) - https://sendgrid.com
- **OpenAI** (AI Features) - https://platform.openai.com
- **Vercel** (Frontend Hosting) - https://vercel.com
- **Railway/Render** (Backend Hosting) - https://railway.app or https://render.com

---

## 🗄️ Step 1: Database Setup (Supabase)

### 1.1 Create Supabase Project

1. Go to https://supabase.com and create a new project
2. Choose a region close to your users
3. Save your **Database Password** - you'll need it!

### 1.2 Get Connection String

1. In Supabase Dashboard → Settings → Database
2. Copy the **Connection String** (URI format)
3. Replace `[YOUR-PASSWORD]` with your actual password
4. Example: `postgresql://postgres:yourpassword@db.xxx.supabase.co:5432/postgres`

### 1.3 Run Database Migrations

1. Go to Supabase Dashboard → SQL Editor
2. Copy the contents of `backend/migrations/001_init_schema.sql`
3. Paste and click "Run"
4. Repeat for `002_insert_builders.sql` and `003_add_saved_searches.sql`

**Verify:** Check the Table Editor - you should see tables like `users`, `builders`, `incentives`, etc.

---

## 📧 Step 2: Email Setup (SendGrid)

### 2.1 Create SendGrid Account

1. Sign up at https://sendgrid.com
2. Verify your email address
3. Complete sender identity verification

### 2.2 Create API Key

1. Go to Settings → API Keys
2. Click "Create API Key"
3. Choose "Full Access"
4. Copy the API key (starts with `SG.`)
5. **Save it securely** - you can't view it again!

### 2.3 Verify Sender Email

1. Go to Settings → Sender Authentication
2. Click "Verify a Single Sender"
3. Enter your business email (e.g., noreply@builderiq.com)
4. Verify the email through the confirmation link

---

## 🔴 Step 3: Redis Setup (Upstash)

### 3.1 Create Redis Database

1. Go to https://upstash.com
2. Click "Create Database"
3. Choose a region close to your backend
4. Select "Free" tier for testing

### 3.2 Get Connection URL

1. In database dashboard, copy the **REST URL**
2. Also copy the **REST Token**
3. Format: `redis://default:YOUR_TOKEN@YOUR_URL:6379`

---

## 🤖 Step 4: OpenAI Setup

### 4.1 Get API Key

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Name it "BuilderIQ Production"
4. Copy the key (starts with `sk-`)
5. Add billing information to your OpenAI account

**Important:** Make sure you have credits/billing set up, or API calls will fail!

---

## 🖥️ Step 5: Backend Deployment

### Option A: Railway (Recommended)

1. **Create Railway Account:** https://railway.app
2. **New Project:** Click "New Project" → "Deploy from GitHub repo"
3. **Connect Repository:** Select your BuilderIQ repo
4. **Add Service:** Click "New" → "Empty Service"
5. **Configure Service:**
   - Name: `builderiq-backend`
   - Root Directory: `/backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

6. **Add Environment Variables:**

\`\`\`env
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
REDIS_URL=redis://default:token@xxx.upstash.io:6379
SECRET_KEY=generate-a-random-256-bit-key-here
SENDGRID_API_KEY=SG.xxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@builderiq.com
OPENAI_API_KEY=sk-xxxxxxxxxxxx
FRONTEND_URL=https://builderiq.vercel.app
CORS_ORIGINS=https://builderiq.vercel.app,http://localhost:3000
\`\`\`

7. **Generate SECRET_KEY:**
\`\`\`bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
\`\`\`

8. **Deploy:** Railway will auto-deploy
9. **Copy URL:** Save the Railway URL (e.g., `https://builderiq-backend-production.up.railway.app`)

### Option B: Render

1. Go to https://render.com
2. New → Web Service
3. Connect your GitHub repo
4. Configure:
   - Name: `builderiq-backend`
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add the same environment variables as above
6. Click "Create Web Service"

---

## 🔄 Step 6: Scraper Service Deployment

### 6.1 Deploy Celery Worker (Railway)

1. **Add New Service** in same Railway project
2. **Configure:**
   - Name: `builderiq-scraper-worker`
   - Root Directory: `/scraper`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `celery -A celery_app worker --loglevel=info`

3. **Add Environment Variables:**

\`\`\`env
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
REDIS_URL=redis://default:token@xxx.upstash.io:6379
OPENAI_API_KEY=sk-xxxxxxxxxxxx
\`\`\`

### 6.2 Deploy Celery Beat Scheduler (Railway)

1. **Add Another Service**
2. **Configure:**
   - Name: `builderiq-scraper-scheduler`
   - Root Directory: `/scraper`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `celery -A celery_app beat --loglevel=info`

3. **Add Same Environment Variables** as worker

**Note:** Beat schedules tasks, Worker executes them. Both are needed!

---

## 🎨 Step 7: Frontend Deployment (Vercel)

### 7.1 Deploy to Vercel

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. **Configure:**
   - Framework Preset: Next.js
   - Root Directory: `/` (or `/frontend` if separate)
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 7.2 Add Environment Variables

In Vercel Project Settings → Environment Variables:

\`\`\`env
NEXT_PUBLIC_API_URL=https://builderiq-backend-production.up.railway.app/api/v1
NEXT_PUBLIC_FRONTEND_URL=https://builderiq.vercel.app
\`\`\`

**Important:** Use your actual Railway backend URL!

### 7.3 Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Visit your live site!

---

## 🔧 Step 8: Backend Configuration

### 8.1 Update CORS Settings

After deploying frontend, update backend environment variable:

\`\`\`env
CORS_ORIGINS=https://your-actual-vercel-url.vercel.app
\`\`\`

### 8.2 Test API Health

Visit: `https://your-backend-url.railway.app/health`

Should return:
\`\`\`json
{"status": "healthy", "database": "connected", "redis": "connected"}
\`\`\`

---

## 👤 Step 9: Create Admin User

### 9.1 Register First User

1. Visit your deployed frontend: `https://builderiq.vercel.app`
2. Click "Sign Up"
3. Create an account

### 9.2 Promote to Admin

1. Go to Supabase Dashboard → Table Editor
2. Open `users` table
3. Find your user
4. Change `role` from `USER` to `ADMIN`
5. Save

Now you can access `/admin` routes!

---

## 🧪 Step 10: Test the System

### 10.1 Test Authentication

1. Login to your account
2. You should see the dashboard

### 10.2 Test Search

1. Go to Search page
2. Try filtering by city: "Indianapolis"
3. Should see placeholder data (or empty if no scrapers ran)

### 10.3 Test Marketing Generator

1. Go to Marketing page
2. Select an incentive/property
3. Click "Generate Content"
4. Should generate AI-powered social media posts

### 10.4 Test Scrapers

1. Go to Admin → Ingestion
2. Click "Run Scrapers Now"
3. Monitor logs in Railway dashboard
4. Check if data appears in dashboard

---

## 🚨 Troubleshooting

### Frontend Can't Connect to Backend

**Error:** `Network Error` or `CORS Error`

**Fix:**
1. Check `NEXT_PUBLIC_API_URL` in Vercel environment variables
2. Ensure backend `CORS_ORIGINS` includes your Vercel URL
3. Restart both services

### Database Connection Failed

**Error:** `Connection refused` or `Authentication failed`

**Fix:**
1. Verify `DATABASE_URL` is correct
2. Check Supabase dashboard - database should be active
3. Ensure password is correct (no special characters causing issues)
4. Use connection pooling URL if available

### Scrapers Not Running

**Error:** No data appearing after running scrapers

**Fix:**
1. Check Celery worker logs in Railway
2. Verify `REDIS_URL` is correct in both worker and beat services
3. Ensure OpenAI API key is valid and has credits
4. Check scraper logs table in database

### Email Not Sending

**Error:** Email delivery fails

**Fix:**
1. Verify SendGrid API key is valid
2. Ensure sender email is verified in SendGrid
3. Check SendGrid dashboard for bounce/block reasons
4. Verify `SENDGRID_FROM_EMAIL` matches verified sender

### AI Features Not Working

**Error:** Marketing generator fails

**Fix:**
1. Check OpenAI API key is valid
2. Ensure you have billing set up and credits
3. Check OpenAI usage dashboard for rate limits
4. Try regenerating API key

---

## 📊 Monitoring & Logs

### Backend Logs
- **Railway:** Dashboard → Service → Logs tab
- **Render:** Dashboard → Logs

### Scraper Logs
- **Railway:** Check worker and beat service logs
- **Database:** Query `scraper_logs` table

### Database Monitoring
- **Supabase:** Dashboard → Database → Logs

### Email Delivery
- **SendGrid:** Dashboard → Activity

---

## 🔐 Security Checklist

Before going live:

- [ ] Change all default passwords
- [ ] Use strong SECRET_KEY (256-bit random)
- [ ] Enable RLS policies in Supabase
- [ ] Set up rate limiting (implemented in backend)
- [ ] Use HTTPS only (Vercel/Railway default)
- [ ] Restrict CORS to your domain only
- [ ] Set up monitoring and alerts
- [ ] Enable database backups in Supabase
- [ ] Review SendGrid sender authentication
- [ ] Rotate API keys periodically

---

## 💰 Cost Estimate (Monthly)

**Development/Testing:**
- Supabase Free: $0
- Upstash Free: $0
- Vercel Hobby: $0
- Railway Free: $0
- SendGrid Free: $0 (100 emails/day)
- OpenAI: ~$5-20 (usage-based)

**Total Development:** ~$5-20/month

**Production (with traffic):**
- Supabase Pro: $25
- Upstash: $0.2/100k requests
- Vercel Pro: $20
- Railway: $10-30 (usage-based)
- SendGrid: $15 (40k emails)
- OpenAI: $50-200 (usage-based)

**Total Production:** ~$120-310/month

---

## 🎯 Next Steps

After successful deployment:

1. **Add More Builders:** Extend scrapers to cover more builders
2. **Custom Branding:** Update logos, colors in frontend
3. **SEO Optimization:** Add meta tags, sitemap
4. **Analytics:** Integrate Google Analytics or Mixpanel
5. **User Feedback:** Add Intercom or support chat
6. **Performance:** Set up CDN, optimize images
7. **Testing:** Add automated tests for critical flows
8. **Documentation:** Create user guides and videos

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review service logs in Railway/Vercel
3. Check database tables in Supabase
4. Verify all environment variables are set correctly
5. Ensure all services are running (not crashed)

---

## 🎉 You're Done!

Your BuilderIQ platform is now live! Users can:

- ✅ Browse builder incentives and inventory
- ✅ Search and filter properties
- ✅ Generate marketing content with AI
- ✅ Save searches and get alerts
- ✅ Export data to CSV

The scrapers will automatically run daily to keep data fresh!
