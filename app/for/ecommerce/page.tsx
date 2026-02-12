import { Metadata } from 'next';
import Link from 'next/link';
import { Check, ArrowRight, FileText, ShoppingCart, TrendingUp, Tag, Package, Star, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Press Releases for E-commerce & DTC Brands | PRBuild',
  description: 'Get media coverage for your e-commerce brand. Product launches, sales events, funding news. AI-powered press releases starting at $9/month.',
  keywords: [
    'ecommerce press release',
    'product launch press release',
    'DTC brand PR',
    'online store press release',
    'ecommerce PR strategy',
    'product announcement press release',
  ],
  openGraph: {
    title: 'Press Releases for E-commerce & DTC Brands | PRBuild',
    description: 'Turn product launches into news stories. First release free.',
  },
  alternates: { canonical: 'https://prbuild.ai/for/ecommerce' },
};

const benefits = [
  {
    icon: Package,
    title: 'Product Launch PRs',
    description: 'Make your new product newsworthy. We know how to angle product launches for maximum coverage.',
  },
  {
    icon: Tag,
    title: 'Sale & Promo Coverage',
    description: 'Black Friday? Product drop? Turn your promotions into news stories that drive traffic.',
  },
  {
    icon: TrendingUp,
    title: 'Milestone Announcements',
    description: '10,000 orders? $1M in sales? Milestones make great press. We help you tell that story.',
  },
  {
    icon: Star,
    title: 'Award & Feature PRs',
    description: 'Got featured somewhere? Won an award? Amplify it with a professional press release.',
  },
  {
    icon: Megaphone,
    title: 'Partnership News',
    description: 'New retail partner? Influencer collaboration? These announcements deserve coverage.',
  },
  {
    icon: ShoppingCart,
    title: 'E-commerce Expertise',
    description: 'Our journalist personas include retail and e-commerce beats. We know what they want.',
  },
];

const examples = [
  {
    type: 'Product Launch',
    headline: '[Brand] Launches Revolutionary Sustainable Packaging, Eliminating 90% of Plastic',
    result: 'Covered by 12 sustainability blogs',
  },
  {
    type: 'Milestone',
    headline: '[Brand] Ships 100,000th Order, Donates $50,000 to Ocean Cleanup',
    result: 'Featured in industry newsletter',
  },
  {
    type: 'Partnership',
    headline: '[Brand] Partners with [Retailer] for Nationwide Distribution',
    result: 'Picked up by trade publications',
  },
];

export default function EcommercePage() {
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
      <section className="py-16 md:py-24 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <ShoppingCart className="w-4 h-4" />
            For E-commerce
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Turn Product Launches<br />
            <span className="text-primary">Into News Stories</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Professional press releases for e-commerce brands. Product launches, 
            sales events, milestones—we make your news newsworthy.
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

      {/* Why PR for E-commerce */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Why E-commerce Brands Need PR
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Paid ads are getting more expensive. CAC is climbing. But earned media? 
              One feature in the right publication can drive more qualified traffic 
              than a month of paid ads—and it's essentially free.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-green-500 mb-2">0 CAC</div>
                <div className="text-gray-600">Cost to acquire from earned media</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-green-500 mb-2">3x</div>
                <div className="text-gray-600">Higher trust than paid ads</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-green-500 mb-2">SEO</div>
                <div className="text-gray-600">Backlinks that last forever</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Help With */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What E-commerce Brands Announce
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

      {/* Process */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: '1', title: 'Share Your News', desc: 'Tell us about your product, launch, or milestone.' },
                { step: '2', title: 'We Write', desc: 'Our AI + human team crafts your press release.' },
                { step: '3', title: 'Journalist Review', desc: 'Our panel reviews for newsworthiness.' },
                { step: '4', title: 'Get Coverage', desc: 'Distribute to relevant media outlets.' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Your Brand in the News?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Your first press release is completely free. See the quality before you commit.
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
