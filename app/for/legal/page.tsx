import { Metadata } from 'next';
import Link from 'next/link';
import { Check, ArrowRight, FileText, Scale, Award, Users, Building, Gavel, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Press Release Service for Law Firms | PRBuild',
  description: 'Professional press releases for law firms and attorneys. Case victories, partner promotions, firm news. First release free.',
  keywords: [
    'law firm press release',
    'attorney press release',
    'legal press release',
    'law firm PR',
    'lawyer marketing',
    'legal marketing',
  ],
  openGraph: {
    title: 'Press Release Service for Law Firms | PRBuild',
    description: 'Get your legal news in front of the right journalists.',
  },
  alternates: { canonical: 'https://prbuild.ai/for/legal' },
};

const benefits = [
  {
    icon: Gavel,
    title: 'Case Victories',
    description: 'Major verdict or settlement? Landmark case? These results deserve professional announcement.',
  },
  {
    icon: Users,
    title: 'Partner Promotions',
    description: 'New partner? Lateral hire? Leadership changes are newsworthy in the legal community.',
  },
  {
    icon: Building,
    title: 'Firm Expansion',
    description: 'New office? Practice area expansion? Merger or acquisition? Share your growth story.',
  },
  {
    icon: Award,
    title: 'Rankings & Recognition',
    description: 'Chambers ranking? Super Lawyers selection? Best Law Firms list? Amplify your recognition.',
  },
  {
    icon: BookOpen,
    title: 'Thought Leadership',
    description: 'Published article? Speaking engagement? Position your attorneys as industry experts.',
  },
  {
    icon: Scale,
    title: 'Pro Bono Work',
    description: 'Community impact and pro bono victories make compelling stories that humanize your firm.',
  },
];

const examples = [
  {
    type: 'Case Victory',
    headline: '[Firm] Secures $25M Verdict in Landmark Employment Discrimination Case',
    result: 'Covered by Law360, local news',
  },
  {
    type: 'Partner Promotion',
    headline: '[Firm] Elevates Three Attorneys to Partner, Expands IP Practice',
    result: 'Featured in legal trade publications',
  },
  {
    type: 'Expansion',
    headline: '[Firm] Opens Dallas Office, Hires 15 Attorneys from Rival Firm',
    result: 'Covered by Texas Lawyer, Am Law Daily',
  },
];

export default function LegalPage() {
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
      <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Scale className="w-4 h-4" />
            For Law Firms
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get Your Firm<br />
            <span className="text-primary">In The Legal Press</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Professional press releases for law firms. Case victories, partner news, 
            rankings—we help you build your firm's reputation.
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

      {/* Why PR for Law Firms */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Why Law Firms Need PR
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              In legal services, reputation drives referrals. Press coverage in legal publications 
              and business media positions your firm as a leader, attracts top talent, and 
              generates client inquiries.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-slate-600 mb-2">Credibility</div>
                <div className="text-gray-600">Media coverage validates expertise</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-slate-600 mb-2">Recruitment</div>
                <div className="text-gray-600">Top attorneys join visible firms</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-slate-600 mb-2">Clients</div>
                <div className="text-gray-600">Press coverage generates leads</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Help With */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Law Firms Announce
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-slate-600" />
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
                <div className="text-sm text-slate-600 font-medium mb-2">{example.type}</div>
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

      {/* Note on Ethics */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4">A Note on Legal Ethics</h3>
            <p className="text-gray-700 mb-4">
              We understand that law firm communications are subject to state bar rules and 
              ethics guidelines. Our press releases are factual announcements, not advertising 
              claims. We recommend review by your firm's ethics counsel before distribution.
            </p>
            <p className="text-gray-600 text-sm">
              We never make promises about case outcomes or include content that would violate 
              attorney advertising rules.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Your Firm's Reputation?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Your first press release is free. See how professional PR can elevate 
            your law firm's visibility.
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
