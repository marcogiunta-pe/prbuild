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
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            PRWeb: $400. Us: $9.
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Same result. 97% less money. Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setInterval('monthly')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                interval === 'monthly'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setInterval('yearly')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors relative min-h-[44px] touch-manipulation ${
                interval === 'yearly'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                Save 17%
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
                className={`relative bg-white border-gray-200 ${isPopular ? 'border-secondary border-2 shadow-lg scale-105' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-secondary">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${pricing.price}</span>
                    <span className="text-gray-600">/{interval === 'monthly' ? 'mo' : 'yr'}</span>
                    {interval === 'yearly' && 'savings' in yearlyPricing && (
                      <div className="text-sm text-green-600 font-medium mt-1">
                        Save ${yearlyPricing.savings}/year
                      </div>
                    )}
                    {interval === 'monthly' && (
                      <div className="text-sm text-gray-500 mt-1">
                        or ${plan.yearly.price}/year (save ${('savings' in yearlyPricing ? yearlyPricing.savings : 0)})
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/signup" className="w-full" data-cta={`pricing-${key}`}>
                    <Button
                      className={`w-full ${isPopular ? 'bg-secondary hover:bg-secondary/90' : ''}`}
                      variant={isPopular ? 'default' : 'outline'}
                    >
                      Start Free Trial
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              </AnimateOnScroll>
            );
          })}
        </div>

        <div className="mt-8 text-center text-gray-600">
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
            <table className="w-full min-w-[500px] border-collapse rounded-lg overflow-hidden border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Feature</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-900">Starter</th>
                  <th className="text-center px-4 py-3 font-semibold text-secondary bg-secondary/5">Growth</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-900">Pro</th>
                </tr>
              </thead>
              <tbody>
                {FEATURE_COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-gray-700">{row.feature}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{row.starter}</td>
                    <td className="px-4 py-3 text-center bg-secondary/5 font-medium text-gray-900">{row.growth}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 text-center sm:text-left">
              Frequently Asked Questions
            </h3>
            <div className="flex justify-center gap-2">
              <button onClick={expandAll} className="text-sm text-primary hover:underline">Expand all</button>
              <span className="text-gray-400">|</span>
              <button onClick={collapseAll} className="text-sm text-primary hover:underline">Collapse all</button>
            </div>
          </div>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <FAQItem key={index} question={item.question} answer={item.answer} isOpen={faqOpen.has(index)} onToggle={() => toggleFaq(index)} />
            ))}
          </div>

          {/* FAQ CTA */}
          <div className="mt-12 p-6 rounded-xl bg-primary/5 border border-primary/20 text-center">
            <p className="text-lg text-gray-900 mb-2">Still have questions?</p>
            <p className="text-gray-600 mb-4">
              We&apos;ll answer them on your first call — plus write your first release free.
            </p>
            <Link href="/signup" data-cta="faq-cta">
              <Button className="bg-secondary hover:bg-secondary/90">Get Your Free Release</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left flex items-center justify-between gap-4"
      >
        <span className="font-medium text-gray-900">{question}</span>
        <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-6 pb-4">
            <p className="text-gray-600 transition-opacity duration-200">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
