# BuilderIQ Production Deployment Guide

## Architecture Overview

\`\`\`
┌─────────────┐
│  Frontend   │ (Next.js on Vercel)
│  (Vercel)   │
└──────┬──────┘
       │ HTTP/REST
       ├─────────────────────────┐
       │                         │
   ┌───▼───────┐          ┌──────▼───────┐
   │  FastAPI  │          │   Supabase   │
   │ Backend   ├──────────┤ PostgreSQL   │
   │ (Python)  │ ORM      │  Database    │
   └───┬───────┘          └──────────────┘
       │
   ┌───▼──────────────┐
   │  Redis Cache     │ (Upstash)
   │  + Celery Broker │
   └───┬──────────────┘
       │
   ┌───▼──────────────┐
   │  Celery Workers  │ (Python)
   │  (Scrapers)      │
   └───┬──────────────┘
       │
   ┌───▼──────────────┐
   │  SendGrid        │
   │  Email Service   │
   └──────────────────┘
\`\`\`

## Deployment Steps

### 1. Frontend Deployment (Vercel)

\`\`\`bash
# Connect your GitHub repo to Vercel
# Set environment variables in Vercel dashboard:
NEXT_PUBLIC_API_URL=https://api.builderiq.com/api/v1
NEXT_PUBLIC_FRONTEND_URL=https://builderiq.com
\`\`\`

### 2. Backend Deployment (Railway/Render)

\`\`\`bash
# 1. Create account on Railway or Render
# 2. Connect GitHub repo
# 3. Set environment variables:
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
SECRET_KEY=generate-a-random-key
SENDGRID_API_KEY=your-key
OPENAI_API_KEY=your-key
FRONTEND_URL=https://builderiq.com

# 4. Deploy FastAPI with: gunicorn backend.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
\`\`\`

### 3. Scraper Service (Railway/Render)

\`\`\`bash
# Deploy Celery worker separately
# Command: celery -A scraper.celery_app worker --loglevel=info
\`\`\`

### 4. Database (Supabase)

- Create Supabase project
- Run SQL migrations
- Enable RLS policies
- Set up connection pooling

### 5. Email (SendGrid)

- Sign up for SendGrid
- Create API key
- Add verified sender email

### 6. Redis (Upstash)

- Create Upstash Redis database
- Copy connection URL to .env

## Monitoring

- Set up error tracking with Sentry
- Monitor API performance with New Relic
- Set up log aggregation with DataDog

## Scaling Considerations

- Use connection pooling for PostgreSQL
- Implement read replicas for heavy read load
- Scale Celery workers based on queue depth
- Use CDN for static assets
