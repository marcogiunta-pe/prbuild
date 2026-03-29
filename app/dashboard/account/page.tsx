'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertCircle,
  Check,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { INDUSTRIES } from '@/types';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  mediaContactName: string;
  mediaContactTitle: string;
  mediaContactEmail: string;
  mediaContactPhone: string;
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyZip: string;
  companyCountry: string;
  companyPhone: string;
  companyWebsite: string;
  companyLogoUrl: string;
  industry: string;
  customIndustry: string;
  companyBoilerplate: string;
  companyVoiceStyle: string;
}

const INITIAL_DATA: ProfileData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  jobTitle: '',
  mediaContactName: '',
  mediaContactTitle: '',
  mediaContactEmail: '',
  mediaContactPhone: '',
  companyName: '',
  companyAddress: '',
  companyCity: '',
  companyState: '',
  companyZip: '',
  companyCountry: '',
  companyPhone: '',
  companyWebsite: '',
  companyLogoUrl: '',
  industry: '',
  customIndustry: '',
  companyBoilerplate: '',
  companyVoiceStyle: '',
};

export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProfileData>(INITIAL_DATA);
  const [generatingBoilerplate, setGeneratingBoilerplate] = useState(false);
  const [autoFilling, setAutoFilling] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        // Split full_name into first/last if dedicated fields are empty
        let firstName = profile.first_name || '';
        let lastName = profile.last_name || '';
        if (!firstName && !lastName && profile.full_name) {
          const parts = profile.full_name.trim().split(/\s+/);
          firstName = parts[0] || '';
          lastName = parts.slice(1).join(' ') || '';
        }

        // Check if the industry value is in the standard list
        const isStandardIndustry = INDUSTRIES.some(i => i.value === profile.industry);
        const industryValue = profile.industry
          ? isStandardIndustry ? profile.industry : 'other'
          : '';
        const customIndustryValue = profile.industry && !isStandardIndustry
          ? profile.industry
          : '';

        setFormData({
          firstName,
          lastName,
          email: profile.email || user.email || '',
          phone: profile.phone || '',
          jobTitle: profile.job_title || '',
          mediaContactName: profile.media_contact_name || '',
          mediaContactTitle: profile.media_contact_title || '',
          mediaContactEmail: profile.media_contact_email || '',
          mediaContactPhone: profile.media_contact_phone || '',
          companyName: profile.company_name || '',
          companyAddress: profile.company_address || '',
          companyCity: profile.company_city || '',
          companyState: profile.company_state || '',
          companyZip: profile.company_zip || '',
          companyCountry: profile.company_country || '',
          companyPhone: profile.company_phone || '',
          companyWebsite: profile.company_website || '',
          companyLogoUrl: profile.company_logo_url || '',
          industry: industryValue,
          customIndustry: customIndustryValue,
          companyBoilerplate: profile.company_boilerplate || '',
          companyVoiceStyle: profile.company_voice_style || '',
        });
      } else {
        setFormData(prev => ({
          ...prev,
          email: user.email || '',
        }));
      }
    }
    setLoading(false);
  };

  const updateField = (field: keyof ProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAutoFill = async () => {
    if (!formData.companyWebsite) return;

    // Warn user that existing data will be overwritten
    const hasData = formData.companyName || formData.companyAddress || formData.companyCity ||
      formData.companyPhone || formData.companyBoilerplate || formData.companyVoiceStyle || formData.industry;

    if (hasData && !confirm('This will replace all company information with data from the website. You can edit any field after. Continue?')) {
      return;
    }

    setAutoFilling(true);
    setError(null);

    try {
      const websiteUrl = formData.companyWebsite.startsWith('http')
        ? formData.companyWebsite
        : `https://${formData.companyWebsite}`;

      const res = await fetch('/api/ai/company-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteUrl }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to analyze website');
      }

      const data = await res.json();

      setFormData(prev => {
        const next = { ...prev };

        // Override all fields with data from the website
        if (data.companyName) next.companyName = data.companyName;
        if (data.phone) next.companyPhone = data.phone;
        if (data.address) next.companyAddress = data.address;
        if (data.city) next.companyCity = data.city;
        if (data.state) next.companyState = data.state;
        if (data.zip) next.companyZip = data.zip;
        if (data.country) next.companyCountry = data.country;
        if (data.logoUrl) next.companyLogoUrl = data.logoUrl;
        if (data.boilerplate) next.companyBoilerplate = data.boilerplate;
        if (data.voiceStyle) next.companyVoiceStyle = data.voiceStyle;

        // Handle industry mapping
        if (data.industry) {
          const isStandard = INDUSTRIES.some(i => i.value === data.industry?.toLowerCase());
          if (isStandard) {
            next.industry = data.industry.toLowerCase();
            next.customIndustry = '';
          } else {
            next.industry = 'other';
            next.customIndustry = data.industry;
          }
        }

        return next;
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to analyze website';
      setError(message);
    } finally {
      setAutoFilling(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const industryValue = formData.industry === 'other'
        ? formData.customIndustry
        : formData.industry;

      const fullName = [formData.firstName, formData.lastName].filter(Boolean).join(' ');

      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          job_title: formData.jobTitle,
          media_contact_name: formData.mediaContactName,
          media_contact_title: formData.mediaContactTitle,
          media_contact_email: formData.mediaContactEmail,
          media_contact_phone: formData.mediaContactPhone,
          company_name: formData.companyName,
          company_address: formData.companyAddress,
          company_city: formData.companyCity,
          company_state: formData.companyState,
          company_zip: formData.companyZip,
          company_country: formData.companyCountry,
          company_phone: formData.companyPhone,
          company_website: formData.companyWebsite,
          company_logo_url: formData.companyLogoUrl,
          industry: industryValue,
          company_boilerplate: formData.companyBoilerplate,
          company_voice_style: formData.companyVoiceStyle,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save changes');

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save changes';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateBoilerplate = async () => {
    if (!formData.companyWebsite) return;
    setGeneratingBoilerplate(true);
    try {
      const res = await fetch('/api/ai/generate-boilerplate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: formData.companyName,
          companyWebsite: formData.companyWebsite.startsWith('http')
            ? formData.companyWebsite
            : `https://${formData.companyWebsite}`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.boilerplate) updateField('companyBoilerplate', data.boilerplate);
      }
    } catch {
      /* ignore */
    }
    setGeneratingBoilerplate(false);
  };

  const handlePasswordReset = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/account`,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError('Failed to send password reset email');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-ink-muted" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink">Account Settings</h1>
        <p className="text-ink-muted mt-1 font-body text-sm">
          Manage your profile, company details, and default press release settings.
        </p>
      </div>

      {/* Global messages */}
      {error && (
        <div className="flex items-center gap-2 p-3 mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 mb-6 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md">
          <Check className="h-4 w-4 flex-shrink-0" />
          Changes saved successfully!
        </div>
      )}

      <div className="space-y-6">
        {/* Section 1: Personal Information */}
        <Card className="border-rule bg-paper-light">
          <CardHeader className="border-b border-rule pb-4">
            <CardTitle className="font-display text-xl text-ink">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-sm font-medium text-ink">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  placeholder="First name"
                  className="border-rule"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-sm font-medium text-ink">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  placeholder="Last name"
                  className="border-rule"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-ink">
                Email
              </Label>
              <Input
                id="email"
                value={formData.email}
                className="border-rule bg-paper-dark/30"
                disabled
              />
              <p className="text-xs text-ink-muted">Email cannot be changed.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm font-medium text-ink">
                Phone Number
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="border-rule"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="jobTitle" className="text-sm font-medium text-ink">
                Job Title
              </Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => updateField('jobTitle', e.target.value)}
                placeholder="e.g. CEO, Marketing Director"
                className="border-rule"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Default Media Contact */}
        <Card className="border-rule bg-paper-light">
          <CardHeader className="border-b border-rule pb-4">
            <CardTitle className="font-display text-xl text-ink">Default Media Contact</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-ink-muted -mt-1 mb-2">
              This information will be used as the default media contact on your press releases.
              You can override it when creating a release.
            </p>

            <div className="space-y-1.5">
              <Label htmlFor="mediaContactName" className="text-sm font-medium text-ink">
                Contact Name
              </Label>
              <Input
                id="mediaContactName"
                value={formData.mediaContactName}
                onChange={(e) => updateField('mediaContactName', e.target.value)}
                placeholder="Full name"
                className="border-rule"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mediaContactTitle" className="text-sm font-medium text-ink">
                Contact Title
              </Label>
              <Input
                id="mediaContactTitle"
                value={formData.mediaContactTitle}
                onChange={(e) => updateField('mediaContactTitle', e.target.value)}
                placeholder="e.g. PR Manager, Communications Director"
                className="border-rule"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mediaContactEmail" className="text-sm font-medium text-ink">
                Contact Email
              </Label>
              <Input
                id="mediaContactEmail"
                type="email"
                value={formData.mediaContactEmail}
                onChange={(e) => updateField('mediaContactEmail', e.target.value)}
                placeholder="press@company.com"
                className="border-rule"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mediaContactPhone" className="text-sm font-medium text-ink">
                Contact Phone
              </Label>
              <Input
                id="mediaContactPhone"
                value={formData.mediaContactPhone}
                onChange={(e) => updateField('mediaContactPhone', e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="border-rule"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Company Information */}
        <Card className="border-rule bg-paper-light">
          <CardHeader className="border-b border-rule pb-4">
            <CardTitle className="font-display text-xl text-ink">Company Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {/* Company Website — first field */}
            <div className="space-y-1.5">
              <Label htmlFor="companyWebsite" className="font-mono text-xs font-medium text-ink uppercase tracking-wide">
                Company Website
              </Label>
              <Input
                id="companyWebsite"
                value={formData.companyWebsite}
                onChange={(e) => updateField('companyWebsite', e.target.value)}
                placeholder="https://example.com"
                className="border-rule"
              />
            </div>

            {/* Auto-fill button */}
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={handleAutoFill}
                disabled={autoFilling || !formData.companyWebsite}
                className="rounded-sm border-rule text-ink hover:bg-paper-dark/30 text-sm"
              >
                {autoFilling ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing website...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Auto-fill from website
                  </>
                )}
              </Button>
            </div>

            {/* Company Name */}
            <div className="space-y-1.5">
              <Label htmlFor="companyName" className="font-mono text-xs font-medium text-ink uppercase tracking-wide">
                Company Name <span className="text-primary">*</span>
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                placeholder="Your company name"
                className="border-rule"
              />
            </div>

            {/* Company Address (street) */}
            <div className="space-y-1.5">
              <Label htmlFor="companyAddress" className="font-mono text-xs font-medium text-ink uppercase tracking-wide">
                Company Address
              </Label>
              <Input
                id="companyAddress"
                value={formData.companyAddress}
                onChange={(e) => updateField('companyAddress', e.target.value)}
                placeholder="123 Main St"
                className="border-rule"
              />
            </div>

            {/* City, State, ZIP — 3 columns */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="companyCity" className="font-mono text-xs font-medium text-ink uppercase tracking-wide">
                  City
                </Label>
                <Input
                  id="companyCity"
                  value={formData.companyCity}
                  onChange={(e) => updateField('companyCity', e.target.value)}
                  placeholder="City"
                  className="border-rule"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="companyState" className="font-mono text-xs font-medium text-ink uppercase tracking-wide">
                  State
                </Label>
                <Input
                  id="companyState"
                  value={formData.companyState}
                  onChange={(e) => updateField('companyState', e.target.value)}
                  placeholder="CA"
                  className="border-rule"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="companyZip" className="font-mono text-xs font-medium text-ink uppercase tracking-wide">
                  ZIP
                </Label>
                <Input
                  id="companyZip"
                  value={formData.companyZip}
                  onChange={(e) => updateField('companyZip', e.target.value)}
                  placeholder="90210"
                  className="border-rule"
                />
              </div>
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <Label htmlFor="companyCountry" className="font-mono text-xs font-medium text-ink uppercase tracking-wide">
                Country
              </Label>
              <Input
                id="companyCountry"
                value={formData.companyCountry}
                onChange={(e) => updateField('companyCountry', e.target.value)}
                placeholder="United States"
                className="border-rule"
              />
            </div>

            {/* Company Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="companyPhone" className="font-mono text-xs font-medium text-ink uppercase tracking-wide">
                Company Phone
              </Label>
              <Input
                id="companyPhone"
                value={formData.companyPhone}
                onChange={(e) => updateField('companyPhone', e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="border-rule"
              />
            </div>

            {/* Company Logo URL */}
            <div className="space-y-1.5">
              <Label htmlFor="companyLogoUrl" className="font-mono text-xs font-medium text-ink uppercase tracking-wide">
                Company Logo URL
              </Label>
              <Input
                id="companyLogoUrl"
                value={formData.companyLogoUrl}
                onChange={(e) => updateField('companyLogoUrl', e.target.value)}
                placeholder="https://example.com/logo.png"
                className="border-rule"
              />
              <p className="text-xs text-ink-muted">
                Direct link to your company logo image.
              </p>
            </div>

            {/* Industry */}
            <div className="space-y-1.5">
              <Label htmlFor="industry" className="font-mono text-xs font-medium text-ink uppercase tracking-wide">
                Industry
              </Label>
              <select
                id="industry"
                value={formData.industry}
                onChange={(e) => {
                  updateField('industry', e.target.value);
                  if (e.target.value !== 'other') {
                    updateField('customIndustry', '');
                  }
                }}
                className="w-full px-3 py-2 border border-rule rounded-sm bg-paper-light text-ink text-sm"
              >
                <option value="">Select industry...</option>
                {INDUSTRIES.map(ind => (
                  <option key={ind.value} value={ind.value}>{ind.label}</option>
                ))}
                <option value="other">Other (specify)</option>
              </select>
              {formData.industry === 'other' && (
                <Input
                  value={formData.customIndustry}
                  onChange={(e) => updateField('customIndustry', e.target.value)}
                  placeholder="Enter your industry"
                  className="mt-2 border-rule"
                />
              )}
            </div>

            {/* Company Boilerplate */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="companyBoilerplate" className="font-mono text-xs font-medium text-ink uppercase tracking-wide">
                  Company Boilerplate
                </Label>
                {formData.companyWebsite && (
                  <button
                    type="button"
                    onClick={handleGenerateBoilerplate}
                    disabled={generatingBoilerplate}
                    className="text-xs text-primary hover:text-primary-700 font-medium flex items-center gap-1 rounded-sm"
                  >
                    {generatingBoilerplate ? (
                      <><Loader2 className="h-3 w-3 animate-spin" /> Generating from website...</>
                    ) : (
                      <><Sparkles className="h-3 w-3" /> Generate from website</>
                    )}
                  </button>
                )}
              </div>
              <p className="text-xs text-ink-muted mb-1">
                The &ldquo;About&rdquo; paragraph that goes at the bottom of your press releases.
              </p>
              <Textarea
                id="companyBoilerplate"
                value={formData.companyBoilerplate}
                onChange={(e) => updateField('companyBoilerplate', e.target.value)}
                placeholder="A brief description of your company (50-75 words)..."
                rows={4}
                className="border-rule"
              />
            </div>

            {/* Voice Style */}
            <div className="space-y-1.5">
              <Label htmlFor="companyVoiceStyle" className="font-mono text-xs font-medium text-ink uppercase tracking-wide">
                Voice Style
              </Label>
              <p className="text-xs text-ink-muted mb-1">
                Describe your company&apos;s communication style. E.g., &ldquo;Professional and
                authoritative&rdquo; or &ldquo;Casual and innovative.&rdquo; This helps us match
                the tone of your press releases.
              </p>
              <Textarea
                id="companyVoiceStyle"
                value={formData.companyVoiceStyle}
                onChange={(e) => updateField('companyVoiceStyle', e.target.value)}
                placeholder="Professional and authoritative..."
                rows={3}
                className="border-rule"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Password */}
        <Card className="border-rule bg-paper-light">
          <CardHeader className="border-b border-rule pb-4">
            <CardTitle className="font-display text-xl text-ink">Password</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-ink-muted mb-4">
              To change your password, we&apos;ll send a reset link to your email address.
            </p>
            <Button
              variant="outline"
              onClick={handlePasswordReset}
              className="border-rule text-ink hover:bg-paper-dark/30 rounded-sm"
            >
              Request Password Reset
            </Button>
          </CardContent>
        </Card>

        {/* Save button */}
        <div className="pt-2 pb-8">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary-700 text-white px-8 py-2.5 rounded-sm"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save All Changes'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
