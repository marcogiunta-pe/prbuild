-- Reconcile prod's profiles table with every column the app reads/writes.
--
-- Account Settings was throwing "Could not find the 'industry' column of
-- 'profiles' in the schema cache" because the 20260326/20260329 profile-column
-- migrations never reached prod (CLIENT migration history is out of sync with
-- the dashboard — see the supabase-migration-drift note). Every statement is
-- ADD COLUMN IF NOT EXISTS, so this is a safe no-op for any column already
-- present and additive for the missing ones.

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS job_title TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS industry TEXT;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS media_contact_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS media_contact_title TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS media_contact_email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS media_contact_phone TEXT;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_state TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_zip TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_country TEXT DEFAULT 'US';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_logo_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_boilerplate TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_voice_style TEXT;

-- Force PostgREST to refresh its schema cache so the new columns are queryable
-- immediately (the error was a schema-cache miss).
NOTIFY pgrst, 'reload schema';
