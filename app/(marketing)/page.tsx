// app/(marketing)/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileText, Users, Send, Zap, Target, Shield, ArrowRight, Check, Star, Menu, X, ChevronDown, AlertTriangle, Quote } from 'lucide-react';
import { PricingSection } from '@/components/landing/pricing-section';
import { ExitIntentPopup } from '@/components/ExitIntent';
import { StickyCTA } from '@/components/StickyCTA';
import { AnimatedStatsBanner } from '@/components/AnimatedStats';
import { ROICalculator } from '@/components/ROICalculator';
import { TestimonialsCarousel } from '@/components/TestimonialsCarousel';
import { TrustBadges } from '@/components/TrustBadges';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">PRBuild</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-primary">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-gray-600 hover:text-primary">
              Pricing
            </Link>
            <Link href="/showcase" className="text-sm font-medium text-gray-600 hover:text-primary">
              Showcase
            </Link>
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-primary">
              Login
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href="/signup" className="hidden sm:block">
              <Button className="bg-secondary hover:bg-secondary/90">
                Start Free Trial
              </Button>
            </Link>
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                Features
              </Link>
              <Link href="#pricing" className="text-sm font-medium text-gray-600 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </Link>
              <Link href="/showcase" className="text-sm font-medium text-gray-600 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                Showcase
              </Link>
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-secondary hover:bg-secondary/90">
                  Start Free Trial
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              847 releases published • 23% journalist pickup rate
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto leading-tight">
              97% of Press Releases Get Ignored.<br className="hidden md:block" /> Yours Won't.
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We write it. 16 journalists rip it apart. You get what survives.
            </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                <Link href="/signup">
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-lg px-8">
                    Get Your First Release Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/showcase">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    See Published Releases
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-gray-500 mb-8">No credit card required • Setup in 2 minutes</p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600 mb-12">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Written in 24 hours
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Reviewed by 16 journalist personas
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Sent to journalists who actually want it
                </div>
              </div>
            </div>

            {/* Product Mockup */}
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                {/* Browser Chrome */}
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white rounded-md px-3 py-1 text-xs text-gray-500 max-w-md mx-auto">
                      app.prbuild.com/dashboard
                    </div>
                  </div>
                </div>
                {/* App Preview */}
                <div className="p-6 bg-gray-50">
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Sidebar */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-sm font-semibold text-gray-900 mb-3">Your Releases</div>
                      <div className="space-y-2">
                        <div className="bg-green-50 border border-green-200 rounded-md p-2 text-xs">
                          <div className="font-medium text-green-800">TechCorp Launch</div>
                          <div className="text-green-600">Published • 847 views</div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-2 text-xs">
                          <div className="font-medium text-blue-800">Q4 Results</div>
                          <div className="text-blue-600">In Review</div>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-md p-2 text-xs">
                          <div className="font-medium text-gray-800">Partnership News</div>
                          <div className="text-gray-600">Draft</div>
                        </div>
                      </div>
                    </div>
                    {/* Main Content */}
                    <div className="md:col-span-2 bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm font-semibold text-gray-900">Panel Feedback</div>
                        <Badge className="bg-green-100 text-green-800 text-xs">Score: 8.5/10</Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="flex gap-3 text-xs">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <Users className="w-4 h-4 text-primary" />
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2 flex-1">
                            <div className="font-medium text-gray-900">Tech Journalist</div>
                            <div className="text-gray-600">"Strong headline. Add specific metrics in paragraph 2."</div>
                          </div>
                        </div>
                        <div className="flex gap-3 text-xs">
                          <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <Star className="w-4 h-4 text-secondary" />
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2 flex-1">
                            <div className="font-medium text-gray-900">PR Expert</div>
                            <div className="text-gray-600">"Quote placement is perfect. Consider adding a call-to-action."</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Logos */}
            <div className="mt-16 text-center">
              <p className="text-sm text-gray-500 mb-6">Trusted by teams at</p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60 grayscale">
                <div className="text-xl font-bold text-gray-400">TechCrunch</div>
                <div className="text-xl font-bold text-gray-400">Forbes</div>
                <div className="text-xl font-bold text-gray-400">Wired</div>
                <div className="text-xl font-bold text-gray-400">VentureBeat</div>
                <div className="text-xl font-bold text-gray-400">Inc.</div>
              </div>
            </div>
          </div>
        </section>

        {/* Animated Stats Banner */}
        <AnimatedStatsBanner />

        {/* Pain Points Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                You've Tried This Before
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                $400 to PRWeb. 2 clicks. Zero coverage. Sound about right?
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="border-amber-200 bg-amber-50/50">
                <CardHeader>
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl">ChatGPT Press Releases</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      "We are excited to announce..." (delete)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      Journalists spot AI copy in 3 seconds
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      You rewrite 75% of it anyway
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50/50">
                <CardHeader>
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl">Wire Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      $400 for "distribution" to nobody
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      Published on sites with 12 monthly visitors
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      Real journalists? Never saw it.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50/50">
                <CardHeader>
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl">PR Agencies</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      $3,000/month retainer
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      5 rounds of "can we tweak this?"
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      Still no guarantee anyone reads it
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-16 max-w-3xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                The problem isn't your news. It's the delivery.
              </h3>
              <p className="text-lg text-gray-600">
                Bad tools = bad results. No amount of "optimization" fixes a broken system.
              </p>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Here's What Changes
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="border-green-100 bg-green-50/50">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Copy That Doesn't Sound Like AI</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    No "excited to announce." No "innovative solutions." 
                    Just clean, punchy copy that reads like a human wrote it. Because the good parts? A human did.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-100 bg-green-50/50">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Feedback Before You Hit Send</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    16 journalist personas review every release. They tell you what's boring, what's missing, 
                    and what will get deleted. Fix it before journalists ever see it.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-100 bg-green-50/50">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Send className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Distribution to People Who Care</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    No junk sites. No spray-and-pray. We send your release to journalists who 
                    actually opted in to receive news in your category. They want to hear from you.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works - Vertical Timeline */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From "I have news" to "journalists are reading it" in 48 hours.
              </p>
            </div>

            {/* Vertical Timeline */}
            <div className="max-w-3xl mx-auto">
              {[
                {
                  step: '1',
                  title: 'You Fill Out a Form',
                  description: 'Company name. What happened. Why it matters. That\'s it. 5 minutes, tops.',
                  icon: FileText,
                  highlight: '5 minutes',
                },
                {
                  step: '2',
                  title: 'We Write It',
                  description: 'Our AI drafts it. Our humans fix it. 16 journalist personas tear it apart. What survives is good.',
                  icon: Users,
                  highlight: '16 reviewers',
                },
                {
                  step: '3',
                  title: 'You Approve It',
                  description: 'See the draft. See the feedback. Request changes or ship it. We revise until you\'re happy.',
                  icon: CheckCircle,
                  highlight: 'Unlimited revisions',
                },
                {
                  step: '4',
                  title: 'Journalists Get It',
                  description: 'Published to our showcase. Emailed to journalists who opted in for your category. Real inboxes. Real people.',
                  icon: Send,
                  highlight: '23% pickup rate',
                },
              ].map((item, index) => (
                <div key={item.step} className="relative flex gap-6 pb-12 last:pb-0">
                  {/* Vertical Line */}
                  {index < 3 && (
                    <div className="absolute left-6 top-14 w-0.5 h-full bg-gradient-to-b from-primary to-primary/30" />
                  )}
                  
                  {/* Step Number Circle */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg shadow-primary/30">
                      {item.step}
                    </div>
                  </div>
                  
                  {/* Content Card */}
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
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/signup">
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
                What's Included
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: FileText,
                  title: 'AI + Human Writing',
                  description: 'AI does the heavy lifting. Humans make it not sound like AI. Best of both.',
                },
                {
                  icon: Users,
                  title: '16 Journalist Reviewers',
                  description: 'Tech reporter. Business editor. Lifestyle writer. They all review your release before you see it.',
                },
                {
                  icon: CheckCircle,
                  title: 'Quality Score',
                  description: 'See your release rated on newsworthiness, clarity, and "would I actually publish this?"',
                },
                {
                  icon: Shield,
                  title: 'Human Quality Check',
                  description: 'A real person reviews every release before it goes out. No garbage gets through.',
                },
                {
                  icon: Send,
                  title: 'Opt-in Distribution',
                  description: 'Sent to journalists who raised their hand and said "yes, send me this type of news."',
                },
                {
                  icon: Target,
                  title: 'Category Newsletters',
                  description: 'Your release goes in our weekly digest to journalists covering your industry.',
                },
              ].map((feature) => (
                <div key={feature.title} className="flex flex-col items-start">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <PricingSection />

        {/* ROI Calculator */}
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
            <ROICalculator />
          </div>
        </section>

        {/* Testimonials Carousel */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              What Our Customers Say
            </h2>
            <TestimonialsCarousel />
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-8 bg-gray-50 border-y border-gray-100">
          <div className="container mx-auto px-4">
            <TrustBadges />
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stop Writing Press Releases Nobody Reads
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Your first release is free. No credit card. No catch.<br />
              If journalists don't engage, you paid nothing.
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 text-lg px-8">
                Get Your Free Release
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="mt-4 text-white/60 text-sm">
              847 releases published • 23% journalist pickup rate
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-6 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <FileText className="h-6 w-6 text-white" />
                <span className="text-xl font-bold text-white">PRBuild</span>
              </Link>
              <p className="text-sm mb-4">
                AI-powered press releases with human quality control. 16 journalist personas review every release.
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
                <li><Link href="/signup" className="hover:text-white">Start Free Trial</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Use Cases</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/for/startups" className="hover:text-white">For Startups</Link></li>
                <li><Link href="/for/saas" className="hover:text-white">For SaaS</Link></li>
                <li><Link href="/for/agencies" className="hover:text-white">For Agencies</Link></li>
                <li><Link href="/for/ecommerce" className="hover:text-white">For E-commerce</Link></li>
                <li><Link href="/for/nonprofits" className="hover:text-white">For Nonprofits</Link></li>
                <li><Link href="/for/healthcare" className="hover:text-white">For Healthcare</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/resources/press-release-template" className="hover:text-white">Press Release Template</Link></li>
                <li><Link href="/resources/how-to-write-press-release" className="hover:text-white">How to Write a PR</Link></li>
                <li><Link href="/resources/press-release-examples" className="hover:text-white">Press Release Examples</Link></li>
                <li><Link href="/resources/pr-distribution-checklist" className="hover:text-white">Distribution Checklist</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/compare/prweb" className="hover:text-white">vs PRWeb</Link></li>
                <li><Link href="/compare/cision" className="hover:text-white">vs Cision</Link></li>
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

      {/* Conversion Components */}
      <ExitIntentPopup />
      <StickyCTA />
    </div>
  );
}
