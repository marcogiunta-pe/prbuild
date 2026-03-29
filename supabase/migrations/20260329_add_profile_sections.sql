-- Personal info
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- Media contact (default for press releases)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS media_contact_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS media_contact_title TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS media_contact_email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS media_contact_phone TEXT;

-- Company info
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_logo_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_boilerplate TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_voice_style TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS job_title TEXT;
