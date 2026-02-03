'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronDown } from 'lucide-react';
import { PRICING, BillingInterval } from '@/types';

const FAQ_ITEMS = [
  {
    question: "What do I get with my first free release?",
    answer: "Your first press release includes everything: professional AI-assisted writing, review by our 16-persona journalist panel, unlimited revisions until you're happy, publication to our showcase, and distribution to journalists in your industry. No credit card required."
  },
  {
    question: "How is this different from PRWeb or PR Newswire?",
    answer: "Wire services distribute to syndication networks (mostly junk sites). We focus on quality: every release is critiqued by our journalist panel before you see it, ensuring it's actually newsworthy. Then we distribute to real journalists who've opted in for your category."
  },
  {
    question: "What if I'm not happy with my press release?",
    answer: "We offer unlimited revisions until you're satisfied. Our panel feedback helps you understand exactly what journalists look for, and our team will keep refining until you approve. If you're still not happy, we'll refund your purchase—no questions asked."
  },
  {
    question: "How long does it take to get my press release?",
    answer: "Most releases are ready for your review within 24-48 hours. After you submit your news details, our team writes the draft, runs it through our journalist panel, and sends you everything with actionable feedback. Rush delivery is available on Pro plans."
  },
  {
    question: "Who are the 16 journalist personas?",
    answer: "Our journalist personas are AI models trained on real journalist preferences across different beats: tech, business, lifestyle, local news, trade publications, and more. Each persona evaluates your release from their specific perspective, providing feedback on newsworthiness, clarity, and what would make them actually cover your story."
  },
  {
    question: "What does the pickup rate mean?",
    answer: "Pickup rate measures journalist engagement within 7 days of distribution. This includes opens, clicks, replies, and coverage. The industry average for wire services is around 2%. Our higher rate comes from sending releases only to journalists who specifically requested news in your category."
  },
];

export function PricingSection() {
  const [interval, setInterval] = useState<BillingInterval>('monthly');

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
              className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
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
          {Object.entries(PRICING).map(([key, plan]) => {
            const isPopular = 'popular' in plan && plan.popular;
            const pricing = plan[interval];
            const yearlyPricing = plan.yearly;
            
            return (
              <Card 
                key={key} 
                className={`relative ${isPopular ? 'border-secondary border-2 shadow-lg scale-105' : ''}`}
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
                  <Link href="/signup" className="w-full">
                    <Button 
                      className={`w-full ${isPopular ? 'bg-secondary hover:bg-secondary/90' : ''}`}
                      variant={isPopular ? 'default' : 'outline'}
                    >
                      Start Free Trial
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p>
            PRWeb charges $120-$480 per release. PR Newswire charges $1,070+. 
            We charge $9. Do the math.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <FAQItem key={index} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex items-center justify-between gap-4"
      >
        <span className="font-medium text-gray-900">{question}</span>
        <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
}
