import { Metadata } from 'next';
import Link from 'next/link';
import { Check, ArrowRight, FileText, Rocket, DollarSign, Clock, Users, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Press Release Service for Startups | PRBuild',
  description: 'Affordable press release writing and distribution for startups. Get your first release free. AI-powered writing with journalist feedback. Starting at $9/month.',
  keywords: [
    'press release for startups',
    'startup PR',
    'startup press release service',
    'affordable press release',
    'press release writing startups',
    'startup media coverage',
    'how to get press for startup',
  ],
  openGraph: {
    title: 'Press Release Service for Startups | PRBuild',
    description: 'Get media coverage without the agency price tag. First release free.',
  },
};

const benefits = [
  {
    icon: DollarSign,
    title: 'Startup-Friendly Pricing',
    description: 'Start at $9/month. That\'s less than one cup of coffee per day for professional PR.',
  },
  {
    icon: Clock,
    title: '24-Hour Turnaround',
    description: 'Get your press release written and reviewed within 24 hours. Perfect for fast-moving startups.',
  },
  {
    icon: Users,
    title: 'Journalist Feedback',
    description: 'Our journalist panel reviews your release. Know what works before you hit send.',
  },
  {
    icon: Zap,
    title: 'AI + Human Quality',
    description: 'AI does the heavy lifting. Humans make it not sound like AI. Best of both worlds.',
  },
  {
    icon: Target,
    title: 'Targeted Distribution',
    description: 'We send to journalists who actually opted in for startup news. No spray and pray.',
  },
  {
    icon: Rocket,
    title: 'First Release Free',
    description: 'Try us risk-free. No credit card required. See the quality before you pay.',
  },
];

const useCases = [
  {
    title: 'Product Launch',
    description: 'Announce your new product to the world. We\'ll write a release that highlights what makes it newsworthy.',
  },
  {
    title: 'Funding Announcement',
    description: 'Raised a round? We know exactly how to position your funding news for maximum coverage.',
  },
  {
    title: 'New Hire',
    description: 'Bringing on a notable executive? A press release can amplify their network effect.',
  },
  {
    title: 'Partnership',
    description: 'Strategic partnership with a bigger company? That\'s news worth announcing.',
  },
  {
    title: 'Milestone',
    description: 'Hit 1M users? Crossed $10M ARR? Milestones make great press release material.',
  },
  {
    title: 'Award or Recognition',
    description: 'Won an award or got featured somewhere? Amplify it with a professional release.',
  },
];

const testimonials = [
  {
    quote: "We went from zero press coverage to TechCrunch in 3 months. PRBuild made it possible on a seed-stage budget.",
    name: "Alex Chen",
    title: "Founder, DataSync",
    initials: "AC",
  },
  {
    quote: "The journalist feedback feature is gold. We learned more about PR in one release than a year of guessing.",
    name: "Maria Santos",
    title: "CEO, GreenTech Solutions",
    initials: "MS",
  },
];

export default function StartupsPage() {
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
      <section className="py-16 md:py-24 bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Rocket className="w-4 h-4" />
            For Startups
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get Press Coverage<br />
            <span className="text-primary">Without the Agency Price Tag</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Professional press releases written, reviewed by journalist personas, 
            and distributed to relevant media. Starting at $9/month.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                Get Your First Release Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline">
                See How It Works
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • Setup in 5 minutes
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              The Startup PR Problem
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              You know you need press coverage. But PR agencies want $5,000/month retainers. 
              Wire services charge $400+ per release. And writing your own usually ends with 
              "We are excited to announce..."
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-red-500 mb-2">$5,000+/mo</div>
                <div className="text-gray-600">Average PR agency retainer</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-red-500 mb-2">$400+</div>
                <div className="text-gray-600">PRWeb per release</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-red-500 mb-2">97%</div>
                <div className="text-gray-600">Press releases get ignored</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Built for Startups
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
      <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            What Can You Announce?
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            If it's newsworthy to your customers, it's worth a press release.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {useCases.map((useCase) => (
              <div key={useCase.title} className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-lg mb-2">{useCase.title}</h3>
                <p className="text-gray-600 text-sm">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Founders Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl">
                <p className="text-lg text-gray-700 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">{testimonial.initials}</span>
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Startup-Friendly Pricing
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Plans that grow with you. Cancel anytime.
          </p>
          <div className="inline-flex items-center gap-8 bg-white rounded-2xl p-8 shadow-sm">
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
                  <span>Unlimited revisions</span>
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
            Ready to Get Your Startup in the News?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Your first press release is free. See why hundreds of startups 
            choose PRBuild over expensive agencies.
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
