import { Metadata } from 'next';
import Link from 'next/link';
import { Check, ArrowRight, FileText, Code, TrendingUp, Users, Zap, Globe, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Press Release Service for SaaS Companies | PRBuild',
  description: 'Get media coverage for your SaaS company. Product launches, funding announcements, feature releases. AI-powered press releases starting at $9/month.',
  keywords: [
    'SaaS press release',
    'software press release',
    'tech startup PR',
    'SaaS PR strategy',
    'software launch press release',
    'B2B SaaS press release',
  ],
  openGraph: {
    title: 'Press Release Service for SaaS Companies | PRBuild',
    description: 'Turn product launches into news stories. First release free.',
  },
};

const benefits = [
  {
    icon: Rocket,
    title: 'Product Launch PRs',
    description: 'Launch your new product or major feature with a press release that highlights what makes it newsworthy to tech journalists.',
  },
  {
    icon: TrendingUp,
    title: 'Funding Announcements',
    description: 'Raised a seed round? Series A? We know exactly how to position your funding for maximum tech press coverage.',
  },
  {
    icon: Users,
    title: 'Milestone News',
    description: '10K users? $1M ARR? 100 enterprise customers? Milestones make compelling press release material.',
  },
  {
    icon: Globe,
    title: 'Partnership Announcements',
    description: 'Integration with a major platform? Strategic partnership? These deserve professional PR treatment.',
  },
  {
    icon: Code,
    title: 'Tech Journalist Network',
    description: 'Our journalist personas include SaaS and tech beats. We know what TechCrunch and VentureBeat want to see.',
  },
  {
    icon: Zap,
    title: 'Fast Turnaround',
    description: 'Ship on Tuesday, announce on Wednesday. 24-hour turnaround for fast-moving SaaS teams.',
  },
];

const examples = [
  {
    type: 'Product Launch',
    headline: '[SaaS] Launches AI-Powered Feature, Reducing Customer Churn by 40%',
    result: 'Featured in SaaS Weekly newsletter',
  },
  {
    type: 'Funding',
    headline: '[SaaS] Raises $5M Series A to Expand Enterprise Sales Team',
    result: 'Covered by TechCrunch, VentureBeat',
  },
  {
    type: 'Integration',
    headline: '[SaaS] Announces Salesforce Integration, Targeting Enterprise Market',
    result: 'Picked up by industry blogs',
  },
];

export default function SaaSPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">PRBuild</span>
          </Link>
          <Link href="/signup">
            <Button className="bg-secondary hover:bg-secondary/90">
              Get Free Release →
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Code className="w-4 h-4" />
            For SaaS Companies
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get Your SaaS<br />
            <span className="text-primary">In Front of Tech Journalists</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Product launches, funding rounds, milestones—we help SaaS companies 
            turn news into coverage. First release free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                Get Your First Release Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#examples">
              <Button size="lg" variant="outline">
                See Examples
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • 24-hour turnaround
          </p>
        </div>
      </section>

      {/* Why PR for SaaS */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Why SaaS Companies Need PR
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              CAC is skyrocketing. Paid acquisition is a race to the bottom. But one 
              TechCrunch feature can drive more qualified leads than months of ads—and 
              builds credibility that compounds.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-green-500 mb-2">Credibility</div>
                <div className="text-gray-600">"As seen in TechCrunch" in your pitch deck</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-green-500 mb-2">SEO</div>
                <div className="text-gray-600">Backlinks from high-DA tech sites</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-green-500 mb-2">Leads</div>
                <div className="text-gray-600">Inbound from people who read the article</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Help With */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What SaaS Companies Announce
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples */}
      <section id="examples" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Example Press Releases
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {examples.map((example, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-sm text-primary font-medium mb-2">{example.type}</div>
                <h3 className="font-semibold text-lg mb-3">{example.headline}</h3>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Check className="w-4 h-4" />
                  <span>{example.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Startup-Friendly Pricing
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            No enterprise contracts. No hidden fees. Cancel anytime.
          </p>
          <div className="inline-flex items-center gap-8 bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div>
              <div className="text-sm text-gray-500">Starting at</div>
              <div className="text-4xl font-bold text-primary">$9<span className="text-lg text-gray-500">/mo</span></div>
            </div>
            <div className="text-left">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>1 press release/month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Journalist panel review</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Tech journalist personas</span>
                </li>
              </ul>
            </div>
          </div>
          <p className="mt-6 text-gray-500">
            First release is completely free. No credit card required.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Tech Press Coverage?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Your first press release is free. See why hundreds of SaaS companies 
            choose PRBuild for their PR.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Get Your Free Release
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} PRBuild. All rights reserved. |{' '}
            <Link href="/privacy" className="hover:text-white">Privacy</Link> |{' '}
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
