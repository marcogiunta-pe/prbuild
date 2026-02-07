# Deploy PRBuild to Vercel

## Option A: Deploy from your terminal (quickest)

### 1. Log in to Vercel (one-time)

```bash
cd "/Users/marcogiunta/Library/Mobile Documents/com~apple~CloudDocs/Cursor/PRbuild"
npx vercel login
```

Follow the prompts (email or GitHub).

### 2. Deploy

```bash
npx vercel
```

First time: it will ask to link to a project — choose **Create new**.  
Then it deploys and gives you a URL like `https://prbuild-xxx.vercel.app`.

### 3. Production deploy

```bash
npx vercel --prod
```

This deploys to your main production URL (e.g. `prbuild.vercel.app`).

---

## Option B: Deploy from GitHub + Vercel

1. Push this project to **GitHub** (create a repo if needed).
2. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**.
3. Import your GitHub repo.
4. Add environment variables (same as `.env.local`).
5. Deploy.

---

## Environment variables on Vercel

In Vercel Dashboard → Project → Settings → Environment Variables, add:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_*_MONTHLY` / `*_YEARLY` (all 6 price IDs)
- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_APP_URL` → your Vercel URL (e.g. `https://prbuild.vercel.app`)

---

## Custom domain

In Vercel Dashboard → Project → Settings → Domains, add your domain (e.g. `prbuild.com`).
