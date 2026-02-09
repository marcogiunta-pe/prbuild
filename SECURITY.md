# Security Audit & Checklist

## Summary

Security review completed. Critical issue fixed, hardening applied.

---

## ✅ Fixed Issues

### 1. **Stripe create-checkout – critical** (fixed)
- **Issue:** Endpoint accepted `userId` from the request body with no auth. An attacker could create checkout sessions for any user.
- **Fix:** Require authentication; use `user.id` from session only. Never trust client-supplied userId.

### 2. **PATCH /api/releases/[id] – mass assignment** (fixed)
- **Issue:** Arbitrary request body was spread into the update, allowing overwriting of sensitive fields.
- **Fix:** Whitelist allowed fields; clients can only update `client_feedback`, `client_edited_content`, `status`, etc. Admins have a broader whitelist.

### 3. **newsletter_sends RLS** (fixed)
- **Issue:** Table had RLS enabled but no policy; admins may have been blocked.
- **Fix:** Added `"Admins manage newsletter sends"` policy in schema.sql.

---

## ✅ Verified Secure

| Area | Status |
|------|--------|
| **Secrets** | `.env*` gitignored; no server secrets in `NEXT_PUBLIC_*` |
| **Stripe webhook** | Signature verified via `STRIPE_WEBHOOK_SECRET` |
| **API auth** | Routes check `supabase.auth.getUser()` |
| **Admin routes** | Role checked from `profiles.role` |
| **Supabase RLS** | Enabled on main tables; policies in place |
| **Headers** | X-Frame-Options, X-Content-Type-Options, Referrer-Policy set |

---

## 🔧 Apply Newsletter RLS Policy (if DB already deployed)

If you deployed before this fix, run in Supabase SQL Editor:

```sql
CREATE POLICY "Admins manage newsletter sends" ON public.newsletter_sends
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

---

## Recommendations

1. **Rate limiting** – Consider Vercel Edge or Upstash for `/api/ai/*`, `/api/journalist` (POST), `/api/newsletter` (POST).
2. **CSP** – Add Content-Security-Policy header if you want stricter XSS protection.
3. **Input validation** – Validate/sanitize string lengths and types (e.g. Zod) on API routes.
4. **Dependencies** – Run `npm audit` regularly.
