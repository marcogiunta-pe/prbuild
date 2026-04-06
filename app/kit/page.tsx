import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { KitCheckoutButton } from './checkout-button';

export const metadata: Metadata = {
  title: 'Launch PR Kit for Funded Startups | PRBuild',
  description:
    'Professional press release, 5 personalized journalist pitch emails, and a 16-journalist AI panel review. $49, done in 24 hours.',
  openGraph: {
    title: 'Launch PR Kit for Funded Startups',
    description:
      'You just raised. Now announce it. Press release + pitch emails + panel review. $49.',
    type: 'website',
  },
};

const DELIVERABLES = [
  {
    title: 'Press Release',
    description: 'AP-style, written for your specific raise. Not a template — tailored to your company, your round, and your story.',
    preview: `FOR IMMEDIATE RELEASE

Acme Robotics Raises $8M Series A to
Bring Autonomous Warehouse Picking
to Mid-Size Fulfillment Centers

SAN FRANCISCO — Acme Robotics, the warehouse
automation company, today announced $8 million
in Series A funding led by Sequoia Capital...`,
  },
  {
    title: '5 Journalist Pitch Emails',
    description: 'Personalized to each reporter\u2019s beat. Not a generic blast — each email references what the journalist actually covers and why your raise matters to their readers.',
    preview: `Subject: Exclusive: $8M for warehouse robots
that work alongside humans

Hi Sarah,

Your TechCrunch piece on Amazon's warehouse
automation gaps nailed the bottleneck mid-size
fulfillment centers face. Acme just raised $8M
to solve exactly that...`,
  },
  {
    title: '16-Journalist Panel Review',
    description: 'Your release is scored by 16 AI journalist personas before any real reporter sees it. You get a newsroom score and the top 3 fixes to make it publishable.',
    preview: `NEWSROOM SCORE: 8.4 / 10

Top 3 fixes:
1. Lead buries the news — move funding
   amount to first sentence
2. Quote from CEO is generic — add a
   specific metric or customer result
3. Missing: who else invested beyond lead`,
  },
  {
    title: 'Revision Round',
    description: 'Not happy with something? Request changes and get an updated kit. One revision round included.',
  },
  {
    title: 'Export Formats',
    description: 'Google Doc, PDF, and plain text. Copy-paste into any email client, pitch deck, or investor update.',
  },
];

const COMPARISON = [
  { label: 'PR Agency', price: '$5,000+', note: 'monthly retainer' },
  { label: 'Wire Service', price: '$400+', note: 'no writing, no pitches' },
  { label: 'Freelancer', price: '$200+', note: 'inconsistent quality' },
  { label: 'Launch PR Kit', price: '$49', note: 'writing + pitches + review', highlight: true },
];

const STEPS = [
  { num: '01', title: 'Pay $49', desc: 'One-time. No subscription.' },
  { num: '02', title: 'Fill out a 5-minute form', desc: 'Company, raise details, key messaging.' },
  { num: '03', title: 'Get your kit in 24 hours', desc: 'Press release, pitches, and score delivered.' },
];

export default function KitPage() {
  return (
    <div className="min-h-screen bg-paper font-body">
      {/* Minimal header */}
      <header className="border-b border-rule bg-paper-light">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-display text-xl text-ink">PRBuild</span>
          </Link>
          <Link
            href="/login"
            className="text-sm text-ink-muted hover:text-ink transition-colors"
          >
            Log in
          </Link>
        </div>
      </header>

      {/* Hero — tight, centered */}
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-12 md:pt-24 md:pb-16 text-center">
        <p className="text-sm font-mono text-ink-muted tracking-wide uppercase mb-4">
          For funded startups
        </p>
        <h1 className="font-display text-ink leading-[1.1] mb-6" style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}>
          You just raised. Now announce it.
        </h1>
        <p className="text-lg text-ink-muted leading-relaxed mb-8 max-w-xl mx-auto">
          A complete media kit for your funding announcement. Press release,
          journalist pitches, and editorial review. <span className="font-mono text-ink">$49</span>. Done in 24 hours.
        </p>
        <KitCheckoutButton />
      </section>

      {/* What you get — the star of the page */}
      <section className="border-y border-rule bg-paper-light">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
          <h2 className="font-display text-3xl text-ink mb-4">
            What you get
          </h2>
          <p className="text-ink-muted mb-12 max-w-lg">
            Everything you need to announce your raise to the press, in one kit.
          </p>

          <div className="space-y-12">
            {DELIVERABLES.map((item, i) => (
              <div key={item.title} className={`${i < DELIVERABLES.length - 1 ? 'pb-12 border-b border-rule' : ''}`}>
                {item.preview ? (
                  <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div>
                      <h3 className="font-display text-xl text-ink mb-3">{item.title}</h3>
                      <p className="text-sm text-ink-muted leading-relaxed">{item.description}</p>
                    </div>
                    <div className="bg-paper border border-rule rounded-md p-5 font-mono text-xs text-ink-muted leading-relaxed whitespace-pre-line">
                      {item.preview}
                    </div>
                  </div>
                ) : (
                  <div className="max-w-lg">
                    <h3 className="font-display text-xl text-ink mb-3">{item.title}</h3>
                    <p className="text-sm text-ink-muted leading-relaxed">{item.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <h2 className="font-display text-3xl text-ink mb-10">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div key={step.num}>
              <span className="font-mono text-sm text-primary">{step.num}</span>
              <h3 className="font-display text-xl text-ink mt-2 mb-2">{step.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison — compressed */}
      <section className="border-y border-rule bg-paper-light">
        <div className="mx-auto max-w-3xl px-6 py-12">
          {COMPARISON.map((row) => (
            <div
              key={row.label}
              className={`flex items-baseline justify-between py-3 border-b border-rule last:border-b-0 ${
                row.highlight ? 'bg-primary/5 -mx-4 px-4 rounded-sm' : ''
              }`}
            >
              <div className="flex items-baseline gap-3">
                <span className={`text-sm ${row.highlight ? 'font-medium text-ink' : 'text-ink-muted'}`}>
                  {row.label}
                </span>
                <span className="text-xs text-ink-muted">{row.note}</span>
              </div>
              <span className={`font-mono text-base ${row.highlight ? 'text-primary font-medium' : 'text-ink'}`}>
                {row.price}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-paper-dark">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-4">
            Your raise is news. Let&apos;s make it official.
          </h2>
          <p className="text-ink-muted mb-8">
            Press release + 5 pitch emails + panel review. <span className="font-mono">$49</span>. Done in 24 hours.
          </p>
          <KitCheckoutButton />
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="border-t border-rule bg-paper-light">
        <div className="mx-auto max-w-5xl px-6 py-6 flex items-center justify-between text-xs text-ink-muted">
          <span>&copy; {new Date().getFullYear()} PRBuild</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-ink transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-ink transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
