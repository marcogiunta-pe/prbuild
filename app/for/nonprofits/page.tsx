import { Metadata } from 'next';
import Link from 'next/link';
import { Check, ArrowRight, FileText, Heart, Users, Globe, Megaphone, Award, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Press Release Service for Nonprofits | PRBuild',
  description: 'Affordable press release writing for nonprofits and NGOs. Announce fundraisers, events, grants, and impact stories. First release free.',
  keywords: [
    'nonprofit press release',
    'NGO press release',
    'charity press release',
    'nonprofit PR',
    'press release for nonprofits',
    'nonprofit media coverage',
  ],
  openGraph: {
    title: 'Press Release Service for Nonprofits | PRBuild',
    description: 'Get your mission in the news. First release free.',
  },
  alternates: { canonical: 'https://prbuild.ai/for/nonprofits' },
};

const benefits = [
  {
    icon: Heart,
    title: 'Impact Stories',
    description: 'Share the difference you\'re making. We help translate your impact data into compelling stories journalists want to tell.',
  },
  {
    icon: Calendar,
    title: 'Event Announcements',
    description: 'Galas, fundraisers, awareness days—we write releases that fill seats and attract sponsors.',
  },
  {
    icon: Award,
    title: 'Grant Announcements',
    description: 'Received a major grant? That\'s news. We help you announce it in a way that attracts more funders.',
  },
  {
    icon: Users,
    title: 'Leadership Updates',
    description: 'New executive director? Board member? Personnel news shows organizational growth.',
  },
  {
    icon: Globe,
    title: 'Program Launches',
    description: 'Starting a new initiative? A well-crafted release can attract volunteers, donors, and partners.',
  },
  {
    icon: Megaphone,
    title: 'Advocacy Campaigns',
    description: 'Launching a campaign or petition? We help you reach journalists covering your cause area.',
  },
];

const examples = [
  {
    type: 'Impact Story',
    headline: '[Nonprofit] Provides Clean Water to 100,000 People Across 5 Countries',
    result: 'Featured in philanthropy newsletter',
  },
  {
    type: 'Grant Announcement',
    headline: '[Nonprofit] Receives $500K Gates Foundation Grant to Expand Education Program',
    result: 'Covered by local news, education blogs',
  },
  {
    type: 'Event',
    headline: '[Nonprofit] Annual Gala to Honor Community Heroes, Raise $1M for Homeless Services',
    result: 'Society page coverage, sold-out event',
  },
];

export default function NonprofitsPage() {
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
      <section className="py-16 md:py-24 bg-gradient-to-b from-rose-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            For Nonprofits
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get Your Mission<br />
            <span className="text-primary">In Front of the Media</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Professional press releases for nonprofits at prices that respect your budget.
            More coverage means more awareness, donors, and volunteers.
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
            No credit card required • Nonprofit-friendly pricing
          </p>
        </div>
      </section>

      {/* Why PR for Nonprofits */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Why Nonprofits Need PR
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              You're doing important work. But if people don't know about it, they can't support it.
              Media coverage is the most credible form of awareness—and it's essentially free.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-rose-500 mb-2">Awareness</div>
                <div className="text-gray-600">Reach people who've never heard of you</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-rose-500 mb-2">Credibility</div>
                <div className="text-gray-600">Third-party validation builds trust</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-rose-500 mb-2">Donations</div>
                <div className="text-gray-600">Coverage drives giving</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Help With */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Nonprofits Announce
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-rose-600" />
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
                <div className="text-sm text-rose-600 font-medium mb-2">{example.type}</div>
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

      {/* Pricing */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Nonprofit-Friendly Pricing
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Every dollar you save goes back to your mission.
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
                  <span>Unlimited revisions</span>
                </li>
              </ul>
            </div>
          </div>
          <p className="mt-6 text-gray-500">
            First release is completely free. No credit card required.
          </p>
          <p className="mt-2 text-sm text-rose-600">
            Contact us about nonprofit discounts for 501(c)(3) organizations.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Share Your Mission?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Your first press release is free. Let's get your important work 
            in front of the people who need to see it.
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
