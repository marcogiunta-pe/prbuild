import { Metadata } from 'next';
import Link from 'next/link';
import { Check, ArrowRight, FileText, TrendingUp, Building2, Users, Award, PiggyBank, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Press Release Service for Financial Services | PRBuild',
  description: 'Professional press releases for fintech, wealth management, and financial services companies. Product launches, funding, partnerships. First release free.',
  keywords: [
    'fintech press release',
    'financial services press release',
    'wealth management PR',
    'finance press release',
    'financial advisor marketing',
    'fintech PR',
  ],
  openGraph: {
    title: 'Press Release Service for Financial Services | PRBuild',
    description: 'Get your financial news in front of the right journalists.',
  },
};

const benefits = [
  {
    icon: LineChart,
    title: 'Product Launches',
    description: 'New financial product, app feature, or service offering? Position it for fintech and finance press.',
  },
  {
    icon: TrendingUp,
    title: 'Funding Rounds',
    description: 'Raised capital? Fintech funding news gets coverage. We know how to position your round.',
  },
  {
    icon: Building2,
    title: 'Partnerships',
    description: 'Bank partnership? Platform integration? Strategic alliances deserve professional announcements.',
  },
  {
    icon: PiggyBank,
    title: 'AUM Milestones',
    description: 'Crossed $1B AUM? Significant growth metrics make compelling financial press stories.',
  },
  {
    icon: Award,
    title: 'Industry Recognition',
    description: 'Fintech award? Industry ranking? Regulatory approval? Share your achievements.',
  },
  {
    icon: Users,
    title: 'Leadership News',
    description: 'New CEO, CFO, or key hire? Leadership changes signal growth and direction.',
  },
];

const examples = [
  {
    type: 'Product Launch',
    headline: '[Fintech] Launches AI-Powered Wealth Management Platform for Mass Affluent',
    result: 'Covered by Finextra, American Banker',
  },
  {
    type: 'Funding',
    headline: '[Fintech] Raises $40M Series B to Expand B2B Payments Platform',
    result: 'Featured in TechCrunch, Fintech Times',
  },
  {
    type: 'Partnership',
    headline: '[Fintech] Partners with [Major Bank] to Offer Embedded Banking Services',
    result: 'Covered by Banking Dive, Finovate',
  },
];

export default function FinancePage() {
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
      <section className="py-16 md:py-24 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            For Financial Services
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get Your Fintech News<br />
            <span className="text-primary">To The Financial Press</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Professional press releases for fintech, wealth management, and financial services.
            We understand the industry and know what financial journalists want.
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
        </div>
      </section>

      {/* Why PR for Finance */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Why Financial Services Need PR
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              In financial services, trust is everything. Press coverage in financial and fintech 
              publications builds credibility, attracts investors, and positions you as a 
              legitimate player in a crowded market.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-emerald-600 mb-2">Trust</div>
                <div className="text-gray-600">Media coverage builds credibility</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-emerald-600 mb-2">Investors</div>
                <div className="text-gray-600">Coverage attracts funding interest</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-emerald-600 mb-2">Partners</div>
                <div className="text-gray-600">Banks and enterprises notice PR</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Help With */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Financial Services Announce
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-emerald-600" />
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
                <div className="text-sm text-emerald-600 font-medium mb-2">{example.type}</div>
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

      {/* Compliance Note */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-emerald-50 border border-emerald-200 rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4">Compliance Awareness</h3>
            <p className="text-gray-700 mb-4">
              Financial services communications are often subject to regulatory requirements. 
              We write factual press releases that avoid forward-looking statements and 
              performance claims that could trigger compliance issues.
            </p>
            <p className="text-gray-600 text-sm">
              We recommend compliance review before distribution, especially for SEC-registered 
              firms or those making claims about returns or performance.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Credibility in Finance?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Your first press release is free. See how professional PR can position 
            your financial services company.
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
