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

This deploys to your main production URL (e.g. `prbuild.com`).

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
- `NEXT_PUBLIC_APP_URL` → your Vercel URL (e.g. `https://prbuild.com`)

---

## Custom domain: prbuild.com

1. **Vercel:** Project → **Settings** → **Domains** → **Add** → enter `prbuild.com`
2. **DNS:** At your domain registrar, add the records Vercel shows:
   - **A record:** `@` → `76.76.21.21` (Vercel's IP)
   - **CNAME:** `www` → `cname.vercel-dns.com`
   - Or use Vercel nameservers if offered
3. **Supabase:** Add `https://prbuild.com` and `https://www.prbuild.com` to Auth → URL Configuration (redirect URLs)
4. **Stripe:** Add `https://prbuild.com` to Allowed redirect URLs
5. **Env:** In Vercel, set `NEXT_PUBLIC_APP_URL` = `https://prbuild.com`
