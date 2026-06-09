# Deployment Guide

## 1. Supabase Setup

1. Go to your Supabase project → SQL Editor
2. Run `supabase/migrations/20260609000001_schema.sql`
3. Run `supabase/migrations/20260609000002_rls.sql`
4. Under **Authentication → Providers**, enable Google OAuth
5. Under **Authentication → URL Configuration**, set:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/auth/callback`

## 2. Vercel Deployment

1. Push this repo to GitHub
2. Import the repo in [Vercel](https://vercel.com/new)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` — from Supabase project settings
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase project settings
4. Deploy — Vercel auto-detects Next.js

## 3. Local Development

```bash
cp .env.local.example .env.local
# fill in your Supabase credentials
npm run dev
```

Open http://localhost:3000
