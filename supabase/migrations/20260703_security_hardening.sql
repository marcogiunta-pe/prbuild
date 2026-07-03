-- Security + correctness hardening (code review 2026-07-03).
-- Idempotent: safe to paste into the Supabase SQL editor once.
--
-- 1. Re-add `SET search_path = public` to the three SECURITY DEFINER functions
--    shipped in the 20260602 migrations. Without a pinned search_path a definer
--    function is hijackable by a caller who puts a malicious object earlier on
--    their search_path — exactly the hole 20250212_fix_function_search_path
--    closed for the older functions. The Supabase linter flags all three.
-- 2. Make kit-purchase linking case-insensitive and back-fill orphaned rows.
-- 3. Enforce one showcase row per release at the DB layer (kills the
--    check-then-insert publish race).

-- 1a. Atomic free-credit spend.
CREATE OR REPLACE FUNCTION public.spend_free_release(p_user uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  remaining integer;
  current_remaining integer;
BEGIN
  SELECT free_releases_remaining INTO current_remaining
    FROM public.profiles WHERE id = p_user;

  IF current_remaining = -1 THEN
    RETURN -1; -- unlimited, no spend
  END IF;

  UPDATE public.profiles
    SET free_releases_remaining = free_releases_remaining - 1
    WHERE id = p_user AND free_releases_remaining > 0
    RETURNING free_releases_remaining INTO remaining;

  IF NOT FOUND THEN
    RETURN -2; -- no credit
  END IF;

  RETURN remaining;
END;
$$;

-- 1b. Privileged-column protection trigger.
CREATE OR REPLACE FUNCTION public.protect_privileged_profile_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  NEW.role := OLD.role;
  NEW.subscription_status := OLD.subscription_status;
  NEW.stripe_customer_id := OLD.stripe_customer_id;
  NEW.stripe_subscription_id := OLD.stripe_subscription_id;
  NEW.current_plan := OLD.current_plan;
  NEW.billing_interval := OLD.billing_interval;
  NEW.is_free_user := OLD.is_free_user;
  NEW.free_releases_remaining := OLD.free_releases_remaining;

  RETURN NEW;
END;
$$;

-- 1c. Durable rate limiter.
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_key TEXT,
  p_max INTEGER,
  p_window_seconds INTEGER
)
RETURNS TABLE(allowed BOOLEAN, retry_after INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  now_ts    TIMESTAMPTZ := now();
  new_reset TIMESTAMPTZ := now() + make_interval(secs => p_window_seconds);
  cur_count INTEGER;
  cur_reset TIMESTAMPTZ;
BEGIN
  INSERT INTO public.rate_limits (key, count, reset_at)
    VALUES (p_key, 1, new_reset)
  ON CONFLICT (key) DO UPDATE
    SET count = CASE WHEN public.rate_limits.reset_at <= now_ts THEN 1
                     ELSE public.rate_limits.count + 1 END,
        reset_at = CASE WHEN public.rate_limits.reset_at <= now_ts THEN new_reset
                        ELSE public.rate_limits.reset_at END
  RETURNING count, reset_at INTO cur_count, cur_reset;

  IF cur_count > p_max THEN
    RETURN QUERY SELECT false, GREATEST(0, CEIL(EXTRACT(EPOCH FROM (cur_reset - now_ts)))::INTEGER);
  ELSE
    RETURN QUERY SELECT true, 0;
  END IF;
END;
$$;

-- 2. Case-insensitive kit linking. The AFTER-INSERT-on-profiles trigger only
--    ever fires for brand-new signups; the webhook now also links existing
--    accounts on purchase (see app/api/stripe/webhook/route.ts). Match on
--    lower(email) so 'Buyer@x.com' at Checkout links to 'buyer@x.com' at signup.
CREATE OR REPLACE FUNCTION public.link_kit_purchases()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE kit_purchases
  SET user_id = NEW.id, updated_at = NOW()
  WHERE lower(customer_email) = lower(NEW.email)
    AND user_id IS NULL;
  RETURN NEW;
END;
$$;

-- Back-fill any purchases orphaned by the old insert-only / case-sensitive logic.
UPDATE public.kit_purchases kp
SET user_id = p.id, updated_at = NOW()
FROM public.profiles p
WHERE kp.user_id IS NULL
  AND lower(kp.customer_email) = lower(p.email);

-- 3. One showcase row per release. Dedupe existing duplicates (keep earliest
--    published) before adding the constraint so the index build can't fail.
DELETE FROM public.showcase_releases s
USING public.showcase_releases keep
WHERE s.release_request_id = keep.release_request_id
  AND s.release_request_id IS NOT NULL
  AND s.published_at > keep.published_at;

CREATE UNIQUE INDEX IF NOT EXISTS showcase_releases_release_request_id_key
  ON public.showcase_releases (release_request_id);
