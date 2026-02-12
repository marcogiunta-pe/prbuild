'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="flex flex-col min-h-screen">
      {/* Navigation — sticky, shrinks and gets shadow after hero */}
      <header
        className={`sticky top-0 z-50 w-full border-b backdrop-blur transition-all duration-300 ${
          navScrolled ? 'bg-white/98 shadow-md py-2' : 'bg-white/95 py-0'
        } border-gray-200`}
      >
        <div className={`container mx-auto flex items-center justify-between px-4 transition-all duration-300 ${navScrolled ? 'h-14' : 'h-16'}`}>
          <Link href="/" className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">PRBuild</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {NAV_SECTIONS.map(({ id, label }) => (
              <Link
                key={id}
                href={`#${id}`}
                className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === id ? 'text-primary' : 'text-gray-600'}`}
                aria-current={activeSection === id ? 'true' : undefined}
              >
                {label}
              </Link>
            ))}
            <Link href="/showcase" className="text-sm font-medium text-gray-600 hover:text-primary" data-cta="nav-showcase">
              Showcase
            </Link>
            <Link href="/resources/how-to-write-press-release" className="text-sm font-medium text-gray-600 hover:text-primary" data-cta="nav-resources">
              Resources
            </Link>
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-primary" data-cta="nav-login">
              Login
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            <Link href="/signup" className="hidden sm:block" data-cta="nav-signup">
              <Button className="bg-secondary hover:bg-secondary/90 min-h-[44px]">
                Get Your Free Release
              </Button>
            </Link>
            <button
              type="button"
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-1">
              <Link href="#features" className="min-h-[44px] flex items-center text-sm font-medium text-gray-600 hover:text-primary touch-manipulation" onClick={() => setMobileMenuOpen(false)} data-cta="mobile-features">
                Features
              </Link>
              <Link href="#pricing" className="min-h-[44px] flex items-center text-sm font-medium text-gray-600 hover:text-primary touch-manipulation" onClick={() => setMobileMenuOpen(false)} data-cta="mobile-pricing">
                Pricing
              </Link>
              <Link href="/showcase" className="min-h-[44px] flex items-center text-sm font-medium text-gray-600 hover:text-primary touch-manipulation" onClick={() => setMobileMenuOpen(false)} data-cta="mobile-showcase">
                Showcase
              </Link>
              <Link href="/resources/how-to-write-press-release" className="min-h-[44px] flex items-center text-sm font-medium text-gray-600 hover:text-primary touch-manipulation" onClick={() => setMobileMenuOpen(false)} data-cta="mobile-resources">
                Resources
              </Link>
              <Link href="/login" className="min-h-[44px] flex items-center text-sm font-medium text-gray-600 hover:text-primary touch-manipulation" onClick={() => setMobileMenuOpen(false)} data-cta="mobile-login">
                Login
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="mt-2" data-cta="mobile-signup">
                <Button className="w-full bg-secondary hover:bg-secondary/90 min-h-[44px] touch-manipulation">
                  Get Your Free Release
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-fade-up" style={{ animationDuration: '0.5s' }}>
                <Badge variant="secondary" className="mb-4">
                  847 releases published • 23% journalist pickup rate
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto leading-tight">
                  97% of Press Releases Get Ignored.<br className="hidden md:block" /> Yours Won&apos;t.
                </h1>
              </div>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                You get a press release that 16 journalists already tried to kill. What survived is what gets published.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                <Link href="/signup" data-cta="hero-signup">
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-lg px-8 min-h-[44px] touch-manipulation">
                    Get Your First Release Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#how-it-works" data-cta="hero-how-it-works">
                  <Button size="lg" variant="outline" className="text-lg px-8 min-h-[44px] touch-manipulation">
                    See how it works
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-gray-500 mb-8">No credit card required • Setup in 2 minutes</p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600 mb-8">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Written in 24–48 hours
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Pre-screened by our journalist panel
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Sent to journalists who actually want it
                </div>
              </div>

              <TrustBadgesCompact />
            </div>

            {/* Product Mockup — parallax tilt, pulse glow, animated score */}
            <AnimateOnScroll>
              <HeroMockup />
            </AnimateOnScroll>

            <LogoBar />
          </div>
        </section>

        <AnimatedStatsBanner />

        {/* Pain Points */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                You&apos;ve Tried This Before
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                <Link href="/compare/prweb" className="text-primary hover:underline">$400 to PRWeb</Link>. Zero coverage. Sound familiar?
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { icon: AlertTriangle, title: 'ChatGPT Press Releases', items: ['"We are excited to announce..." — delete.', 'Journalists spot AI copy instantly', 'You end up rewriting 75% anyway'] },
                { icon: Target, title: 'Wire Services', items: ['$400 to "distribute" to nobody', 'Published on sites with 12 monthly visitors', 'Real journalists never see it'] },
                { icon: Users, title: 'PR Agencies', items: ['$3,000/month retainer', '5 rounds of revision, still bland', 'No guarantee anyone reads it'] },
              ].map((card, i) => (
                <AnimateOnScroll key={card.title} delay={i * 100}>
                  <Card className="border-amber-200 bg-amber-50/50">
                    <CardHeader>
                      <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                        <card.icon className="h-6 w-6 text-amber-600" />
                      </div>
                      <CardTitle className="text-xl text-gray-900">{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-gray-600 space-y-2 text-sm">
                        {card.items.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="text-amber-500 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </AnimateOnScroll>
              ))}
            </div>

            <div className="mt-16 max-w-3xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                The problem isn&apos;t your news. It&apos;s the delivery.
              </h3>
              <p className="text-lg text-gray-600">
                Bad tools, bad results. No amount of &quot;optimization&quot; fixes a broken system.
              </p>
            </div>
            <BeforeAfterComparison />
          </div>
        </section>

        {/* Solution */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Here&apos;s What We Do Differently
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { icon: CheckCircle, title: "Copy That Doesn't Sound Like AI", text: 'No "excited to announce." No "innovative solutions." Clean copy that reads like a human wrote it — because the good parts, a human did.' },
                { icon: Star, title: "Feedback Before You Hit Send", text: "16 journalists review every release and tell you what's boring, what's missing, and what to cut. Fix it before the real audience sees it." },
                { icon: Send, title: "Distribution to People Who Care", text: "No junk sites. No spray-and-pray. Your release goes to journalists who opted in for your category." },
              ].map((item, i) => (
                <AnimateOnScroll key={item.title} delay={i * 100}>
                  <Card className="border-green-100 bg-green-50/50">
                    <CardHeader>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <item.icon className="h-6 w-6 text-green-600" />
                      </div>
                      <CardTitle className="text-xl text-gray-900">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{item.text}</p>
                    </CardContent>
                  </Card>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
                      <div className="absolute left-6 top-14 w-0.5 h-full bg-gradient-to-b from-primary to-primary/30" />
                    )}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg shadow-primary/30">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <item.icon className="h-5 w-5 text-primary" />
                            <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                          </div>
                          <p className="text-gray-600 mb-3">{item.description}</p>
                          <span className="inline-flex items-center text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                            {item.highlight}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/signup" data-cta="how-it-works-signup">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                  Start Your Press Release
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
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
                  <div className="flex flex-col items-start">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Objection Handling */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                &ldquo;How can it be good at $9/month?&rdquo;
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                PRWeb charges $400 to cover sales teams and legacy infrastructure.
                We use AI for first drafts and humans for the hard part — editing, feedback, quality control. Lower overhead, same result.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="font-semibold text-gray-900 mb-1">AI handles</div>
                  <div className="text-gray-600">First draft, formatting, AP style</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="font-semibold text-gray-900 mb-1">Humans handle</div>
                  <div className="text-gray-600">Editing, tone, newsworthiness</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="font-semibold text-gray-900 mb-1">You get</div>
                  <div className="text-gray-600">Professional output at startup prices</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <PressReleasePreview />

        <section className="py-8 bg-gray-50 border-y border-gray-100">
          <div className="container mx-auto px-4">
            <TrustBadges />
          </div>
        </section>

        <PricingSection />

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Calculate Your Savings
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                See how much you could save by switching to PRBuild.
              </p>
            </div>
            <SectionErrorBoundary sectionName="ROI Calculator">
              <ROICalculator />
            </SectionErrorBoundary>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <SectionErrorBoundary sectionName="Quiz Teaser">
              <AnimateOnScroll>
                <QuizTeaser />
              </AnimateOnScroll>
            </SectionErrorBoundary>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              What Our Customers Say
            </h2>
            <SectionErrorBoundary sectionName="Testimonials">
              <TestimonialsGrid />
            </SectionErrorBoundary>
          </div>
        </section>

        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stop Writing Press Releases Nobody Reads
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Your first release is free. No credit card. No catch.<br />
              See real journalist feedback before you spend a dollar.
            </p>
            <Link href="/signup" data-cta="final-cta-signup">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 text-lg px-8">
                Get Your Free Release
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-6 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <FileText className="h-6 w-6 text-white" />
                <span className="text-xl font-bold text-white">PRBuild</span>
              </Link>
              <p className="text-sm mb-4">
                AI-powered press releases with human quality control. Our journalist panel reviews every release.
              </p>
              <Link href="/referral" className="text-sm text-secondary hover:text-secondary/80">
                Referral Program: Give $10, Get $10 →
              </Link>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-white">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/showcase" className="hover:text-white">Showcase</Link></li>
                <li><Link href="/compare" className="hover:text-white">Compare</Link></li>
                <li><Link href="/signup" className="hover:text-white">Get Your Free Release</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Use Cases</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/for/startups" className="hover:text-white">For Startups</Link></li>
                <li><Link href="/for/saas" className="hover:text-white">For SaaS</Link></li>
                <li><Link href="/for/agencies" className="hover:text-white">For Agencies</Link></li>
                <li><Link href="/for/ecommerce" className="hover:text-white">For E-commerce</Link></li>
                <li><Link href="/for/healthcare" className="hover:text-white">For Healthcare</Link></li>
                <li><Link href="/for/finance" className="hover:text-white">For Finance</Link></li>
                <li><Link href="/for/legal" className="hover:text-white">For Law Firms</Link></li>
                <li><Link href="/for/realestate" className="hover:text-white">For Real Estate</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/resources/press-release-template" className="hover:text-white">Press Release Template</Link></li>
                <li><Link href="/resources/how-to-write-press-release" className="hover:text-white">How to Write a PR</Link></li>
                <li><Link href="/resources/press-release-examples" className="hover:text-white">Press Release Examples</Link></li>
                <li><Link href="/resources/pr-distribution-checklist" className="hover:text-white">Distribution Checklist</Link></li>
                <li><Link href="/resources/press-release-mistakes" className="hover:text-white">15 PR Mistakes to Avoid</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/journalist/subscribe" className="hover:text-white">For Journalists</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} PRBuild. All rights reserved.</p>
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
