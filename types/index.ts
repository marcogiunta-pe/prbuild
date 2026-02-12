// Database types
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  company_website: string | null;
  role: 'client' | 'admin' | 'journalist_reviewer';
  stripe_customer_id: string | null;
  is_free_user: boolean;
  free_releases_remaining: number;
  onboarding_completed_at: string | null;
  onboarding_dismissed_at: string | null;
  onboarding_email_sent_at: Record<string, string> | null;
  created_at: string;
  updated_at: string;
}

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  submitted_by: string;
  status: FeatureRequestStatus;
  vote_count: number;
  admin_response: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  submitter?: Profile;
  user_voted?: boolean;
}

export interface FeatureVote {
  id: string;
  feature_request_id: string;
  user_id: string;
  created_at: string;
}

export type FeatureRequestStatus = 
  | 'pending'
  | 'under_review'
  | 'planned'
  | 'in_progress'
  | 'completed'
  | 'declined';

export interface ReleaseRequest {
  id: string;
  client_id: string;
  
  // Client Input
  company_name: string;
  company_website: string;
  announcement_type: AnnouncementType;
  news_hook: string;
  dateline_city: string;
  release_date: string;
  core_facts: string[];
  quote_sources: QuoteSource[] | null;
  boilerplate: string | null;
  company_facts: string | null;
  media_contact_name: string;
  media_contact_title: string | null;
  media_contact_email: string;
  media_contact_phone: string | null;
  visuals_description: string | null;
  desired_cta: string;
  supporting_materials: string | null;
  
  // Plan & Payment
  plan: Plan;
  amount_paid: number;
  stripe_payment_id: string | null;
  
  // AI Generated Content
  ai_draft_raw: any | null;
  ai_headline_options: string[] | null;
  ai_selected_headline: string | null;
  ai_subhead: string | null;
  ai_draft_content: string | null;
  ai_visuals_suggestions: any | null;
  ai_distribution_checklist: string[] | null;
  ai_generated_at: string | null;
  
  // Panel Critique
  panel_critique_raw: any | null;
  panel_individual_feedback: PanelFeedback[] | null;
  panel_synthesis: string | null;
  panel_contrarian_recommendation: ContrarianRecommendation | null;
  panel_reviewed_at: string | null;
  
  // Admin Refined Content
  admin_refined_content: string | null;
  pending_rewrite_content: string | null;
  rewrite_used: boolean;
  client_edited_content: string | null;
  admin_notes: string | null;
  admin_reviewed_by: string | null;
  admin_reviewed_at: string | null;
  
  // Client Feedback
  client_feedback: string | null;
  client_feedback_at: string | null;
  
  // Final Content
  final_content: string | null;
  final_approved_at: string | null;
  
  // Quality Review
  quality_score: number | null;
  quality_notes: string | null;
  quality_reviewed_by: string | null;
  quality_reviewed_at: string | null;
  
  // Categorization
  category: string | null;
  tags: string[] | null;
  industry: Industry | null;
  
  // Status
  status: ReleaseStatus;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  sent_to_client_at: string | null;
  published_at: string | null;
}

export interface JournalistSubscriber {
  id: string;
  email: string;
  name: string | null;
  outlet: string | null;
  beat: string | null;
  categories: string[];
  frequency: 'immediate' | 'daily' | 'weekly';
  is_verified: boolean;
  verification_token: string | null;
  unsubscribe_token: string;
  created_at: string;
}

export interface ShowcaseRelease {
  id: string;
  release_request_id: string;
  headline: string;
  subhead: string | null;
  company_name: string;
  summary: string;
  full_content: string;
  category: string;
  industry: string | null;
  tags: string[] | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  view_count: number;
  share_count: number;
  journalist_clicks: number;
  published_at: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  release_request_id: string;
  user_id: string;
  action: string;
  details: any;
  created_at: string;
}

// Enums and types
export type AnnouncementType = 
  | 'product_launch'
  | 'funding'
  | 'partnership'
  | 'event'
  | 'award'
  | 'hire'
  | 'milestone'
  | 'other';

export type Plan = 'starter' | 'growth' | 'pro';

export type Industry = 'healthcare' | 'technology' | 'finance' | 'retail' | 'general';

