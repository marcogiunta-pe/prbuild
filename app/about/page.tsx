import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileText, Target, Users, Zap, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'About PRBuild - Our Story & Mission',
  description: 'PRBuild helps startups and small businesses get press coverage without the agency price tag. Learn about our mission, team, and why we built this.',
  openGraph: {
    title: 'About PRBuild - Our Story & Mission',
    description: 'Making professional PR accessible to everyone.',
  },
};

const values = [
  {
    icon: Target,
    title: 'Quality Over Quantity',
    description: 'We\'d rather send one great release to 50 relevant journalists than a mediocre one to 5,000 random inboxes.',
  },
  {
    icon: Users,
    title: 'Journalist-First Thinking',
    description: 'We built our product by talking to journalists. They told us what they hate about press releases, and we fixed it.',
  },
  {
    icon: Zap,
    title: 'Speed Matters',
    description: 'News moves fast. You shouldn\'t wait a week for a press release. 24-hour turnaround is our standard.',
  },
  {
    icon: Heart,
    title: 'Fair Pricing',
    description: 'Great PR shouldn\'t require a $5,000/month agency retainer. We keep our prices startup-friendly.',
  },
];

const stats = [
  { number: '847+', label: 'Releases Published' },
  { number: '23%', label: 'Pickup Rate' },
  { number: '16', label: 'Journalist Personas' },
  { number: '24hr', label: 'Turnaround' },
];

export default function AboutPage() {
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
              Start Free →
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              We're Making PR<br />
              <span className="text-primary">Accessible to Everyone</span>
            </h1>
            <p className="text-xl text-gray-600">
              PRBuild started with a simple question: Why does getting press coverage 
              cost $5,000/month when the actual work takes a few hours?
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Our Story</h2>
            <div className="prose prose-lg text-gray-600">
              <p>
                We were startup founders who needed press coverage but couldn't afford PR agencies. 
                So we did what everyone does: wrote our own press releases, sent them to PRWeb, 
                and waited. And waited. And got nothing.
              </p>
              <p>
                $400 gone. Zero coverage. We tried again with PR Newswire. $800 this time. 
                Same result. The releases got "distributed" to websites nobody visits. 
                Real journalists? Never saw them.
              </p>
              <p>
                So we talked to journalists. We asked them: What makes you actually read a press release? 
                What makes you delete it? The answers were surprisingly consistent:
              </p>
              <ul>
                <li><strong>"Most press releases are boring."</strong> They're written for the company, not for me.</li>
                <li><strong>"I can spot AI copy instantly."</strong> And I delete it instantly.</li>
                <li><strong>"Don't blast me."</strong> If you're sending to everyone, you're sending to no one.</li>
              </ul>
              <p>
                We built PRBuild to fix these problems. AI does the heavy lifting, but humans make 
                it not sound like AI. 16 journalist personas review every release before you see it. 
                And we only send to journalists who actually opted in to receive news in your category.
              </p>
              <p>
                The result? A 23% pickup rate—about 10x the industry average for wire services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What We Believe</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {values.map((value) => (
              <div key={value.title} className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Try It?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Your first press release is free. No credit card, no commitment. 
            See the quality before you pay anything.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90">
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
