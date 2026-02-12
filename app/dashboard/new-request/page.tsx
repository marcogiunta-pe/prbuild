'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  Loader2, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  PlusCircle,
  Trash2
} from 'lucide-react';
import { PRICING, ANNOUNCEMENT_TYPES, INDUSTRIES, Plan, AnnouncementType, Industry, QuoteSource, BillingInterval } from '@/types';

type Step = 'plan' | 'company' | 'announcement' | 'quotes' | 'contact' | 'review';

export default function NewRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>('plan');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');
  const [isFreeUser, setIsFreeUser] = useState(false);
  const [freeReleasesRemaining, setFreeReleasesRemaining] = useState(0);
  const [isFreeRelease, setIsFreeRelease] = useState(false);

  const [formData, setFormData] = useState({
    plan: '' as Plan | '',
    companyName: '',
    companyWebsite: '',
    announcementType: '' as AnnouncementType | '',
    newsHook: '',
    datelineCity: '',
    releaseDate: '',
    coreFacts: ['', '', ''],
    quoteSources: [{ name: '', title: '', quote: '' }] as QuoteSource[],
    boilerplate: '',
    companyFacts: '',
    mediaContactName: '',
    mediaContactTitle: '',
    mediaContactEmail: '',
    mediaContactPhone: '',
    visualsDescription: '',
    desiredCta: '',
    industry: '' as Industry | '',
    supportingContext: '',
  });

  useEffect(() => {
    // Check if returning from Stripe checkout
    const sessionId = searchParams.get('session_id');
    const plan = searchParams.get('plan');
    
    if (sessionId && plan) {
      setFormData(prev => ({ ...prev, plan: plan as Plan }));
      setStep('company');
    }

    // Get current user + profile (use /api/me so free user status is accurate)
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const res = await fetch('/api/me');
      if (res.ok) {
        const profile = await res.json();
        setFormData(prev => ({
          ...prev,
          companyName: profile.company_name || '',
          companyWebsite: profile.company_website || '',
          mediaContactName: profile.full_name || '',
          mediaContactEmail: profile.email || '',
        }));
        const free = !!profile.is_free_user;
        const remaining = profile.free_releases_remaining ?? 0;
        setIsFreeUser(free);
        setFreeReleasesRemaining(remaining);
        // Free users skip the plan step entirely — go straight to the form
        if (free && (remaining > 0 || remaining === -1) && !searchParams.get('session_id')) {
          setFormData(prev => ({ ...prev, plan: 'starter' }));
          setIsFreeRelease(true);
          setStep('company');
        }
      }
    };
    getUser();
  }, [searchParams]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUseFreeRelease = () => {
    setFormData(prev => ({ ...prev, plan: 'starter' }));
    setIsFreeRelease(true);
    setStep('company');
  };

  const handleSelectPlan = async (plan: Plan) => {
    if (!userId) {
      router.push('/login?redirect=/dashboard/new-request');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, interval: billingInterval }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to create checkout session');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to process payment. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const amountPaid = isFreeRelease ? 0 : PRICING[formData.plan as Plan][billingInterval].priceInCents;
      const stripePaymentId = isFreeRelease ? null : undefined;

      const { data, error: insertError } = await supabase
        .from('release_requests')
        .insert({
          client_id: userId,
          company_name: formData.companyName,
          company_website: formData.companyWebsite,
          announcement_type: formData.announcementType,
          news_hook: formData.newsHook,
          dateline_city: formData.datelineCity,
          release_date: formData.releaseDate,
          core_facts: formData.coreFacts.filter(f => f.trim()),
          quote_sources: formData.quoteSources.filter(q => q.name.trim()),
          boilerplate: formData.boilerplate || null,
          company_facts: formData.companyFacts || null,
          media_contact_name: formData.mediaContactName,
          media_contact_title: formData.mediaContactTitle || null,
          media_contact_email: formData.mediaContactEmail,
          media_contact_phone: formData.mediaContactPhone || null,
          visuals_description: formData.visualsDescription || null,
          desired_cta: formData.desiredCta,
          industry: formData.industry || null,
          supporting_context: formData.supportingContext || null,
          plan: formData.plan,
          amount_paid: amountPaid,
          stripe_payment_id: stripePaymentId,
          status: 'submitted',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      if (isFreeRelease && freeReleasesRemaining !== -1) {
        await supabase
          .from('profiles')
          .update({ free_releases_remaining: Math.max(0, freeReleasesRemaining - 1) })
          .eq('id', userId);
      }

      router.push(`/dashboard/my-releases/${data.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit request');
      setLoading(false);
    }
  };

  const steps: Step[] = ['plan', 'company', 'announcement', 'quotes', 'contact', 'review'];
  const currentStepIndex = steps.indexOf(step);

  const canProceed = () => {
    switch (step) {
      case 'plan':
        return !!formData.plan;
      case 'company':
        return formData.companyName && formData.companyWebsite;
      case 'announcement':
        return formData.announcementType && formData.newsHook && formData.datelineCity && 
               formData.releaseDate && formData.coreFacts.some(f => f.trim());
      case 'quotes':
        return true; // Optional
      case 'contact':
        return formData.mediaContactName && formData.mediaContactEmail && formData.desiredCta;
      default:
        return true;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Press Release Request</h1>
        <p className="text-gray-600 mt-1">Tell us about your announcement and we'll create a professional press release.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${i < currentStepIndex ? 'bg-secondary text-white' : 
                i === currentStepIndex ? 'bg-secondary text-white' : 
                'bg-gray-200 text-gray-600'}
            `}>
              {i < currentStepIndex ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-2 ${i < currentStepIndex ? 'bg-secondary' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step: Select Plan */}
      {step === 'plan' && (
        <div>
          {/* Free user option - skip payment */}
          {isFreeUser && (freeReleasesRemaining > 0 || freeReleasesRemaining === -1) && (
            <Card className="mb-6 border-green-300 bg-green-50/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-green-800">Use your free release</h3>
                    <p className="text-sm text-green-700 mt-1">
                      You have {freeReleasesRemaining === -1 ? 'unlimited' : freeReleasesRemaining} free release{freeReleasesRemaining === 1 ? '' : 's'} remaining.
                    </p>
                  </div>
                  <Button
                    onClick={handleUseFreeRelease}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Create free release
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <p className="text-sm text-gray-600 mb-4">Or choose a plan:</p>
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                billingInterval === 'monthly'
                  ? 'bg-secondary text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('yearly')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
                billingInterval === 'yearly'
                  ? 'bg-secondary text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                Save 17%
              </span>
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(PRICING).map(([key, plan]) => {
              const isPopular = 'popular' in plan && plan.popular;
              const pricing = plan[billingInterval];
              return (
                <Card 
                  key={key}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isPopular ? 'border-secondary border-2' : ''
                  } ${formData.plan === key ? 'ring-2 ring-secondary' : ''}`}
                  onClick={() => handleSelectPlan(key as Plan)}
                >
                  {isPopular && (
                    <div className="bg-secondary text-white text-xs font-medium text-center py-1">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">${pricing.price}</span>
                      <span className="text-gray-500">/{billingInterval === 'monthly' ? 'mo' : 'yr'}</span>
                      {billingInterval === 'yearly' && 'savings' in plan.yearly && (
                        <div className="text-sm text-green-600 font-medium">
                          Save ${plan.yearly.savings}/year
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full mt-4 ${isPopular ? 'bg-secondary hover:bg-secondary/90' : ''}`}
                      variant={isPopular ? 'default' : 'outline'}
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Select Plan'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Step: Company Info */}
      {step === 'company' && (
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Tell us about your company</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="companyName">Company Name *</Label>
              <p className="text-xs text-gray-500 mb-1">Your official company name as it should appear in the release.</p>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                placeholder="Acme Inc."
              />
            </div>
            <div>
              <Label htmlFor="companyWebsite">Company Website *</Label>
              <p className="text-xs text-gray-500 mb-1">We'll link to this in the release and use it for background research.</p>
              <Input
                id="companyWebsite"
                value={formData.companyWebsite}
                onChange={(e) => updateField('companyWebsite', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry *</Label>
              <p className="text-xs text-gray-500 mb-1">Used to match your release with journalists who cover your space.</p>
              <select
                id="industry"
                value={formData.industry}
                onChange={(e) => updateField('industry', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select industry...</option>
                {INDUSTRIES.map(ind => (
                  <option key={ind.value} value={ind.value}>{ind.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="boilerplate">Company Boilerplate (optional)</Label>
              <p className="text-xs text-gray-500 mb-1">The "About" paragraph that goes at the bottom. If you have one on your website, paste it here. We'll write one if you skip this.</p>
              <Textarea
                id="boilerplate"
                value={formData.boilerplate}
                onChange={(e) => updateField('boilerplate', e.target.value)}
                placeholder="A brief description of your company (50-75 words)..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Announcement Details */}
      {step === 'announcement' && (
        <Card>
          <CardHeader>
            <CardTitle>Announcement Details</CardTitle>
            <CardDescription>What are you announcing?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="announcementType">Announcement Type *</Label>
              <p className="text-xs text-gray-500 mb-1">Pick the closest match — this helps our writers choose the right tone and structure.</p>
              <select
                id="announcementType"
                value={formData.announcementType}
                onChange={(e) => updateField('announcementType', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select type...</option>
                {ANNOUNCEMENT_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="newsHook">News Hook *</Label>
              <p className="text-xs text-gray-500 mb-1">One sentence: what happened and why anyone should care. Think &ldquo;X launches Y to solve Z&rdquo; — not &ldquo;We are excited to announce.&rdquo;</p>
              <Textarea
                id="newsHook"
                value={formData.newsHook}
                onChange={(e) => updateField('newsHook', e.target.value)}
                placeholder="One sentence explaining why this is newsworthy..."
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="datelineCity">Dateline City *</Label>
                <p className="text-xs text-gray-500 mb-1">Your company&apos;s HQ city (appears at the top of the release, e.g. &ldquo;NEW YORK&rdquo;).</p>
                <Input
                  id="datelineCity"
                  value={formData.datelineCity}
                  onChange={(e) => updateField('datelineCity', e.target.value)}
                  placeholder="NEW YORK"
                />
              </div>
              <div>
                <Label htmlFor="releaseDate">Target Release Date *</Label>
                <p className="text-xs text-gray-500 mb-1">When you want this published. We need at least 48 hours lead time.</p>
                <Input
                  id="releaseDate"
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => updateField('releaseDate', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Core Facts (ranked by importance) *</Label>
              <p className="text-xs text-gray-500 mb-2">The key facts a journalist needs to write the story. Put the most important one first. Include specific numbers where possible.</p>
              {formData.coreFacts.map((fact, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <span className="text-sm text-gray-400 pt-2">{i + 1}.</span>
                  <Input
                    value={fact}
                    onChange={(e) => {
                      const newFacts = [...formData.coreFacts];
                      newFacts[i] = e.target.value;
                      updateField('coreFacts', newFacts);
                    }}
                    placeholder={`Fact ${i + 1}`}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateField('coreFacts', [...formData.coreFacts, ''])}
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Add Fact
              </Button>
            </div>
            <div>
              <Label htmlFor="supportingContext">Supporting Context (optional)</Label>
              <p className="text-xs text-gray-500 mb-2">
                Paste any articles, blog posts, or content that provides context for your announcement. 
                The AI will use this to better understand your news and write a more informed press release.
              </p>
              <Textarea
                id="supportingContext"
                value={formData.supportingContext || ''}
                onChange={(e) => updateField('supportingContext', e.target.value)}
                placeholder="Paste relevant articles, blog posts, product descriptions, or any other content that provides context for your announcement..."
                rows={6}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Quotes */}
      {step === 'quotes' && (
        <Card>
          <CardHeader>
            <CardTitle>Quote Sources</CardTitle>
            <CardDescription>Add people who can be quoted in the release (optional but recommended — releases with quotes get 30% more pickups)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.quoteSources.map((source, i) => (
              <div key={i} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">Quote Source {i + 1}</span>
                  {formData.quoteSources.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newSources = formData.quoteSources.filter((_, idx) => idx !== i);
                        updateField('quoteSources', newSources);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={source.name}
                      onChange={(e) => {
                        const newSources = [...formData.quoteSources];
                        newSources[i] = { ...source, name: e.target.value };
                        updateField('quoteSources', newSources);
                      }}
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={source.title}
                      onChange={(e) => {
                        const newSources = [...formData.quoteSources];
                        newSources[i] = { ...source, title: e.target.value };
                        updateField('quoteSources', newSources);
                      }}
                      placeholder="CEO"
                    />
                  </div>
                </div>
                <div>
                  <Label>Quote (optional — we&apos;ll draft one if you skip this)</Label>
                  <p className="text-xs text-gray-500 mb-1">If you have a real quote, paste it. Otherwise leave blank and we&apos;ll write one for approval.</p>
                  <Textarea
                    value={source.quote || ''}
                    onChange={(e) => {
                      const newSources = [...formData.quoteSources];
                      newSources[i] = { ...source, quote: e.target.value };
                      updateField('quoteSources', newSources);
                    }}
                    placeholder="Enter the exact quote or leave blank for us to suggest one..."
                    rows={2}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => updateField('quoteSources', [...formData.quoteSources, { name: '', title: '', quote: '' }])}
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Add Quote Source
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step: Contact & CTA */}
      {step === 'contact' && (
        <Card>
          <CardHeader>
            <CardTitle>Media Contact & Call to Action</CardTitle>
            <CardDescription>Who should journalists contact, and what should readers do next?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-gray-500">This info appears at the bottom of every press release. Use a dedicated press email if you have one.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mediaContactName">Contact Name *</Label>
                <Input
                  id="mediaContactName"
                  value={formData.mediaContactName}
                  onChange={(e) => updateField('mediaContactName', e.target.value)}
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <Label htmlFor="mediaContactTitle">Title</Label>
                <Input
                  id="mediaContactTitle"
                  value={formData.mediaContactTitle}
                  onChange={(e) => updateField('mediaContactTitle', e.target.value)}
                  placeholder="PR Manager"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mediaContactEmail">Email *</Label>
                <Input
                  id="mediaContactEmail"
                  type="email"
                  value={formData.mediaContactEmail}
                  onChange={(e) => updateField('mediaContactEmail', e.target.value)}
                  placeholder="press@company.com"
                />
              </div>
              <div>
                <Label htmlFor="mediaContactPhone">Phone</Label>
                <Input
                  id="mediaContactPhone"
                  value={formData.mediaContactPhone}
                  onChange={(e) => updateField('mediaContactPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="desiredCta">Desired Call to Action *</Label>
              <p className="text-xs text-gray-500 mb-1">What should someone do after reading? Be specific — a URL, a signup page, or &ldquo;contact us for a demo.&rdquo;</p>
              <Textarea
                id="desiredCta"
                value={formData.desiredCta}
                onChange={(e) => updateField('desiredCta', e.target.value)}
                placeholder="What should readers do after reading? (e.g., 'Visit example.com to learn more')"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="visualsDescription">Available Visuals (optional)</Label>
              <p className="text-xs text-gray-500 mb-1">Logos, product screenshots, headshots, or videos you can share. Releases with visuals get more coverage.</p>
              <Textarea
                id="visualsDescription"
                value={formData.visualsDescription}
                onChange={(e) => updateField('visualsDescription', e.target.value)}
                placeholder="Describe any images, videos, or other media you can provide..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Review */}
      {step === 'review' && (
        <Card>
          <CardHeader>
            <CardTitle>Review Your Request</CardTitle>
            <CardDescription>Please review the details before submitting</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <dt className="text-gray-500">Plan</dt>
                <dd className="font-medium capitalize">{formData.plan}</dd>
              </div>
              <div className="flex justify-between py-2 border-b">
                <dt className="text-gray-500">Company</dt>
                <dd className="font-medium">{formData.companyName}</dd>
              </div>
              <div className="flex justify-between py-2 border-b">
                <dt className="text-gray-500">Announcement Type</dt>
                <dd className="font-medium capitalize">{formData.announcementType.replace('_', ' ')}</dd>
              </div>
              <div className="flex justify-between py-2 border-b">
                <dt className="text-gray-500">Target Date</dt>
                <dd className="font-medium">{formData.releaseDate}</dd>
              </div>
              <div className="py-2 border-b">
                <dt className="text-gray-500 mb-1">News Hook</dt>
                <dd className="font-medium">{formData.newsHook}</dd>
              </div>
              <div className="py-2 border-b">
                <dt className="text-gray-500 mb-1">Core Facts</dt>
                <dd>
                  <ul className="list-disc pl-4 space-y-1">
                    {formData.coreFacts.filter(f => f.trim()).map((fact, i) => (
                      <li key={i}>{fact}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div className="flex justify-between py-2 border-b">
                <dt className="text-gray-500">Media Contact</dt>
                <dd className="font-medium">{formData.mediaContactName} ({formData.mediaContactEmail})</dd>
              </div>
            </dl>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                By submitting this request, you agree to our terms of service. Your press release will be written, 
                reviewed by our journalist panel, and sent to you for approval before publication.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      {step !== 'plan' && (
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setStep(steps[currentStepIndex - 1])}
            disabled={loading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {step === 'review' ? (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-secondary hover:bg-secondary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Request
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => setStep(steps[currentStepIndex + 1])}
              disabled={!canProceed()}
              className="bg-secondary hover:bg-secondary/90"
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
