# 🚀 Quick Vercel Deployment Guide

## Environment Variables Needed

Copy these to Vercel Dashboard → Settings → Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📍 Where to Find Your Supabase Credentials

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to: **Settings → API**
4. Copy:
   - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🔗 Deploy Steps

### Option 1: Vercel Dashboard (Easiest)
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Add environment variables (above)
4. Click **Deploy**

### Option 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd /Users/xerxesduanemagdaluyo/Desktop/gilani-crm/gilani-crm
vercel --prod
```

## ⚙️ Post-Deployment: Update Supabase

After deployment, add your Vercel URL to Supabase:

1. Go to Supabase → **Authentication → URL Configuration**
2. Add to **Redirect URLs**:
   ```
   https://your-app.vercel.app/**
   https://your-app.vercel.app/auth/callback
   ```
3. Set **Site URL**: `https://your-app.vercel.app`

## ✅ Verification Checklist

- [ ] Environment variables added to Vercel
- [ ] Project deployed successfully
- [ ] Supabase redirect URLs updated
- [ ] App loads at Vercel URL
- [ ] Authentication works
- [ ] Database queries work

## 🔧 Common Issues

**Build fails?** 
- Check Vercel build logs
- Run `npm run build` locally to test

**Auth not working?**
- Verify Supabase redirect URLs include your Vercel domain
- Check environment variables are set correctly

**Database queries fail?**
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the anon/public key (not service key)

## 📚 Full Documentation

See `VERCEL_DEPLOYMENT.md` for complete deployment guide.