export type ReleaseStatus =
  | 'submitted'
  | 'draft_generated'
  | 'panel_reviewed'
  | 'admin_approved'
  | 'awaiting_client'
  | 'client_feedback'
  | 'client_approved'
  | 'final_pending'
  | 'final_approved'
  | 'quality_review'
  | 'quality_approved'
  | 'published'
  | 'needs_revision'
  | 'rejected';

export interface QuoteSource {
  name: string;
  title: string;
  quote?: string;
}

export interface PanelFeedback {
  persona: string;
  role: string;
  feedback: string;
  compelling: boolean;
  missing: string;
  verdict: string;
}

export interface ContrarianRecommendation {
  raw: string;
  remove: string;
  sharpen: string;
  risk: string;
  ignore: string;
}

// Form types
export interface IntakeFormData {
  companyName: string;
  companyWebsite: string;
  announcementType: AnnouncementType;
  newsHook: string;
  datelineCity: string;
  releaseDate: Date;
  coreFacts: string[];
  quoteSources: QuoteSource[];
  boilerplate?: string;
  companyFacts?: string;
  mediaContactName: string;
  mediaContactTitle?: string;
  mediaContactEmail: string;
  mediaContactPhone?: string;
  visualsDescription?: string;
  desiredCta: string;
  industry: Industry;
}

// Pricing
export type BillingInterval = 'monthly' | 'yearly';

export const PRICING = {
  starter: {
    name: 'Starter',
    monthly: {
      price: 9,
      priceInCents: 900,
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_MONTHLY || '',
    },
    yearly: {
      price: 90,
      priceInCents: 9000,
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_YEARLY || '',
      savings: 18, // 2 months free
    },
    releases: 1,
    description: 'Best for occasional announcements',
    features: [
      '1 press release',
      'Professional writing',
      'Journalist panel review',
      'Client revision round',
      'Showcase publication',
      'Newsletter distribution',
    ],
  },
  growth: {
    name: 'Growth',
    monthly: {
      price: 19,
      priceInCents: 1900,
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_GROWTH_MONTHLY || '',
    },
    yearly: {
      price: 190,
      priceInCents: 19000,
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_GROWTH_YEARLY || '',
      savings: 38, // 2 months free
    },
    releases: 3,
    description: 'Best for growing companies',
    popular: true,
    features: [
      '3 press releases',
      'Everything in Starter',
      'Priority turnaround',
      'Detailed analytics',
    ],
  },
  pro: {
    name: 'Pro',
    monthly: {
      price: 39,
      priceInCents: 3900,
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY || '',
    },
    yearly: {
      price: 390,
      priceInCents: 39000,
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY || '',
      savings: 78, // 2 months free
    },
    releases: 5,
    description: 'Best for regular PR needs',
    features: [
      '5 press releases',
      'Everything in Growth',
      'Rush delivery available',
      'Dedicated account support',
    ],
  },
} as const;

export const CATEGORIES = [
  'Technology & Software',
  'Healthcare & Medical',
  'Finance & Fintech',
  'Retail & Consumer',
  'Manufacturing & Industrial',
  'Real Estate',
  'Nonprofit & Social Impact',
  'Other',
] as const;

export const ANNOUNCEMENT_TYPES = [
  { value: 'product_launch', label: 'Product Launch' },
  { value: 'funding', label: 'Funding Round' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'hire', label: 'Key Hire' },
  { value: 'award', label: 'Award / Recognition' },
  { value: 'event', label: 'Event' },
  { value: 'milestone', label: 'Company Milestone' },
  { value: 'other', label: 'Other' },
] as const;

export const INDUSTRIES = [
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'technology', label: 'Technology' },
  { value: 'finance', label: 'Finance' },
  { value: 'retail', label: 'Retail' },
  { value: 'general', label: 'General / Other' },
] as const;

// Email leads (quiz, checklist, teardown signups)
export interface EmailLead {
  id: string;
  email: string;
  name: string | null;
  company_name: string | null;
  lead_source: 'quiz' | 'checklist' | 'teardown_signup';
  quiz_score: number | null;
  quiz_answers: Record<string, boolean> | null;
  subscribed_teardown: boolean;
  unsubscribe_token: string;
  created_at: string;
  updated_at: string;
}

// Teardown newsletter sends
export interface TeardownSend {
  id: string;
  subject: string;
  pr_company: string;
  pr_headline: string;
  teardown_content: string;
  recipient_count: number | null;
  sent_at: string;
}
