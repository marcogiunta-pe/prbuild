-- Supabase Database Schema for PRBuild
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users/Profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  company_website TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin', 'journalist_reviewer')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_plan TEXT,
  billing_interval TEXT,
  subscription_status TEXT DEFAULT 'none',
  is_free_user BOOLEAN DEFAULT FALSE,
  free_releases_remaining INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PR Release Requests
CREATE TABLE public.release_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES public.profiles(id) NOT NULL,
  
  -- Client Input (Intake Form)
  company_name TEXT NOT NULL,
  company_website TEXT NOT NULL,
  announcement_type TEXT NOT NULL,
  news_hook TEXT NOT NULL,
  dateline_city TEXT NOT NULL,
  release_date DATE NOT NULL,
  core_facts TEXT[] NOT NULL,
  quote_sources JSONB,
  boilerplate TEXT,
  company_facts TEXT,
  media_contact_name TEXT NOT NULL,
  media_contact_title TEXT,
  media_contact_email TEXT NOT NULL,
  media_contact_phone TEXT,
  visuals_description TEXT,
  desired_cta TEXT NOT NULL,
  supporting_materials TEXT,
  supporting_context TEXT,
  
  -- Plan & Payment
  plan TEXT NOT NULL CHECK (plan IN ('starter', 'growth', 'pro')),
  amount_paid INTEGER NOT NULL,
  stripe_payment_id TEXT,
  
  -- AI Generated Content
  ai_draft_raw JSONB,
  ai_headline_options TEXT[],
  ai_selected_headline TEXT,
  ai_subhead TEXT,
  ai_draft_content TEXT,
  ai_visuals_suggestions JSONB,
  ai_distribution_checklist TEXT[],
  ai_generated_at TIMESTAMPTZ,
  
  -- Panel Critique (AI-powered)
  panel_critique_raw JSONB,
  panel_individual_feedback JSONB,
  panel_synthesis TEXT,
  panel_contrarian_recommendation JSONB,
  panel_reviewed_at TIMESTAMPTZ,
  
  -- Admin Refined Content
  admin_refined_content TEXT,
  pending_rewrite_content TEXT,
  rewrite_used BOOLEAN DEFAULT FALSE,
  client_edited_content TEXT,
  admin_notes TEXT,
  admin_reviewed_by UUID REFERENCES public.profiles(id),
  admin_reviewed_at TIMESTAMPTZ,
  
  -- Client Feedback
  client_feedback TEXT,
  client_feedback_at TIMESTAMPTZ,
  
  -- Final Content
  final_content TEXT,
  final_approved_at TIMESTAMPTZ,
  
  -- Quality Review
  quality_score INTEGER,
  quality_notes TEXT,
  quality_reviewed_by UUID REFERENCES public.profiles(id),
  quality_reviewed_at TIMESTAMPTZ,
  
  -- Categorization (for showcase)
  category TEXT,
  tags TEXT[],
  industry TEXT,
  
  -- Status tracking
  status TEXT DEFAULT 'submitted' CHECK (status IN (
    'submitted',
    'draft_generated',
    'panel_reviewed',
    'admin_approved',
    'awaiting_client',
    'client_feedback',
    'client_approved',
    'final_pending',
    'final_approved',
    'quality_review',
    'quality_approved',
    'published',
    'needs_revision',
    'rejected'
  )),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  sent_to_client_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ
);

-- Journalist Subscribers (for distribution)
CREATE TABLE public.journalist_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  outlet TEXT,
  beat TEXT,
  categories TEXT[] NOT NULL,
  frequency TEXT DEFAULT 'weekly' CHECK (frequency IN ('immediate', 'daily', 'weekly')),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token TEXT,
  unsubscribe_token TEXT DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Showcase (Published PRs)
