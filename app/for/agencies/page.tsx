import { Metadata } from 'next';
import Link from 'next/link';
import { Check, ArrowRight, FileText, Building2, Users, Clock, TrendingUp, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'White-Label Press Release Service for PR Agencies | PRBuild',
  description: 'Scale your agency with white-label press releases. AI-powered writing, 24-hour turnaround, unlimited client accounts. Volume discounts available.',
  keywords: [
    'white label press release',
    'PR agency tools',
    'press release service for agencies',
    'agency press release platform',
    'PR agency software',
    'bulk press release service',
  ],
  openGraph: {
    title: 'White-Label Press Release Service for PR Agencies | PRBuild',
    description: 'Scale your agency without scaling headcount. White-label press releases with 24-hour turnaround.',
  },
  alternates: { canonical: 'https://prbuild.ai/for/agencies' },
};

const benefits = [
  {
    icon: Building2,
    title: 'White-Label Ready',
    description: 'Your branding, your client relationships. We stay invisible. Export releases in your agency\'s template.',
  },
  {
    icon: Clock,
    title: '24-Hour Turnaround',
    description: 'Rush client request? No problem. Get polished press releases within 24 hours, every time.',
  },
  {
    icon: Users,
    title: 'Unlimited Client Seats',
    description: 'Manage all your clients from one dashboard. No per-seat fees. Scale without limits.',
  },
  {
    icon: TrendingUp,
    title: 'Volume Discounts',
    description: 'The more releases you need, the less you pay. Enterprise pricing for high-volume agencies.',
  },
  {
    icon: Shield,
    title: 'Client Separation',
    description: 'Separate workspaces for each client. Complete data isolation and confidentiality.',
  },
  {
    icon: Zap,
    title: 'API Access',
    description: 'Integrate PRBuild into your existing workflows. RESTful API for automation.',
  },
];

const useCases = [
  {
    title: 'Boutique PR Firms',
    description: 'Punch above your weight. Deliver enterprise-quality press releases without hiring more writers.',
    metric: '3x capacity without new hires',
  },
  {
    title: 'Marketing Agencies',
    description: 'Add PR services to your offering. White-label our writing and distribution as your own.',
    metric: 'New revenue stream',
  },
  {
    title: 'Large PR Agencies',
    description: 'Handle overflow during busy periods. Maintain quality when your team is stretched.',
    metric: 'Scalable capacity',
  },
];

const pricingTiers = [
  {
    name: 'Agency Starter',
    releases: '10 releases/month',
    price: '$79',
    features: ['Up to 5 client accounts', 'White-label exports', '24-hour turnaround', 'Email support'],
  },
  {
    name: 'Agency Pro',
    releases: '30 releases/month',
    price: '$199',
    popular: true,
    features: ['Unlimited client accounts', 'Priority turnaround', 'API access', 'Dedicated account manager'],
  },
  {
    name: 'Enterprise',
    releases: 'Unlimited',
    price: 'Custom',
    features: ['Custom branding', 'SLA guarantee', 'Custom integrations', 'Dedicated support'],
  },
];

export default function AgenciesPage() {
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
              Get Your Free Release →
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-indigo-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Building2 className="w-4 h-4" />
            For Agencies
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Scale Your Agency<br />
            <span className="text-primary">Without Scaling Headcount</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            White-label press release writing with 24-hour turnaround. 
            Your branding. Your client relationships. Our writing muscle.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                Get Your Free Release
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#pricing">
              <Button size="lg" variant="outline">
                View Agency Pricing
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Pain Point */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              The Agency Scaling Problem
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              New clients are great. But every new client means more press releases. 
              More writers. More management overhead. Or burned-out employees producing 
              declining quality under deadline pressure.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-red-500 mb-2">$65K+/yr</div>
                <div className="text-gray-600">Cost per junior PR writer</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-red-500 mb-2">6+ weeks</div>
                <div className="text-gray-600">To hire and train new staff</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-red-500 mb-2">↓ Quality</div>
                <div className="text-gray-600">When writers are stretched</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Built for Agencies
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

      {/* Use Cases */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Who Uses PRBuild for Agencies?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {useCases.map((useCase) => (
              <div key={useCase.title} className="bg-white p-8 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-xl mb-3">{useCase.title}</h3>
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <div className="text-primary font-semibold">{useCase.metric}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Agency Pricing
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Volume discounts that make sense for your business.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier) => (
              <div 
                key={tier.name} 
                className={`p-8 rounded-2xl ${tier.popular ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-white border border-gray-200'}`}
              >
                {tier.popular && (
                  <div className="text-sm font-medium mb-4 bg-white/20 inline-block px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="text-sm mb-4 opacity-80">{tier.releases}</div>
                <div className="text-4xl font-bold mb-6">
                  {tier.price}
                  {tier.price !== 'Custom' && <span className="text-lg opacity-60">/mo</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className={`w-5 h-5 ${tier.popular ? 'text-white' : 'text-green-500'}`} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={tier.price === 'Custom' ? 'mailto:sales@prbuild.ai' : '/signup'}>
                  <Button 
                    className={`w-full ${tier.popular ? 'bg-white text-primary hover:bg-gray-100' : 'bg-secondary hover:bg-secondary/90'}`}
                  >
                    {tier.price === 'Custom' ? 'Contact Sales' : 'Get Your Free Release'}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Scale Your Agency?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join 100+ agencies using PRBuild to deliver more without hiring more.
            Your first release is free.
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
