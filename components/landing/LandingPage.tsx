'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Rocket, XCircle, CheckCircle2, BookOpen, Brain, Send, BarChart3 } from 'lucide-react';
import { PricingSection } from '@/components/landing/pricing-section';

const NAV_LINKS = [
  { label: 'Process', href: '#workflow' },
  { label: 'Authority Levels', href: '#pricing' },
  { label: 'Success Stories', href: '#testimonials' },
];

const WORKFLOW_STEPS = [
  {
    step: '01. STRATEGY',
    title: 'Narrative Extraction',
    body: 'Our AI analyzes your product to find the hook that matters to humans.',
    Icon: BookOpen,
  },
  {
    step: '02. TARGETING',
    title: 'AI Journalist Match',
    body: 'Identify the 50 reporters most likely to cover your specific story today.',
    Icon: Brain,
  },
  {
    step: '03. EXECUTION',
    title: 'Hyper-Pitching',
    body: 'Personalized outreach sent at the optimal open-time for each recipient.',
    Icon: Send,
  },
  {
    step: '04. IMPACT',
    title: 'Real-time Analytics',
    body: 'Track every open, click, and mention with deep-link attribution.',
    Icon: BarChart3,
  },
];

const TESTIMONIALS = [
  {
    quote:
      'PRBuild turned a half-baked launch idea into a headline-ready release in under an hour. The journalist panel feedback was sharper than the feedback I got from a paid agency.',
    name: 'Founder, SaaS startup',
    role: 'Seed-stage',
  },
  {
    quote:
      "The AI doesn't just write, it thinks. The narrative hook it pulled out of our funding announcement was the angle we'd been missing for weeks.",
    name: 'Founder, AI startup',
    role: 'Series A',
  },
  {
    quote:
      'Finally a PR tool built for founders. Transparent, fast, and the price is a tenth of what the legacy wires charge for a worse product.',
    name: 'Founder, Nonprofit',
    role: 'Mission-driven',
  },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="bg-surface text-on-surface font-editorial selection:bg-primary/15 selection:text-primary min-h-screen">
      {/* Nav — glassmorphic masthead */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'backdrop-blur-2xl bg-surface/70' : 'bg-transparent'
        }`}
        style={scrolled ? { boxShadow: '0 20px 40px rgba(26, 28, 25, 0.06)' } : undefined}
      >
        <div className="flex justify-between items-center px-6 md:px-8 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 group">
            <Rocket className="h-7 w-7 text-primary-container transition-transform group-hover:scale-110" strokeWidth={2} />
            <span className="font-headline text-2xl font-extrabold tracking-tighter text-on-surface">PRBuild</span>
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-label text-sm tracking-wide uppercase text-on-surface hover:text-primary-container transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/start"
              className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-2 rounded-full font-headline font-bold text-sm hover:opacity-90 transition-all active:scale-95"
            >
              Get Started
            </Link>
          </div>
          <Link
            href="/start"
            className="md:hidden bg-gradient-to-r from-primary to-primary-container text-on-primary px-4 py-2 rounded-full font-headline font-bold text-xs"
          >
            Start
          </Link>
        </div>
      </nav>

      <main className="pt-24">
        {/* Hero — asymmetric 60/40 split */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-20 lg:py-32 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <h1 className="font-headline text-5xl lg:text-7xl font-extrabold tracking-tight text-on-surface leading-[1.05] mb-6">
              Stop sending press <span className="text-primary-container italic">releases</span> that get ignored.
            </h1>
            <p className="font-editorial text-xl text-on-surface-variant max-w-xl mb-10 leading-relaxed">
              PRBuild uses AI and a 16-journalist review panel to craft press releases that reporters actually want to read. First release free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/start"
                className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-4 rounded-full font-headline font-bold text-lg hover:shadow-[0_20px_40px_rgba(26,28,25,0.06)] transition-all active:scale-95 text-center"
              >
                Launch Your Story
              </Link>
              <Link
                href="/how-it-works"
                className="bg-surface-container-highest text-on-surface px-8 py-4 rounded-md font-headline font-bold text-lg hover:bg-surface-container-high transition-all text-center"
              >
                See the Process
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            {/* Dashboard preview card with tonal layering, no drop shadow */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-tertiary/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
            <div
              className="relative z-10 rounded-xl p-4 bg-surface-container-lowest"
              style={{ boxShadow: '0 20px 40px rgba(26, 28, 25, 0.06)' }}
            >
              {/* Mock dashboard surface */}
              <div className="rounded-lg bg-on-surface text-surface p-6 font-label">
                <div className="flex items-center gap-2 mb-4 opacity-60">
                  <div className="w-2 h-2 rounded-full bg-surface/40" />
                  <div className="w-2 h-2 rounded-full bg-surface/40" />
                  <div className="w-2 h-2 rounded-full bg-surface/40" />
                  <span className="text-[10px] uppercase tracking-widest ml-2">prbuild / panel</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest opacity-50 mb-3">Newsroom Score</p>
                <p className="font-headline text-5xl font-extrabold text-primary-container">9.4<span className="text-lg text-surface/50"> / 10</span></p>
                <div className="mt-5 space-y-2">
                  {[
                    { label: 'Hook strength', pct: '94' },
                    { label: 'Fact density', pct: '88' },
                    { label: 'Quote attribution', pct: '100' },
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="flex justify-between text-[10px] uppercase tracking-wider opacity-70 mb-1">
                        <span>{row.label}</span>
                        <span>{row.pct}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-surface/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-primary-container" style={{ width: `${row.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-surface/10 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary-container" />
                  <span className="text-[10px] uppercase tracking-widest">16 / 16 would run this</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-tertiary-container text-on-tertiary px-4 py-3 rounded-xl font-label text-xs uppercase tracking-widest z-20">
              AI Review Active
            </div>
          </div>
        </section>

        {/* Social Proof — outlets we target, not false endorsements */}
        <section className="bg-surface-container-low py-14">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <p className="font-label text-xs text-center uppercase tracking-[0.2em] text-on-surface-variant mb-8">
              Coverage we target for our clients
            </p>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="font-headline text-2xl font-black italic tracking-tighter">TechCrunch</span>
              <span className="font-headline text-2xl font-extrabold uppercase tracking-widest">Forbes</span>
              <span className="font-headline text-2xl font-bold lowercase">wired</span>
              <span className="font-headline text-2xl font-extrabold tracking-tight">Bloomberg</span>
              <span className="font-headline text-2xl font-black uppercase tracking-tighter">Verge</span>
            </div>
          </div>
        </section>

        {/* Problem vs Solution */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-24">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Old */}
            <div className="bg-surface-container-low rounded-xl p-10 relative overflow-hidden">
              <div className="absolute top-4 right-6 font-label text-sm text-on-surface-variant/40 font-bold tracking-widest">OLD WAY</div>
              <h3 className="font-headline text-3xl font-bold mb-8 text-on-surface-variant">The Legacy Struggle</h3>
              <ul className="space-y-6">
                {[
                  'Generic mass email blasts that land straight in spam.',
                  'Dry, corporate language with no actual narrative hook.',
                  'Wait weeks for account managers to manually research contacts.',
                  'Pay $400 to $1,200 per release for zero pickup.',
                ].map((line) => (
                  <li key={line} className="flex items-start gap-4">
                    <XCircle className="h-5 w-5 text-on-surface-variant/50 mt-1 shrink-0" />
                    <p className="font-editorial text-on-surface-variant leading-relaxed">{line}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* New — primary color block */}
            <div
              className="bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl p-10 relative overflow-hidden lg:scale-[1.02]"
              style={{ boxShadow: '0 20px 40px rgba(26, 28, 25, 0.06)' }}
            >
              <div className="absolute top-4 right-6 font-label text-sm text-on-primary/60 font-bold tracking-widest">NEW WAY</div>
              <h3 className="font-headline text-3xl font-bold mb-8">The PRBuild Authority</h3>
              <ul className="space-y-6">
                {[
                  '16 journalist personas review every draft before you send it.',
                  'AI-tuned narrative hooks specific to your announcement type.',
                  'Professional release written, reviewed, and formatted in hours.',
                  'Transparent $9 pricing. First release free. Cancel anytime.',
                ].map((line) => (
                  <li key={line} className="flex items-start gap-4">
                    <CheckCircle2 className="h-5 w-5 text-on-primary mt-1 shrink-0" />
                    <p className="font-editorial leading-relaxed">{line}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Workflow — 4 step */}
        <section className="bg-surface py-24" id="workflow">
          <div className="max-w-7xl mx-auto px-6 md:px-8 text-center mb-16">
            <h2 className="font-headline text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-on-surface">
              The Launch Workflow
            </h2>
            <p className="font-editorial text-on-surface-variant max-w-2xl mx-auto text-lg">
              From idea to headline-ready draft in four tactical moves.
            </p>
          </div>
          <div className="max-w-7xl mx-auto px-6 md:px-8 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WORKFLOW_STEPS.map(({ step, title, body, Icon }) => (
              <div key={step} className="group">
                <div className="w-16 h-16 bg-surface-container-high rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                  <Icon className="h-7 w-7 text-primary group-hover:text-on-primary transition-colors" strokeWidth={2} />
                </div>
                <span className="font-label text-xs text-primary-container font-bold tracking-widest mb-2 block">{step}</span>
                <h4 className="font-headline text-xl font-bold mb-3 text-on-surface">{title}</h4>
                <p className="font-editorial text-sm text-on-surface-variant leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing — real prices from existing component */}
        <div id="pricing">
          <PricingSection />
        </div>

        {/* Testimonials */}
        <section className="py-24 max-w-7xl mx-auto px-6 md:px-8" id="testimonials">
          <div className="text-center mb-16">
            <h2 className="font-headline text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-on-surface">
              Loved by founders who hate PR.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-surface-container p-8 rounded-xl relative">
                <span className="font-headline text-6xl text-primary-container/20 absolute top-4 left-4 leading-none" aria-hidden="true">
                  &ldquo;
                </span>
                <p className="font-editorial text-on-surface leading-relaxed relative z-10 mb-8 italic">{t.quote}</p>
                <div>
                  <p className="font-headline font-bold text-sm text-on-surface">{t.name}</p>
                  <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider mt-1">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA — dark editorial */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 mb-24">
          <div className="bg-on-surface text-surface rounded-3xl p-12 lg:p-24 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/20 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-tertiary/20 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
            <h2 className="font-headline text-4xl lg:text-6xl font-extrabold tracking-tight mb-8 relative z-10">
              Stop writing press releases <span className="text-primary-container italic">nobody</span> reads.
            </h2>
            <div className="flex justify-center relative z-10">
              <Link
                href="/start"
                className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-12 py-5 rounded-full font-headline font-bold text-xl hover:scale-105 transition-all"
                style={{ boxShadow: '0 20px 40px rgba(192, 59, 34, 0.4)' }}
              >
                Launch Your Story
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer — tonal shift, no borders */}
      <footer className="bg-surface-container-low">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 md:px-12 py-16 gap-8 max-w-7xl mx-auto">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary-container" />
              <span className="font-headline text-xl font-bold text-on-surface">PRBuild</span>
            </div>
            <p className="font-label text-xs tracking-wide text-on-surface-variant max-w-xs uppercase">
              &copy; {new Date().getFullYear()} PRBuild. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            <Link href="/how-it-works" className="font-label text-sm tracking-wide uppercase text-on-surface-variant hover:text-primary-container transition-colors">
              How It Works
            </Link>
            <Link href="/kit" className="font-label text-sm tracking-wide uppercase text-on-surface-variant hover:text-primary-container transition-colors">
              Launch Kit
            </Link>
            <Link href="/docs" className="font-label text-sm tracking-wide uppercase text-on-surface-variant hover:text-primary-container transition-colors">
              Docs
            </Link>
            <Link href="/contact" className="font-label text-sm tracking-wide uppercase text-on-surface-variant hover:text-primary-container transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
