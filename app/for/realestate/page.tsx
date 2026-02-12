import { Metadata } from 'next';
import Link from 'next/link';
import { Check, ArrowRight, FileText, Home, Building2, TrendingUp, Award, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Press Release Service for Real Estate | PRBuild',
  description: 'Professional press releases for real estate agents, brokers, and property developers. New listings, sales records, market reports. First release free.',
  keywords: [
    'real estate press release',
    'property press release',
    'real estate PR',
    'realtor press release',
    'property developer PR',
    'real estate marketing',
  ],
  openGraph: {
    title: 'Press Release Service for Real Estate | PRBuild',
    description: 'Get your real estate news in front of property journalists.',
  },
  alternates: { canonical: 'https://prbuild.ai/for/realestate' },
};

const benefits = [
  {
    icon: Home,
    title: 'Luxury Listings',
    description: 'High-end properties deserve professional announcements. We help position luxury listings for maximum exposure.',
  },
  {
    icon: TrendingUp,
    title: 'Sales Records',
    description: 'Broke a sales record? Closed a notable deal? These milestones make great press release material.',
  },
  {
    icon: Building2,
    title: 'New Developments',
    description: 'Announcing a new development, groundbreaking, or grand opening? Get it covered by local media.',
  },
  {
    icon: Award,
    title: 'Awards & Recognition',
    description: 'Top producer? Industry award? Amplify your recognition with professional PR.',
  },
  {
    icon: Users,
    title: 'Team Announcements',
    description: 'New team member? Office expansion? Partnership? Share your growth story.',
  },
  {
    icon: MapPin,
    title: 'Market Reports',
    description: 'Position yourself as a market expert with press releases about local market trends and insights.',
  },
];

const examples = [
  {
    type: 'Luxury Listing',
    headline: '[Agent] Lists $15M Waterfront Estate, Largest in County History',
    result: 'Featured in local business journal, luxury lifestyle magazines',
  },
  {
    type: 'Sales Record',
    headline: '[Brokerage] Closes Record $50M Quarter, Up 40% Year-Over-Year',
    result: 'Covered by real estate trade publications',
  },
  {
    type: 'New Development',
    headline: '[Developer] Breaks Ground on 200-Unit Mixed-Use Project in Downtown',
    result: 'Local news coverage, industry newsletter feature',
  },
];

export default function RealEstatePage() {
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
      <section className="py-16 md:py-24 bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Home className="w-4 h-4" />
            For Real Estate
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get Your Listings<br />
            <span className="text-primary">In The News</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Professional press releases for real estate professionals. Luxury listings, 
            sales records, market insights—we help you stand out.
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

      {/* Why PR for Real Estate */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Why Real Estate Pros Need PR
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              In real estate, reputation is everything. Press coverage positions you as the 
              market expert, attracts high-net-worth clients, and differentiates you from 
              every other agent with a Zillow profile.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-amber-600 mb-2">Credibility</div>
                <div className="text-gray-600">"As seen in [Publication]" in your marketing</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-amber-600 mb-2">Referrals</div>
                <div className="text-gray-600">Coverage generates inbound leads</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-amber-600 mb-2">SEO</div>
                <div className="text-gray-600">Backlinks boost your online presence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Help With */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Real Estate Pros Announce
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-amber-600" />
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
                <div className="text-sm text-amber-600 font-medium mb-2">{example.type}</div>
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

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Stand Out in Your Market?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Your first press release is free. See how professional PR can elevate 
            your real estate business.
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
