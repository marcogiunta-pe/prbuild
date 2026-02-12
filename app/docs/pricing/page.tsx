import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing & Plans',
  description: 'PRBuild pricing explained: Starter ($9/mo), Growth ($19/mo), Pro ($39/mo). Your first release is always free. No credit card required.',
  alternates: { canonical: 'https://prbuild.ai/docs/pricing' },
};

const plans = [
  {
    name: 'Starter',
    price: '$9/mo',
    yearlyPrice: '$90/yr',
    yearlyNote: 'Save $18 (2 months free)',
    releases: '1 press release',
    bestFor: 'Occasional announcements',
    features: [
      'Professional AI writing',
      'Journalist panel review (16 personas)',
      'Client revision round',
      'Showcase publication',
      'Newsletter distribution',
    ],
  },
  {
    name: 'Growth',
    price: '$19/mo',
    yearlyPrice: '$190/yr',
    yearlyNote: 'Save $38 (2 months free)',
    releases: '3 press releases',
    bestFor: 'Growing companies',
    popular: true,
    features: [
      'Everything in Starter',
      'Priority turnaround',
      'Detailed analytics',
    ],
  },
  {
    name: 'Pro',
    price: '$39/mo',
    yearlyPrice: '$390/yr',
    yearlyNote: 'Save $78 (2 months free)',
    releases: '5 press releases',
    bestFor: 'Regular PR needs',
    features: [
      'Everything in Growth',
      'Rush delivery available',
      'Dedicated account support',
    ],
  },
];

const faqs = [
  {
    q: 'Is my first release really free?',
    a: 'Yes. Every new account gets one free press release — no credit card required. It goes through the same process as paid releases.',
  },
  {
    q: 'What happens when I use all my releases?',
    a: 'You can purchase additional releases at the per-release price for your plan, or upgrade to a higher tier for more included releases.',
  },
  {
    q: 'Can I switch plans?',
    a: 'Yes. You can upgrade or downgrade at any time. Changes take effect at your next billing cycle.',
  },
  {
    q: 'What\'s included in "revision round"?',
    a: 'After you review your draft, you can request specific changes. We\'ll incorporate your feedback and send an updated version. One revision round is included with every plan.',
  },
  {
    q: 'Do you offer annual billing?',
    a: 'Yes. Annual plans save you 2 months compared to monthly billing.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards through Stripe. Invoicing is available for Pro plan customers.',
  },
];

export default function PricingPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Pricing & Plans</h1>
      <p className="text-lg text-gray-600 mb-12 max-w-2xl">
        Simple, transparent pricing. Your first release is free. No credit card required to start.
      </p>

      {/* Plans */}
      <section className="mb-12">
        <div className="grid sm:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`border rounded-xl p-6 ${plan.popular ? 'border-secondary ring-1 ring-secondary' : ''}`}
            >
              {plan.popular && (
                <span className="text-xs font-semibold text-secondary bg-secondary/10 px-2 py-0.5 rounded mb-3 inline-block">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-2 mb-1">
                <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
              </div>
              <p className="text-xs text-gray-500 mb-1">
                or {plan.yearlyPrice} &mdash; {plan.yearlyNote}
              </p>
              <p className="text-sm text-gray-600 mb-4">{plan.releases} &bull; {plan.bestFor}</p>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* What every plan includes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Included With Every Plan</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            'AI-powered press release writing',
            'Journalist panel review (16 personas)',
            'Client revision round',
            'Showcase publication',
            'Journalist newsletter distribution',
            'Shareable release link',
            'View and share analytics',
            'Email notifications at every stage',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-secondary flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Common Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-1">{faq.q}</h3>
              <p className="text-sm text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Next step */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <span className="text-sm text-gray-600">Next:</span>
        <Link href="/docs/distribution" className="text-sm text-secondary font-medium hover:underline flex items-center gap-1">
          Distribution & reach <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
