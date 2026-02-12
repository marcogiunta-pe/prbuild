ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS onboarding_dismissed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS onboarding_email_sent_at JSONB DEFAULT '{}';
