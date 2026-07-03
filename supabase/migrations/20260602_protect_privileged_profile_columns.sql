-- Prevent privilege escalation and billing/credit tampering via the browser.
--
-- The "Users can update own profile" RLS policy lets an authenticated user
-- update any column on their own profiles row, including `role`. The app ships
-- a browser Supabase client with the anon key + user session, so a user could
-- run profiles.update({ role: 'admin' }) from the console and unlock every
-- admin route. The same hole lets users forge subscription_status / credits.
--
-- RLS is row-level, not column-level. A BEFORE UPDATE trigger restores the
-- privileged columns to their prior values for any non-service-role writer.
-- Server routes use the service-role client (createAdminClient), which reports
-- auth.role() = 'service_role' and is allowed through unchanged.

CREATE OR REPLACE FUNCTION public.protect_privileged_profile_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Server-side writes (service role) are trusted: webhooks, invite/accept,
  -- decrement-credits, admin grants all go through createAdminClient.
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Any other writer (authenticated browser client) cannot change these.
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

DROP TRIGGER IF EXISTS protect_privileged_profile_columns ON public.profiles;
CREATE TRIGGER protect_privileged_profile_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_privileged_profile_columns();

-- Tighten the update policy to also enforce ownership on the resulting row.
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
