# PRBuild – Development Environment

Quick setup to run the app locally.

## Prerequisites

- **Node.js 18+** – [nodejs.org](https://nodejs.org) or `nvm install 18`
- **Supabase** – [supabase.com](https://supabase.com) (hosted DB + Auth)
- **Stripe** – [stripe.com](https://stripe.com) (test keys)
- **OpenAI** – API key from [platform.openai.com](https://platform.openai.com)
- **Resend** – [resend.com](https://resend.com) (optional for emails in dev)

## One-time setup

```bash
# 1. Install dependencies
npm install

# 2. Create env file (copies .env.example → .env.local if missing)
npm run setup

# 3. Edit .env.local with your keys (see below)
```

## Environment variables

Copy from `.env.example` into `.env.local` and replace placeholders:

| Variable | Required for | Notes |
|----------|--------------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Auth, DB | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth, DB | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin, server | Supabase service role key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Checkout | Stripe test publishable key |
| `STRIPE_SECRET_KEY` | Checkout, webhooks | Stripe test secret key |
| `STRIPE_WEBHOOK_SECRET` | Webhooks | From Stripe CLI or Dashboard |
| `NEXT_PUBLIC_STRIPE_*_MONTHLY` / `*_YEARLY` | Pricing | Stripe price IDs |
| `OPENAI_API_KEY` | AI drafts, panel | OpenAI API key |
| `RESEND_API_KEY` | Emails | Optional in dev |
| `NEXT_PUBLIC_APP_URL` | Links, redirects | `http://localhost:24678` |

**Minimal dev:** Supabase URL + anon key + service role + `NEXT_PUBLIC_APP_URL` will get the app running; auth and DB will work. Add Stripe/OpenAI when you need checkout or AI.

## Database

1. Create a Supabase project.
2. In Supabase → **SQL Editor**, run the contents of `supabase/schema.sql`.

## Run the dev server

```bash
npm run dev
```

Open [http://localhost:24678](http://localhost:24678).

## Optional: Stripe webhooks in dev

To test checkout and webhooks locally:

```bash
# Install Stripe CLI, then:
stripe listen --forward-to localhost:24678/api/stripe/webhook
```

Use the printed webhook secret in `.env.local` as `STRIPE_WEBHOOK_SECRET`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server (port 24678) |
| `npm run setup` | Ensure `.env.local` exists (copy from `.env.example`) |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run lint` | Run ESLint |

## Troubleshooting

- **"localhost sent invalid response"** – Use **http://** not **https://**. The dev server is plain HTTP only (e.g. `http://localhost:24678`). Also ensure the dev server is running and you’re using the port shown in the terminal.
- **"EMFILE: too many open files" / Watchpack Error** – The file watcher is hitting your system limit. Options: (1) Run `npm run dev:safe` (raises limit on macOS/Linux), or (2) In a new terminal run `ulimit -n 10240` then `npm run dev`. The dev server also uses webpack polling to reduce file handles.
- **Homepage shows 404**
  1. Stop the dev server (Ctrl+C), then: `rm -rf .next && npm run dev`
  2. Open **http://localhost:24678** with no path and no trailing slash.
  3. Use **`npm run dev`** for development. If you use `npm run start`, run `npm run build` first (dev and production use different builds).
  4. If you see “PRBuild Custom 404 – This is the custom not-found page”, the app is running but the route didn’t match; try step 1 again. If you see the default Next.js 404, the server may be from another project or port.
- **"Failed to fetch Inter from Google Fonts"** – Build needs network; run `npm run build` with internet. Root layout uses system font in dev.
- **Supabase auth redirect** – Ensure `NEXT_PUBLIC_APP_URL` is `http://localhost:24678` and your Supabase project has that URL in Auth → URL configuration.
- **Stripe webhook 404** – Use Stripe CLI to forward events, or leave webhook secret empty and test checkout only (no post-payment webhook in dev).