CREATE TABLE public.showcase_releases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  release_request_id UUID REFERENCES public.release_requests(id),
  
  -- Display info
  headline TEXT NOT NULL,
  subhead TEXT,
  company_name TEXT NOT NULL,
  summary TEXT NOT NULL,
  full_content TEXT NOT NULL,
  category TEXT NOT NULL,
  industry TEXT,
  tags TEXT[],
  
  -- Media contact (public)
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  
  -- Tracking
  view_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  journalist_clicks INTEGER DEFAULT 0,
  
  -- Timestamps
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter sends (tracking)
CREATE TABLE public.newsletter_sends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  category TEXT,
  release_ids UUID[],
  recipient_count INTEGER,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity log (for admin tracking)
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  release_request_id UUID REFERENCES public.release_requests(id),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feature Requests (user feedback)
CREATE TABLE public.feature_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  submitted_by UUID REFERENCES public.profiles(id) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'planned', 'in_progress', 'completed', 'declined')),
  vote_count INTEGER DEFAULT 0,
  admin_response TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feature Votes (one per user per feature)
CREATE TABLE public.feature_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feature_request_id UUID REFERENCES public.feature_requests(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(feature_request_id, user_id)
);

-- AI Prompt Configurations (editable from admin panel)
CREATE TABLE public.prompt_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_key TEXT UNIQUE NOT NULL,
  prompt_name TEXT NOT NULL,
  prompt_description TEXT,
  system_prompt TEXT NOT NULL,
  user_prompt_template TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Free user invites: admin-added (approved_at set) or public request (approved_at null until admin approves)
CREATE TABLE public.invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  free_releases_remaining INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ
);
-- Migration for existing DBs:
--   ALTER TABLE public.invites ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
--   UPDATE public.invites SET approved_at = created_at WHERE approved_at IS NULL;

-- Row Level Security Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.release_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showcase_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journalist_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Release requests policies
CREATE POLICY "Clients see own requests" ON public.release_requests
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Clients can create requests" ON public.release_requests
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update own requests" ON public.release_requests
  FOR UPDATE USING (auth.uid() = client_id);

-- Admin policies (need to check role in profiles)
CREATE POLICY "Admins see all requests" ON public.release_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins manage all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Invites: admins only (service role used for public token lookup in API)
CREATE POLICY "Admins manage invites" ON public.invites
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Showcase is public for reading
CREATE POLICY "Public showcase access" ON public.showcase_releases
  FOR SELECT USING (true);

CREATE POLICY "Admins manage showcase" ON public.showcase_releases
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Newsletter sends - admins only
CREATE POLICY "Admins manage newsletter sends" ON public.newsletter_sends
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Journalist subscribers - admins only
CREATE POLICY "Admins manage journalists" ON public.journalist_subscribers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Activity log - admins only
CREATE POLICY "Admins view activity" ON public.activity_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Feature requests RLS
ALTER TABLE public.feature_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_votes ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view feature requests
CREATE POLICY "Authenticated users can view features" ON public.feature_requests
  FOR SELECT TO authenticated USING (true);

-- Users can create feature requests
CREATE POLICY "Users can create features" ON public.feature_requests
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = submitted_by);

-- Admins can update feature requests
CREATE POLICY "Admins can update features" ON public.feature_requests
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Users can view all votes
CREATE POLICY "Users can view votes" ON public.feature_votes
  FOR SELECT TO authenticated USING (true);

-- Users can manage their own votes
CREATE POLICY "Users can manage own votes" ON public.feature_votes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes" ON public.feature_votes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Prompt configs RLS - admins only
ALTER TABLE public.prompt_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage prompts" ON public.prompt_configs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow reading prompts from server-side (for API routes)
CREATE POLICY "Service role can read prompts" ON public.prompt_configs
  FOR SELECT TO service_role USING (true);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_release_requests_updated_at
  BEFORE UPDATE ON public.release_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_feature_requests_updated_at
  BEFORE UPDATE ON public.feature_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_prompt_configs_updated_at
  BEFORE UPDATE ON public.prompt_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
