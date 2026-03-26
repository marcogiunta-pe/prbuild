'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileText, Users, Send, Zap, Target, Shield, ArrowRight, Check, Star, Menu, X, AlertTriangle } from 'lucide-react';
import { PricingSection } from '@/components/landing/pricing-section';
import { AnimatedStatsBanner } from '@/components/AnimatedStats';
import { TrustBadges, TrustBadgesCompact } from '@/components/TrustBadges';
import { AnimateOnScroll } from '@/components/landing/AnimateOnScroll';
import { LogoBar } from '@/components/landing/LogoBar';
import { HeroMockup } from '@/components/landing/HeroMockup';
import { BeforeAfterComparison } from '@/components/landing/BeforeAfterComparison';
import { PressReleasePreview } from '@/components/landing/PressReleasePreview';
import { SectionErrorBoundary } from '@/components/SectionErrorBoundary';

const ExitIntentPopup = dynamic(() => import('@/components/ExitIntent').then((m) => ({ default: m.ExitIntentPopup })), { ssr: false });
const StickyCTA = dynamic(() => import('@/components/StickyCTA').then((m) => ({ default: m.StickyCTA })), { ssr: false });
const ROICalculator = dynamic(() => import('@/components/ROICalculator').then((m) => ({ default: m.ROICalculator })), { ssr: false });
const TestimonialsGrid = dynamic(() => import('@/components/landing/TestimonialsGrid').then((m) => ({ default: m.TestimonialsGrid })), { ssr: false });
const SocialProofTicker = dynamic(() => import('@/components/landing/SocialProofTicker').then((m) => ({ default: m.SocialProofTicker })), { ssr: false });
const QuizTeaser = dynamic(() => import('@/components/quiz/QuizTeaser').then((m) => ({ default: m.QuizTeaser })), { ssr: false });

