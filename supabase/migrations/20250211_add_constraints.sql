-- Add UNIQUE constraint on stripe_customer_id to prevent duplicate Stripe customers
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_stripe_customer_id_unique UNIQUE (stripe_customer_id);

-- Add ON DELETE SET NULL to admin/quality reviewer FKs
-- so deleting an admin user doesn't break release_requests rows
ALTER TABLE public.release_requests
  DROP CONSTRAINT IF EXISTS release_requests_admin_reviewed_by_fkey,
  ADD CONSTRAINT release_requests_admin_reviewed_by_fkey
    FOREIGN KEY (admin_reviewed_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.release_requests
  DROP CONSTRAINT IF EXISTS release_requests_quality_reviewed_by_fkey,
  ADD CONSTRAINT release_requests_quality_reviewed_by_fkey
    FOREIGN KEY (quality_reviewed_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Add ON DELETE SET NULL to activity_log.user_id so deleting a user doesn't lose activity records
ALTER TABLE public.activity_log
  DROP CONSTRAINT IF EXISTS activity_log_user_id_fkey,
  ADD CONSTRAINT activity_log_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
