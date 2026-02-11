-- Fix infinite recursion in "Admins manage all profiles" policy.
-- The policy queried profiles to check admin status, which re-triggered the same policy.
-- Use a SECURITY DEFINER function instead - it bypasses RLS when checking.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Drop and recreate profiles policy (this was causing the recursion)
DROP POLICY IF EXISTS "Admins manage all profiles" ON public.profiles;
CREATE POLICY "Admins manage all profiles" ON public.profiles
  FOR ALL USING (public.is_admin());

-- Update other admin policies to use is_admin() for consistency (avoids future recursion)
DROP POLICY IF EXISTS "Admins manage invites" ON public.invites;
CREATE POLICY "Admins manage invites" ON public.invites
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins see all requests" ON public.release_requests;
CREATE POLICY "Admins see all requests" ON public.release_requests
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins manage showcase" ON public.showcase_releases;
CREATE POLICY "Admins manage showcase" ON public.showcase_releases
  FOR ALL USING (public.is_admin());
