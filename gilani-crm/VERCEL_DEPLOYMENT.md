# Vercel Deployment Guide for Gilani CRM

## Prerequisites
- A Vercel account (sign up at https://vercel.com)
- Your Supabase project URL and anon key
- Git repository (GitHub, GitLab, or Bitbucket)

## Environment Variables

You need to configure the following environment variables in Vercel:

### Required Variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step-by-Step Deployment

### 1. Prepare Your Repository
Ensure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Import Project to Vercel

#### Option A: Using Vercel Dashboard (Recommended)
1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your Git provider and repository
4. Click "Import"

#### Option B: Using Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd /Users/xerxesduanemagdaluyo/Desktop/gilani-crm/gilani-crm
vercel
```

### 3. Configure Environment Variables

#### In Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Settings" → "Environment Variables"
3. Add each variable:
   - **Variable Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
   - **Environments**: Select "Production", "Preview", and "Development"
   
   - **Variable Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase anonymous key
   - **Environments**: Select "Production", "Preview", and "Development"

4. Click "Save"

#### Using Vercel CLI:
```bash
# Set production environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Set preview environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview

# Set development environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL development
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development
```

### 4. Configure Build Settings (if needed)

Vercel should auto-detect Next.js, but verify these settings:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (or `next build`)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`
- **Root Directory**: `gilani-crm` (if your project is in a subdirectory)

### 5. Deploy

#### First Deployment:
If using the dashboard, click "Deploy" after configuring environment variables.

If using CLI:
```bash
vercel --prod
```

#### Subsequent Deployments:
Vercel automatically deploys:
- **Production**: Every push to your main/master branch
- **Preview**: Every push to other branches and pull requests

### 6. Get Your Supabase Credentials

If you don't have your Supabase credentials:

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to "Settings" → "API"
4. Copy:
   - **Project URL** (under "Project URL" section)
   - **anon/public key** (under "Project API keys" section)

### 7. Configure Supabase Authentication URLs

After your first deployment, update Supabase with your Vercel URL:

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel domain to:
   - **Site URL**: `https://your-project.vercel.app`
   - **Redirect URLs**: Add:
     - `https://your-project.vercel.app/auth/callback`
     - `https://your-project.vercel.app/**` (wildcard for all routes)

### 8. Verify Deployment

1. Visit your Vercel deployment URL
2. Check the deployment logs in Vercel dashboard
3. Test authentication and key features

## Useful Commands

```bash
# View deployment logs
vercel logs [deployment-url]

# List all deployments
vercel ls

# Remove a deployment
vercel rm [deployment-url]

# Pull environment variables to local
vercel env pull

# Open project in browser
vercel open
```

## Troubleshooting

### Build Fails
- Check Vercel build logs for errors
- Ensure all dependencies are in `package.json`
- Verify TypeScript has no errors: `npm run build` locally

### Environment Variables Not Working
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding new environment variables
- Clear build cache: Settings → General → Clear Build Cache

### Supabase Connection Issues
- Verify credentials are correct
- Check Supabase Dashboard for allowed domains
- Ensure API keys haven't been revoked

### Authentication Not Working
- Verify redirect URLs in Supabase match your Vercel domain
- Check that cookies are enabled
- Review Supabase Auth logs

## Domain Configuration (Optional)

To use a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as shown
4. Update Supabase redirect URLs with your custom domain

## Performance Optimization

- Enable Edge Functions if needed
- Configure ISR (Incremental Static Regeneration) for better performance
- Use Vercel Analytics: Settings → Analytics
- Enable Vercel Speed Insights

## Security Best Practices

✅ Never commit `.env.local` or `.env` files
✅ Use environment variables for all secrets
✅ Enable Supabase RLS (Row Level Security) policies
✅ Regularly rotate API keys
✅ Use preview deployments to test before production

## Support

- Vercel Documentation: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- Supabase Documentation: https://supabase.com/docs
