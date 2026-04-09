'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronDown } from 'lucide-react';
import { PRICING, BillingInterval } from '@/types';
import { FAQ_ITEMS } from '@/data/faq';
import { AnimateOnScroll } from '@/components/landing/AnimateOnScroll';

const FEATURE_COMPARISON = [
  { feature: 'Press releases included', starter: '1', growth: '3', pro: '5' },
  { feature: 'Writing quality', starter: 'Professional', growth: 'Professional', pro: 'Professional' },
  { feature: 'Turnaround time', starter: '24-48 hrs', growth: '24-48 hrs', pro: '24-48 hrs' },
  { feature: 'Revision rounds', starter: '1', growth: 'Unlimited', pro: 'Unlimited' },
  { feature: 'Analytics depth', starter: 'Basic', growth: 'Detailed', pro: 'Detailed' },
  { feature: 'Distribution reach', starter: 'Newsletter', growth: 'Newsletter', pro: 'Newsletter' },
  { feature: 'Dedicated support', starter: '—', growth: '—', pro: 'Yes' },
  { feature: 'Rush delivery', starter: '—', growth: '—', pro: 'Yes' },
];

export function PricingSection() {
  const [interval, setInterval] = useState<BillingInterval>('monthly');
  const [faqOpen, setFaqOpen] = useState<Set<number>>(new Set());
  const [comparisonOpen, setComparisonOpen] = useState(false);

  const toggleFaq = (i: number) => {
    setFaqOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };
  const expandAll = () => setFaqOpen(new Set(FAQ_ITEMS.map((_, i) => i)));
  const collapseAll = () => setFaqOpen(new Set());

  return (
    <section id="pricing" className="py-24 bg-surface-container-low">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-4">
            Select Your <span className="italic text-primary-container">Authority</span> Level
          </h2>
          <p className="font-editorial text-lg text-on-surface-variant mb-10">
            Same pickup rate as $400 wires. For the price of a coffee. Cancel anytime.
          </p>

          {/* Billing Toggle — pill shaped per DESIGN.md */}
          <div className="inline-flex items-center gap-1 bg-surface-container p-1 rounded-full">
            <button
              onClick={() => setInterval('monthly')}
              className={`px-6 py-2 rounded-full font-label text-xs uppercase tracking-widest transition-all min-h-[40px] touch-manipulation ${
                interval === 'monthly'
                  ? 'bg-gradient-to-r from-primary to-primary-container text-on-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setInterval('yearly')}
              className={`relative px-6 py-2 rounded-full font-label text-xs uppercase tracking-widest transition-all min-h-[40px] touch-manipulation ${
                interval === 'yearly'
                  ? 'bg-gradient-to-r from-primary to-primary-container text-on-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-tertiary text-on-tertiary text-[10px] font-label px-2 py-0.5 rounded-full tracking-wider">
                -17%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {Object.entries(PRICING).map(([key, plan], i) => {
            const isPopular = 'popular' in plan && plan.popular;
            const pricing = plan[interval];
            const yearlyPricing = plan.yearly;

            return (
              <AnimateOnScroll key={key} delay={i * 80} variant="scale">
              <Card
                key={key}
                className={`relative border-0 rounded-xl ${
                  isPopular
                    ? 'bg-surface-container-lowest md:scale-105'
                    : 'bg-surface-container-lowest/70'
                }`}
                style={isPopular ? { boxShadow: '0 20px 40px rgba(26, 28, 25, 0.06)' } : undefined}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-4 py-1 rounded-full font-label text-xs uppercase tracking-widest font-bold">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="pt-10">
                  <CardTitle className="font-headline text-on-surface">{plan.name}</CardTitle>
                  <CardDescription className="font-editorial text-on-surface-variant">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-6">
                    <span className="font-headline text-5xl font-extrabold text-on-surface">${pricing.price}</span>
                    <span className="font-label text-on-surface-variant text-sm uppercase tracking-wider ml-1">
                      /{interval === 'monthly' ? 'mo' : 'yr'}
                    </span>
                    {interval === 'yearly' && 'savings' in yearlyPricing && (
                      <div className="font-label text-xs uppercase tracking-widest text-tertiary mt-2">
                        Save ${yearlyPricing.savings}/year
                      </div>
                    )}
                    {interval === 'monthly' && (
                      <div className="font-editorial text-sm text-on-surface-variant mt-2">
                        or ${plan.yearly.price}/year{' '}
                        <span className="inline-flex items-center font-label text-[10px] uppercase tracking-wider text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full ml-1">
                          Save ${('savings' in yearlyPricing ? yearlyPricing.savings : 0)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start font-editorial text-on-surface">
                        <Check className="h-5 w-5 text-primary-container mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/signup" className="w-full" data-cta={`pricing-${key}`}>
                    <Button
                      className="w-full"
                      variant={isPopular ? 'editorial' : 'editorial-secondary'}
                      size="lg"
                    >
                      Get Your Free Release
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              </AnimateOnScroll>
            );
          })}
        </div>

        <div className="mt-8 text-center text-ink-muted">
          <p>
            PRWeb charges $120-$480 per release. PR Newswire charges $1,070+.
            We charge $9. Do the math.
          </p>
          <button
            onClick={() => setComparisonOpen(!comparisonOpen)}
            className="mt-4 text-sm font-medium text-primary hover:underline"
          >
            {comparisonOpen ? 'Hide' : 'Compare all features'}
          </button>
        </div>

        {comparisonOpen && (
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse rounded-md overflow-hidden border border-rule">
              <thead>
                <tr className="bg-paper-dark">
                  <th className="text-left px-4 py-3 font-semibold text-ink">Feature</th>
                  <th className="text-center px-4 py-3 font-semibold text-ink">Starter</th>
                  <th className="text-center px-4 py-3 font-semibold text-primary bg-primary/5">Growth</th>
                  <th className="text-center px-4 py-3 font-semibold text-ink">Pro</th>
                </tr>
              </thead>
              <tbody>
                {FEATURE_COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-paper-light' : 'bg-paper'}>
                    <td className="px-4 py-3 text-ink">{row.feature}</td>
                    <td className="px-4 py-3 text-center text-ink-muted">{row.starter}</td>
                    <td className="px-4 py-3 text-center bg-primary/5 font-medium text-ink">{row.growth}</td>
                    <td className="px-4 py-3 text-center text-ink-muted">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h3 className="text-2xl font-display text-ink text-center sm:text-left">
              Frequently Asked Questions
            </h3>
            <div className="flex justify-center gap-2">
              <button onClick={expandAll} className="text-sm text-primary hover:underline min-h-[44px] px-3 py-2 touch-manipulation">Expand all</button>
              <span className="text-ink-muted">|</span>
              <button onClick={collapseAll} className="text-sm text-primary hover:underline min-h-[44px] px-3 py-2 touch-manipulation">Collapse all</button>
            </div>
          </div>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <FAQItem key={index} question={item.question} answer={item.answer} isOpen={faqOpen.has(index)} onToggle={() => toggleFaq(index)} />
            ))}
          </div>

          {/* FAQ CTA */}
          <div className="mt-12 p-6 rounded-md bg-paper-dark border border-rule text-center">
            <p className="text-lg text-ink mb-2">Still have questions?</p>
            <p className="text-ink-muted mb-4">
              We&apos;ll answer them on your first call — plus write your first release free.
            </p>
            <Link href="/signup" data-cta="faq-cta">
              <Button className="bg-primary hover:bg-primary-700 rounded-sm">Get Your Free Release</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-rule rounded-md bg-paper-light overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left flex items-center justify-between gap-4"
      >
        <span className="font-medium text-ink">{question}</span>
        <ChevronDown className={`h-5 w-5 text-ink-muted transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-6 pb-4">
            <p className="text-ink-muted transition-opacity duration-200">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