const NAV_SECTIONS = [
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'features', label: 'Features' },
  { id: 'pricing', label: 'Pricing' },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 120);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-body">
      {/* Navigation — editorial masthead style */}
      <header
        className={`sticky top-0 z-50 w-full border-b border-rule backdrop-blur transition-all duration-300 ${
          navScrolled ? 'bg-paper-light/98 shadow-sm py-2' : 'bg-paper-light/95 py-0'
        }`}
      >
        <div className={`container mx-auto flex items-center justify-between px-4 transition-all duration-300 ${navScrolled ? 'h-14' : 'h-16'}`}>
          <Link href="/" className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-display text-xl text-ink">PRBuild</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {NAV_SECTIONS.map(({ id, label }) => (
              <Link
                key={id}
                href={`#${id}`}
                className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === id ? 'text-primary' : 'text-ink-muted'}`}
                aria-current={activeSection === id ? 'true' : undefined}
              >
                {label}
              </Link>
            ))}
            <Link href="/showcase" className="text-sm font-medium text-ink-muted hover:text-primary" data-cta="nav-showcase">
              Showcase
            </Link>
            <Link href="/resources/how-to-write-press-release" className="text-sm font-medium text-ink-muted hover:text-primary" data-cta="nav-resources">
              Resources
            </Link>
            <Link href="/login" className="text-sm font-medium text-ink-muted hover:text-primary" data-cta="nav-login">
              Login
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            <Link href="/signup" className="hidden sm:block" data-cta="nav-signup">
              <Button className="bg-primary hover:bg-primary-700 min-h-[44px] rounded-sm">
                Get Your Free Release
              </Button>
            </Link>
            <button
              type="button"
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation rounded-sm hover:bg-paper-dark"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-rule bg-paper-light">
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-1">
              <Link href="#features" className="min-h-[44px] flex items-center text-sm font-medium text-ink-muted hover:text-primary touch-manipulation" onClick={() => setMobileMenuOpen(false)} data-cta="mobile-features">
                Features
              </Link>
              <Link href="#pricing" className="min-h-[44px] flex items-center text-sm font-medium text-ink-muted hover:text-primary touch-manipulation" onClick={() => setMobileMenuOpen(false)} data-cta="mobile-pricing">
                Pricing
              </Link>
              <Link href="/showcase" className="min-h-[44px] flex items-center text-sm font-medium text-ink-muted hover:text-primary touch-manipulation" onClick={() => setMobileMenuOpen(false)} data-cta="mobile-showcase">
                Showcase
              </Link>
              <Link href="/resources/how-to-write-press-release" className="min-h-[44px] flex items-center text-sm font-medium text-ink-muted hover:text-primary touch-manipulation" onClick={() => setMobileMenuOpen(false)} data-cta="mobile-resources">
                Resources
              </Link>
              <Link href="/login" className="min-h-[44px] flex items-center text-sm font-medium text-ink-muted hover:text-primary touch-manipulation" onClick={() => setMobileMenuOpen(false)} data-cta="mobile-login">
                Login
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="mt-2" data-cta="mobile-signup">
                <Button className="w-full bg-primary hover:bg-primary-700 min-h-[44px] touch-manipulation rounded-sm">
                  Get Your Free Release
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main id="main-content" className="flex-1">
        {/* Hero — Editorial asymmetric layout */}
        <section className="bg-paper-light border-b border-rule">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-12 min-h-[85vh] items-center">
              <div className="py-20 md:py-32">
                <div className="animate-fade-up" style={{ animationDuration: '0.5s' }}>
                  <div className="flex items-center gap-3 mb-8">
                    <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-ink-muted">PRBuild</span>
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-ink-muted">Est. 2024</span>
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-ink-muted">Vol. 847</span>
                  </div>
                  <h1 className="font-display text-5xl md:text-7xl leading-[1.05] tracking-tight text-ink mb-6">
                    97% of Press Releases Get <em className="text-primary italic">Ignored.</em> Yours Won&apos;t.
                  </h1>
                </div>
                <p className="text-lg text-ink-muted mb-10 max-w-lg leading-relaxed">
                  You get a press release that 16 journalists already tried to kill. What survived is what gets published.
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
                  <Link href="/signup" data-cta="hero-signup">
                    <Button size="lg" className="bg-primary hover:bg-primary-700 text-lg px-8 min-h-[44px] touch-manipulation rounded-sm">
                      Get Your First Release Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works" data-cta="hero-how-it-works">
                    <Button size="lg" variant="outline" className="text-lg px-8 min-h-[44px] touch-manipulation rounded-sm border-rule text-ink hover:bg-paper-dark">
                      See how it works
                    </Button>
                  </Link>
                </div>

                <p className="text-sm text-ink-muted mb-8">No credit card required &bull; Setup in 2 minutes</p>

                <div className="flex gap-8 pt-6 border-t border-rule">
                  <div>
                    <div className="font-display text-3xl text-ink">847</div>
                    <div className="font-mono text-xs text-ink-muted">Releases published</div>
                  </div>
                  <div>
                    <div className="font-display text-3xl text-ink">23%</div>
                    <div className="font-mono text-xs text-ink-muted">Pickup rate</div>
                  </div>
                  <div>
                    <div className="font-display text-3xl text-ink">16</div>
                    <div className="font-mono text-xs text-ink-muted">Journalist reviewers</div>
                  </div>
                </div>
              </div>

              {/* Review Stack — editorial panel preview */}
              <div className="hidden md:block py-10">
                <div className="bg-paper border border-rule rounded-md p-6">
                  <div className="flex justify-between items-center pb-4 border-b border-rule mb-4">
                    <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-ink-muted">Panel Review</span>
                    <span className="font-mono text-[11px] bg-primary text-white px-3 py-1 rounded-sm">16 / 16</span>
                  </div>
                  {[
                    { initials: 'SL', name: 'Sarah Lin', beat: 'Tech M&A Reporter', comment: '"Strong headline. Add specific metrics in paragraph 2."', pass: true },
                    { initials: 'MR', name: 'Marcus Reid', beat: 'Enterprise SaaS', comment: '"Quote placement is excellent. Consider a stronger CTA."', pass: true },
                    { initials: 'JH', name: 'Jenna Huang', beat: 'Consumer Brands', comment: '"Needs more human angle. The lead is too product-focused."', pass: false },
                    { initials: 'DK', name: 'David Kessler', beat: 'PR Agency Veteran', comment: '"Dateline formatting is correct. Boilerplate is tight."', pass: true },
                  ].map((review) => (
                    <div key={review.initials} className="flex gap-3 py-3 border-b border-rule last:border-b-0 items-start">
                      <div className="w-9 h-9 rounded-full bg-paper-dark flex items-center justify-center font-mono text-xs font-semibold text-ink-muted flex-shrink-0">
                        {review.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-ink">{review.name}</div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-primary mb-1">{review.beat}</div>
                        <div className="text-sm text-ink-muted leading-snug">{review.comment}</div>
                      </div>
                      <span className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded-sm flex-shrink-0 ${review.pass ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                        {review.pass ? 'PASS' : 'REVISE'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <LogoBar />
        </section>

        <AnimatedStatsBanner />

        {/* Pain Points — editorial modules, not cards */}
        <section className="py-20 bg-paper">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl text-ink mb-4">
                You&apos;ve Tried This Before
              </h2>
              <p className="text-lg text-ink-muted max-w-2xl mx-auto">
                <Link href="/compare/prweb" className="text-primary underline hover:text-primary-700">$400 to PRWeb</Link>. Zero coverage. Sound familiar?
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-0 max-w-5xl mx-auto border border-rule rounded-md overflow-hidden">
              {[
                { icon: AlertTriangle, title: 'ChatGPT Press Releases', items: ['"We are excited to announce..." — delete.', 'Journalists spot AI copy instantly', 'You end up rewriting 75% anyway'] },
                { icon: Target, title: 'Wire Services', items: ['$400 to "distribute" to nobody', 'Published on sites with 12 monthly visitors', 'Real journalists never see it'] },
                { icon: Users, title: 'PR Agencies', items: ['$3,000/month retainer', '5 rounds of revision, still bland', 'No guarantee anyone reads it'] },
              ].map((card, i) => (
                <AnimateOnScroll key={card.title} delay={i * 100}>
                  <div className={`p-8 bg-paper-light ${i < 2 ? 'md:border-r border-b md:border-b-0 border-rule' : ''}`}>
                    <div className="w-10 h-10 bg-paper-dark rounded-sm flex items-center justify-center mb-4">
                      <card.icon className="h-5 w-5 text-secondary" />
                    </div>
                    <h3 className="text-lg font-semibold text-ink mb-3">{card.title}</h3>
                    <ul className="text-ink-muted space-y-2 text-sm">
                      {card.items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="text-secondary mt-1">&bull;</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            <div className="mt-16 max-w-3xl mx-auto text-center">
              <h3 className="font-display text-2xl text-ink mb-4">
                The problem isn&apos;t your news. It&apos;s the delivery.
              </h3>
              <p className="text-lg text-ink-muted">
                Bad tools, bad results. No amount of &quot;optimization&quot; fixes a broken system.
              </p>
            </div>
            <BeforeAfterComparison />
          </div>
        </section>

        {/* Solution */}
        <section className="py-20 bg-paper-light border-y border-rule">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl text-ink mb-4">
                Here&apos;s What We Do Differently
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-0 max-w-5xl mx-auto border border-rule rounded-md overflow-hidden">
              {[
                { icon: CheckCircle, title: "Copy That Doesn't Sound Like AI", text: 'No "excited to announce." No "innovative solutions." Clean copy that reads like a human wrote it — because the good parts, a human did.' },
                { icon: Star, title: "Feedback Before You Hit Send", text: "16 journalists review every release and tell you what's boring, what's missing, and what to cut. Fix it before the real audience sees it." },
                { icon: Send, title: "Distribution to People Who Care", text: "No junk sites. No spray-and-pray. Your release goes to journalists who opted in for your category." },
              ].map((item, i) => (
                <AnimateOnScroll key={item.title} delay={i * 100}>
                  <div className={`p-8 bg-paper-light ${i < 2 ? 'md:border-r border-b md:border-b-0 border-rule' : ''}`}>
                    <div className="w-10 h-10 bg-primary/10 rounded-sm flex items-center justify-center mb-4">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-ink mb-2">{item.title}</h3>
                    <p className="text-ink-muted text-sm leading-relaxed">{item.text}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works — editorial timeline */}
        <section id="how-it-works" className="py-20 bg-paper">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl text-ink mb-4">
                How It Works
              </h2>
              <p className="text-lg text-ink-muted max-w-2xl mx-auto">
                From &quot;I have news&quot; to &quot;journalists are reading it&quot; in 48 hours.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {[
                { step: '1', title: 'You Fill Out a Form', description: 'Company name. What happened. Why it matters. 5 minutes, tops.', icon: FileText, highlight: '5 minutes' },
                { step: '2', title: 'We Write It', description: 'AI drafts it. Humans fix it. 16 journalists tear it apart. What survives is good.', icon: Users, highlight: '16 reviewers' },
                { step: '3', title: 'You Approve It', description: 'Review the draft and feedback. Request changes or ship it. Unlimited revisions.', icon: CheckCircle, highlight: 'Unlimited revisions' },
                { step: '4', title: 'Journalists Get It', description: 'Published to our showcase and emailed to journalists who opted in for your category. Real inboxes, real people.', icon: Send, highlight: '23% pickup rate' },
              ].map((item, index) => (
                <AnimateOnScroll key={item.step} delay={index * 120}>
                  <div className="relative flex gap-6 pb-12 last:pb-0">
                    {index < 3 && (
                      <div className="absolute left-6 top-14 w-px h-full bg-rule" />
                    )}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-12 h-12 bg-ink text-paper-light rounded-sm flex items-center justify-center font-display text-xl">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1 bg-paper-light rounded-md p-6 border border-rule hover:border-ink-muted/30 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <item.icon className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                          </div>
                          <p className="text-ink-muted mb-3 text-sm">{item.description}</p>
                          <span className="inline-flex items-center font-mono text-xs text-primary bg-primary/10 px-3 py-1 rounded-sm">
                            {item.highlight}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            <div className="text-center mt-12 space-y-3">
              <Link href="/signup" data-cta="how-it-works-signup">
                <Button size="lg" className="bg-primary hover:bg-primary-700 rounded-sm">
                  Start Your Press Release
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <div>
                <Link href="/showcase" className="text-sm text-ink-muted hover:text-primary transition-colors" data-cta="how-it-works-showcase">
                  See a real example →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features — editorial grid, not icon cards */}
        <section id="features" className="py-20 bg-paper-light border-y border-rule">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl text-ink mb-4">
                What&apos;s Included
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { icon: FileText, title: 'AI + Human Writing', description: 'AI does the heavy lifting. Humans make it not sound like AI.' },
                { icon: Users, title: 'Journalist Panel Review', description: 'Real journalists flag weak leads, missing hooks, and buried news — before your audience sees it.' },
                { icon: CheckCircle, title: 'Quality Score', description: 'Every release rated on newsworthiness, clarity, and publishability.' },
                { icon: Shield, title: 'Human Quality Check', description: 'A real person reviews every release before it goes out. No garbage gets through.' },
                { icon: Send, title: 'Opt-in Distribution', description: 'Sent only to journalists who opted in for your type of news.' },
                { icon: Target, title: 'Category Newsletters', description: 'Your release appears in our weekly digest to journalists covering your industry.' },
              ].map((feature, i) => (
                <AnimateOnScroll key={feature.title} delay={i * 100}>
                  <div className="flex flex-col items-start pb-8 border-b border-rule last:border-b-0 md:border-b-0">
                    <div className="w-10 h-10 bg-paper-dark rounded-sm flex items-center justify-center mb-4">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold text-ink mb-2">{feature.title}</h3>
                    <p className="text-ink-muted text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Objection Handling */}
        <section className="py-16 bg-paper">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-accent italic text-2xl md:text-3xl text-ink mb-4">
                &ldquo;How can it be good at $9?&rdquo;
              </h2>
              <p className="text-lg text-ink-muted mb-6">
                PRWeb charges $400 to cover sales teams and legacy infrastructure.
                We use AI for first drafts and humans for the hard part — editing, feedback, quality control. Lower overhead, same result.
              </p>
              <div className="grid sm:grid-cols-3 gap-0 text-sm border border-rule rounded-md overflow-hidden">
                <div className="bg-paper-light p-5 sm:border-r border-b sm:border-b-0 border-rule">
                  <div className="font-semibold text-ink mb-1">AI handles</div>
                  <div className="text-ink-muted">First draft, formatting, AP style</div>
                </div>
                <div className="bg-paper-light p-5 sm:border-r border-b sm:border-b-0 border-rule">
                  <div className="font-semibold text-ink mb-1">Humans handle</div>
                  <div className="text-ink-muted">Editing, tone, newsworthiness</div>
                </div>
                <div className="bg-paper-light p-5">
                  <div className="font-semibold text-ink mb-1">You get</div>
                  <div className="text-ink-muted">Professional output at startup prices</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <PressReleasePreview />

        <section className="py-8 bg-paper border-y border-rule">
          <div className="container mx-auto px-4">
            <TrustBadges />
          </div>
        </section>

        <PricingSection />

        <section className="py-20 bg-paper">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl text-ink mb-4">
                Calculate Your Savings
              </h2>
              <p className="text-lg text-ink-muted max-w-2xl mx-auto">
                See how much you could save by switching to PRBuild.
              </p>
            </div>
            <SectionErrorBoundary sectionName="ROI Calculator">
              <ROICalculator />
            </SectionErrorBoundary>
          </div>
        </section>

        <section className="py-20 bg-paper-light">
          <div className="container mx-auto px-4">
            <SectionErrorBoundary sectionName="Quiz Teaser">
              <AnimateOnScroll>
                <QuizTeaser />
              </AnimateOnScroll>
            </SectionErrorBoundary>
          </div>
        </section>

        <section className="py-16 bg-paper-light">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl text-center mb-12 text-ink">
              What Our Customers Say
            </h2>
            <SectionErrorBoundary sectionName="Testimonials">
              <TestimonialsGrid />
            </SectionErrorBoundary>
          </div>
        </section>

        {/* Final CTA — dark editorial */}
        <section className="py-20 bg-ink text-paper-light">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Stop Writing Press Releases Nobody Reads
            </h2>
            <p className="text-xl text-paper-light/70 mb-8 max-w-2xl mx-auto">
              Your first release is free. No credit card. No catch.<br />
              See real journalist feedback before you spend a dollar.
            </p>
            <Link href="/signup" data-cta="final-cta-signup">
              <Button size="lg" className="bg-paper-light text-ink hover:bg-paper-dark text-lg px-8 rounded-sm">
                Get Your Free Release
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer — dark editorial */}
      <footer className="py-12 bg-ink text-ink-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-6 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-paper-light" />
                <span className="font-display text-xl text-paper-light">PRBuild</span>
              </Link>
              <p className="text-sm mb-4 text-paper-light/50">
                AI-powered press releases with human quality control. Our journalist panel reviews every release.
              </p>
              <Link href="/referral" className="text-sm text-primary hover:text-primary-400">
                Referral Program: Give $10, Get $10 →
              </Link>
            </div>

            <div>
              <h3 className="text-paper-light font-semibold mb-4 text-sm uppercase tracking-wider">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-paper-light transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-paper-light transition-colors">Pricing</Link></li>
                <li><Link href="/showcase" className="hover:text-paper-light transition-colors">Showcase</Link></li>
                <li><Link href="/compare" className="hover:text-paper-light transition-colors">Compare</Link></li>
                <li><Link href="/signup" className="hover:text-paper-light transition-colors">Get Your Free Release</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-paper-light font-semibold mb-4 text-sm uppercase tracking-wider">Use Cases</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/for/startups" className="hover:text-paper-light transition-colors">For Startups</Link></li>
                <li><Link href="/for/saas" className="hover:text-paper-light transition-colors">For SaaS</Link></li>
                <li><Link href="/for/agencies" className="hover:text-paper-light transition-colors">For Agencies</Link></li>
                <li><Link href="/for/ecommerce" className="hover:text-paper-light transition-colors">For E-commerce</Link></li>
                <li><Link href="/for/healthcare" className="hover:text-paper-light transition-colors">For Healthcare</Link></li>
                <li><Link href="/for/finance" className="hover:text-paper-light transition-colors">For Finance</Link></li>
                <li><Link href="/for/legal" className="hover:text-paper-light transition-colors">For Law Firms</Link></li>
                <li><Link href="/for/realestate" className="hover:text-paper-light transition-colors">For Real Estate</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-paper-light font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/resources/press-release-template" className="hover:text-paper-light transition-colors">Press Release Template</Link></li>
                <li><Link href="/resources/how-to-write-press-release" className="hover:text-paper-light transition-colors">How to Write a PR</Link></li>
                <li><Link href="/resources/press-release-examples" className="hover:text-paper-light transition-colors">Press Release Examples</Link></li>
                <li><Link href="/resources/pr-distribution-checklist" className="hover:text-paper-light transition-colors">Distribution Checklist</Link></li>
                <li><Link href="/resources/press-release-mistakes" className="hover:text-paper-light transition-colors">15 PR Mistakes to Avoid</Link></li>
                <li><Link href="/faq" className="hover:text-paper-light transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-paper-light font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-paper-light transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-paper-light transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-paper-light transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-paper-light transition-colors">Terms of Service</Link></li>
                <li><Link href="/journalist/subscribe" className="hover:text-paper-light transition-colors">For Journalists</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-paper-light/10 mt-8 pt-8 text-center text-sm text-paper-light/40">
            <p>&copy; {new Date().getFullYear()} PRBuild. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <SectionErrorBoundary fallback={null}>
        <ExitIntentPopup />
      </SectionErrorBoundary>
      <SectionErrorBoundary fallback={null}>
        <StickyCTA />
      </SectionErrorBoundary>
      <SectionErrorBoundary fallback={null}>
        <SocialProofTicker />
      </SectionErrorBoundary>
    </div>
  );
}
