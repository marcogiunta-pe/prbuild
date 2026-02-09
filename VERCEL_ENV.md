# Vercel Environment Variables

Add these in **Vercel Dashboard → Project → Settings → Environment Variables**.

Use **Production** (and Preview if you want them in preview deploys).

---

## Required

| Name | Value | Notes |
|------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase service role key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_xxx` or `pk_test_xxx` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | `sk_live_xxx` or `sk_test_xxx` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | `whsec_xxx` | From Stripe Dashboard → Webhooks |
| `OPENAI_API_KEY` | `sk-proj-xxx` | OpenAI API key |
| `NEXT_PUBLIC_APP_URL` | `https://prbuild.ai` | Your production URL |

---

## Stripe Price IDs (required for checkout)

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_STRIPE_STARTER_MONTHLY` | `price_xxx` |
| `NEXT_PUBLIC_STRIPE_STARTER_YEARLY` | `price_xxx` |
| `NEXT_PUBLIC_STRIPE_GROWTH_MONTHLY` | `price_xxx` |
| `NEXT_PUBLIC_STRIPE_GROWTH_YEARLY` | `price_xxx` |
| `NEXT_PUBLIC_STRIPE_PRO_MONTHLY` | `price_xxx` |
| `NEXT_PUBLIC_STRIPE_PRO_YEARLY` | `price_xxx` |

---

## Optional

| Name | Value | Notes |
|------|-------|-------|
| `RESEND_API_KEY` | `re_xxx` | For transactional emails |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | Google Analytics 4 |

---

## Copy-paste list (names only)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_STARTER_MONTHLY
NEXT_PUBLIC_STRIPE_STARTER_YEARLY
NEXT_PUBLIC_STRIPE_GROWTH_MONTHLY
NEXT_PUBLIC_STRIPE_GROWTH_YEARLY
NEXT_PUBLIC_STRIPE_PRO_MONTHLY
NEXT_PUBLIC_STRIPE_PRO_YEARLY
OPENAI_API_KEY
RESEND_API_KEY
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_GA_ID
```

Copy values from your local `.env.local` — they should match for production.
