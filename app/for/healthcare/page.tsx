import { Metadata } from 'next';
import Link from 'next/link';
import { Check, ArrowRight, FileText, Heart, Shield, Award, Users, Building, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Press Release Service for Healthcare Companies | PRBuild',
  description: 'Professional press releases for healthcare, medical devices, biotech, and health tech companies. HIPAA-aware writing. First release free.',
  keywords: [
    'healthcare press release',
    'medical press release',
    'biotech press release',
    'health tech PR',
    'medical device press release',
    'pharmaceutical press release',
  ],
  openGraph: {
    title: 'Press Release Service for Healthcare Companies | PRBuild',
    description: 'Get your healthcare news in front of the right journalists.',
  },
  alternates: { canonical: 'https://prbuild.ai/for/healthcare' },
};

const benefits = [
  {
    icon: Stethoscope,
    title: 'Clinical Trial Results',
    description: 'Announce trial outcomes with the right balance of scientific accuracy and accessibility for general media.',
  },
  {
    icon: Shield,
    title: 'FDA Approvals & Clearances',
    description: 'Regulatory milestones deserve professional announcements. We know the terminology and what journalists need.',
  },
  {
    icon: Heart,
    title: 'Product Launches',
    description: 'New medical device or health tech product? We help position it for both trade and consumer press.',
  },
  {
    icon: Building,
    title: 'Funding & Partnerships',
    description: 'Healthcare funding rounds and strategic partnerships require industry-specific positioning.',
  },
  {
    icon: Award,
    title: 'Research Publications',
    description: 'Peer-reviewed study coming out? Time it with a press release for maximum impact.',
  },
  {
    icon: Users,
    title: 'Leadership Updates',
    description: 'New CEO, CMO, or key hire? Healthcare leadership changes are newsworthy.',
  },
];

const examples = [
  {
    type: 'FDA Clearance',
    headline: '[Company] Receives FDA 510(k) Clearance for AI-Powered Diagnostic Platform',
    result: 'Covered by MedTech Dive, Fierce Healthcare',
  },
  {
    type: 'Clinical Trial',
    headline: '[Company] Announces Positive Phase 2 Results for Novel Cancer Treatment',
    result: 'Picked up by biotech trade publications',
  },
  {
    type: 'Funding',
    headline: '[Company] Raises $30M Series B to Expand Digital Therapeutics Platform',
    result: 'Featured in Healthcare Weekly, local business journal',
  },
];

export default function HealthcarePage() {
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
      <section className="py-16 md:py-24 bg-gradient-to-b from-cyan-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            For Healthcare
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get Your Healthcare News<br />
            <span className="text-primary">To The Right Journalists</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Press releases for healthcare, biotech, medical devices, and health tech.
            We understand the industry—and so do our journalist personas.
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
            No credit card required • Healthcare-experienced writers
          </p>
        </div>
      </section>

      {/* Why Healthcare PR Matters */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Healthcare PR Is Different
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Healthcare press releases require precision. Wrong terminology can undermine credibility.
              Overstated claims can trigger regulatory concerns. We get it right.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-cyan-600 mb-2">Accuracy</div>
                <div className="text-gray-600">Medical terminology reviewed for correctness</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-cyan-600 mb-2">Compliance</div>
                <div className="text-gray-600">Aware of FDA, HIPAA, and regulatory guidelines</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-cyan-600 mb-2">Targeting</div>
                <div className="text-gray-600">Healthcare and biotech journalists on our list</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Help With */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Healthcare Companies Announce
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-cyan-600" />
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
                <div className="text-sm text-cyan-600 font-medium mb-2">{example.type}</div>
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

      {/* Note on Compliance */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-cyan-50 border border-cyan-200 rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4">A Note on Compliance</h3>
            <p className="text-gray-700 mb-4">
              We write press releases that are mindful of healthcare regulations, but we are not a 
              legal or regulatory compliance service. All releases should be reviewed by your legal 
              and regulatory teams before distribution, especially for clinical claims, FDA-regulated 
              products, or patient-related information.
            </p>
            <p className="text-gray-600 text-sm">
              We never include protected health information (PHI) and recommend against sharing any 
              in your submission.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Announce Your Healthcare News?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Your first press release is free. See the quality and healthcare expertise 
            before you commit.
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
