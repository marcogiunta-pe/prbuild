'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2, User, Building, Globe, Mail, Phone, Briefcase } from 'lucide-react';

const INDUSTRIES = [
  'Technology / SaaS',
  'Healthcare',
  'Finance / Fintech',
  'Real Estate',
  'E-commerce / Retail',
  'Legal',
  'Nonprofits',
  'Education',
  'Media / Entertainment',
  'Manufacturing',
  'Energy',
  'Government',
  'Other',
];

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    companyWebsite: '',
    industry: '',
    jobTitle: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile) {
      // If profile is already complete, skip onboarding
      if (profile.phone && profile.company_name) {
        router.push('/dashboard/my-releases');
        return;
      }

      setFormData({
        fullName: profile.full_name || '',
        email: profile.email || user.email || '',
        phone: profile.phone || '',
        companyName: profile.company_name || '',
        companyWebsite: profile.company_website || '',
        industry: profile.industry || '',
        jobTitle: profile.job_title || '',
      });
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return;
    }
    if (!formData.companyName.trim()) {
      setError('Company name is required');
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName.trim(),
          phone: formData.phone.trim(),
          company_name: formData.companyName.trim(),
          company_website: formData.companyWebsite.trim() || null,
          industry: formData.industry || null,
          job_title: formData.jobTitle.trim() || null,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      router.push('/dashboard/my-releases');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save profile';
      setError(message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-start justify-center pt-12 pb-16">
      <div className="w-full max-w-xl">
        {/* Editorial header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display text-ink mb-3">
            Welcome to PRBuild
          </h1>
          <div className="w-16 h-px bg-ink/20 mx-auto mb-4" />
          <p className="text-ink/60 text-lg">
            Complete your profile to get started with your first press release.
          </p>
        </div>

        {/* Form card with paper/editorial styling */}
        <div className="bg-paper rounded-lg border border-ink/10 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-ink font-medium">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/30" />
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="pl-10 border-ink/15 bg-white focus:border-secondary"
                  placeholder="Jane Doe"
                  required
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-ink font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/30" />
                <Input
                  id="email"
                  value={formData.email}
                  className="pl-10 bg-ink/5 border-ink/10 text-ink/60"
                  disabled
                />
              </div>
              <p className="text-xs text-ink/40">Email cannot be changed</p>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-ink font-medium">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/30" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10 border-ink/15 bg-white focus:border-secondary"
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
            </div>

            <div className="w-full h-px bg-ink/10" />

            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-ink font-medium">
                Company Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/30" />
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="pl-10 border-ink/15 bg-white focus:border-secondary"
                  placeholder="Acme Corp"
                  required
                />
              </div>
            </div>

            {/* Company Website */}
            <div className="space-y-2">
              <Label htmlFor="companyWebsite" className="text-ink font-medium">
                Company Website
              </Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/30" />
                <Input
                  id="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                  className="pl-10 border-ink/15 bg-white focus:border-secondary"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-ink font-medium">
                Industry
              </Label>
              <select
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full h-10 rounded-md border border-ink/15 bg-white px-3 text-sm text-ink focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
              >
                <option value="">Select an industry...</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-ink font-medium">
                Job Title
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/30" />
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  className="pl-10 border-ink/15 bg-white focus:border-secondary"
                  placeholder="Head of Marketing"
                />
              </div>
            </div>

            <div className="w-full h-px bg-ink/10" />

            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-secondary hover:bg-secondary/90 text-white h-12 text-base"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Complete Profile & Get Started'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
