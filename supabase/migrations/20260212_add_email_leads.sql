-- Enable uuid-ossp if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Email leads table for quiz, checklist, and teardown signups
CREATE TABLE public.email_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  name TEXT,
  company_name TEXT,
  lead_source TEXT NOT NULL,
  quiz_score INTEGER,
  quiz_answers JSONB,
  subscribed_teardown BOOLEAN DEFAULT TRUE,
  unsubscribe_token TEXT DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_email_leads_email ON public.email_leads(email);
CREATE INDEX idx_email_leads_subscribed ON public.email_leads(subscribed_teardown) WHERE subscribed_teardown = TRUE;

-- Teardown newsletter sends log
CREATE TABLE public.teardown_sends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  pr_company TEXT NOT NULL,
  pr_headline TEXT NOT NULL,
  teardown_content TEXT NOT NULL,
  recipient_count INTEGER,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.email_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teardown_sends ENABLE ROW LEVEL SECURITY;

-- Admin-only read policies (public writes go through service-role client)
CREATE POLICY "Admin can read email_leads"
  ON public.email_leads FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin can update email_leads"
  ON public.email_leads FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin can read teardown_sends"
  ON public.teardown_sends FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
