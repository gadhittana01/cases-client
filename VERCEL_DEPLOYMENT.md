# Vercel Deployment Guide

## Prerequisites

1. Vercel account (sign up at https://vercel.com)
2. GitHub/GitLab/Bitbucket repository with your code
3. Environment variables ready

## Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Select the repository containing your frontend code

### 2. Configure Project Settings

**Important**: Since your frontend is in the `client` subdirectory:

- **Framework Preset**: Vite (auto-detected)
- **Root Directory**: `client` ⚠️ **Set this in Vercel project settings**
- **Build Command**: `npm run build` (runs in client directory)
- **Output Directory**: `dist`
- **Install Command**: `npm install --legacy-peer-deps`

**To set Root Directory:**
1. After importing project, go to **Settings → General**
2. Under "Root Directory", click "Edit"
3. Select `client` folder
4. Save changes

### 3. Set Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

#### Required Variables:

```
VITE_API_URL=https://your-backend-api.com/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_PUSHER_KEY=your_pusher_key
VITE_PUSHER_CLUSTER=ap1
```

#### Environment-Specific Variables:

You can set different values for:
- **Production**: Production deployments
- **Preview**: Preview deployments (PRs)
- **Development**: Local development (via Vercel CLI)

**Example:**
- Production: `VITE_API_URL=https://api.yourdomain.com/api/v1`
- Preview: `VITE_API_URL=https://api-staging.yourdomain.com/api/v1`

### 4. Deploy

1. Click "Deploy"
2. Vercel will:
   - Install dependencies (`npm install --legacy-peer-deps`)
   - Build the project (`npm run build`)
   - Deploy to a unique URL

### 5. Verify Deployment

1. Check the deployment logs for any errors
2. Visit the deployment URL
3. Verify environment variables are loaded:
   - Open browser console
   - Check network requests use correct `VITE_API_URL`
   - Verify Pusher connection uses correct key/cluster

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `https://api.example.com/api/v1` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` or `pk_live_...` |
| `VITE_PUSHER_KEY` | Pusher app key | `a3edf75041c3993d3ab6` |
| `VITE_PUSHER_CLUSTER` | Pusher cluster | `ap1` |

## Important Notes

1. **Vite Environment Variables**: All variables must be prefixed with `VITE_` to be exposed to the client
2. **Build-Time Variables**: Environment variables are embedded at build time, not runtime
3. **Redeploy After Changes**: If you change environment variables, you need to redeploy
4. **No Secrets in Client**: Never put secrets in frontend env vars (they're visible in the browser)

## Troubleshooting

### Variables Not Working?

1. **Check Prefix**: Ensure all variables start with `VITE_`
2. **Redeploy**: Environment variable changes require a new deployment
3. **Check Build Logs**: Look for warnings about missing variables
4. **Verify in Code**: Check `import.meta.env.VITE_*` in browser console

### Build Fails?

1. Check `package.json` scripts
2. Verify Node.js version (Vercel uses Node 18+ by default)
3. Check build logs for specific errors
4. Ensure `--legacy-peer-deps` is used if needed

### API Calls Fail?

1. Verify `VITE_API_URL` is set correctly
2. Check CORS settings on backend
3. Ensure backend is accessible from Vercel's IPs
4. Check browser console for CORS errors

## Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL is automatically provisioned by Vercel

## Continuous Deployment

Vercel automatically deploys:
- **Production**: On push to main/master branch
- **Preview**: On every push to other branches/PRs

Each preview gets its own URL for testing.
