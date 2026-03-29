-- Split address into proper fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_state TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_zip TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_country TEXT DEFAULT 'US';
