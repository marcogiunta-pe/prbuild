-- Move all client-side release_requests writes behind server routes and lock
-- the table down at the RLS layer.
--
-- Before: "Clients can update own requests" let an owner write EVERY column
-- (forge status='published', overwrite admin_notes / admin_refined_content /
-- admin_reviewed_by, skip review states). "Clients can create requests" let
-- the browser insert rows with attacker-controlled amount_paid / stripe_payment_id
-- and race the credit counter via a separate decrement call.
--
-- After: clients can only SELECT their own rows. Every mutation goes through a
-- service-role server route that enforces ownership, the allowed status
-- transition, and the specific columns it is permitted to touch. Admins keep
-- full access through the existing "Admins see all requests" FOR ALL policy.

-- Atomic free-credit spend. Guards against the read-then-write race in the old
-- /api/releases/decrement-credits flow: the UPDATE only succeeds while credit
-- remains, in a single statement.
--   returns new remaining count (>= 0) on success
--   returns -1 when the user has unlimited credits (nothing spent)
--   returns -2 when there is no credit to spend
CREATE OR REPLACE FUNCTION public.spend_free_release(p_user uuid)
RETURNS integer AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Phase 2: drop the over-broad client write policies. Server routes use the
-- service-role client, which bypasses RLS, so legit flows keep working.
DROP POLICY IF EXISTS "Clients can update own requests" ON public.release_requests;
DROP POLICY IF EXISTS "Clients can create requests" ON public.release_requests;

-- Owner SELECT and admin FOR ALL remain in place (defined in schema.sql /
-- 20250212_fix_profiles_rls_recursion.sql). No client INSERT/UPDATE/DELETE.
