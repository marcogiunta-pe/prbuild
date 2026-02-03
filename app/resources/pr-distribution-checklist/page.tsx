import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileText, CheckCircle, Circle, Clock, Send, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Press Release Distribution Checklist 2026 | PRBuild',
  description: 'Free press release distribution checklist. 25-point checklist covering writing, timing, distribution, and follow-up for maximum coverage.',
  keywords: [
    'press release distribution checklist',
    'press release checklist',
    'PR distribution guide',
    'how to distribute press release',
    'press release distribution tips',
  ],
  openGraph: {
    title: 'Press Release Distribution Checklist 2026 | PRBuild',
    description: 'Free 25-point checklist for press release distribution.',
  },
};

const checklistSections = [
  {
    title: 'Before You Write',
    icon: Target,
    items: [
      { text: 'Confirm your news is actually newsworthy (would a journalist care?)', critical: true },
      { text: 'Identify your target journalists and publications', critical: true },
      { text: 'Research what similar stories they\'ve covered recently', critical: false },
      { text: 'Check for competing news that day (avoid major events)', critical: false },
      { text: 'Gather all facts, quotes, and supporting data', critical: true },
    ],
  },
  {
    title: 'Writing Checklist',
    icon: FileText,
    items: [
      { text: 'Headline is under 100 characters with key news upfront', critical: true },
      { text: 'Lead paragraph answers Who, What, When, Where, Why', critical: true },
      { text: 'No "We are excited to announce" or similar clichés', critical: true },
      { text: 'Includes specific numbers and data (not vague claims)', critical: true },
      { text: 'Quote sounds human, adds perspective (not just restates facts)', critical: false },
      { text: 'Total length is 400-600 words', critical: false },
      { text: 'Boilerplate is current and concise (3-4 sentences)', critical: false },
      { text: 'Contact information is complete and tested', critical: true },
    ],
  },
  {
    title: 'Pre-Distribution',
    icon: Clock,
    items: [
      { text: 'Proofread for typos, grammar, and factual errors', critical: true },
      { text: 'All links work and go to the right pages', critical: true },
      { text: 'Embargo date/time is clearly stated (if applicable)', critical: false },
      { text: 'Images are high-resolution and properly captioned', critical: false },
      { text: 'Internal stakeholders have approved the release', critical: true },
    ],
  },
  {
    title: 'Distribution',
    icon: Send,
    items: [
      { text: 'Send Tuesday-Thursday, 9am-11am recipient\'s time zone', critical: false },
      { text: 'Personalize subject line for each key journalist', critical: true },
      { text: 'Include release in email body (not just as attachment)', critical: true },
      { text: 'BCC mass sends, or use proper PR software', critical: false },
    ],
  },
  {
    title: 'Follow-Up',
    icon: Users,
    items: [
      { text: 'Wait 24-48 hours before following up', critical: false },
      { text: 'Follow-up email is short (2-3 sentences max)', critical: true },
      { text: 'Track opens, clicks, and responses', critical: false },
      { text: 'Respond to journalist questions within 2 hours', critical: true },
      { text: 'Share coverage on your social channels', critical: false },
    ],
  },
];

export default function PRDistributionChecklistPage() {
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
              Let Us Handle It →
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            Free Resource
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Press Release Distribution<br />
            <span className="text-primary">Checklist</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            25-point checklist to make sure your press release gets maximum coverage.
            Used by PR professionals and startups alike.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span>25 Items</span>
            <span>•</span>
            <span>5 Sections</span>
            <span>•</span>
            <span>Print-friendly</span>
          </div>
        </div>
      </section>

      {/* Legend */}
      <section className="py-8 bg-gray-50 border-y">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Critical (don't skip)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span>Recommended</span>
            </div>
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-12">
            {checklistSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                </div>
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <label 
                      key={itemIndex} 
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="flex-1">
                        {item.text}
                        {item.critical && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            Critical
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pro Tips */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Pro Tips</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-2">Best Days to Send</h3>
              <p className="text-gray-600 text-sm">Tuesday, Wednesday, and Thursday get the highest open rates. Avoid Monday (inbox overload) and Friday (weekend mode).</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-2">Best Time to Send</h3>
              <p className="text-gray-600 text-sm">9am-11am in the journalist's time zone. Early enough to make the day's coverage, late enough that they're at their desk.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-2">Follow-Up Rule</h3>
              <p className="text-gray-600 text-sm">One follow-up, 24-48 hours later. Keep it to 2-3 sentences. More than that crosses into annoying territory.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Related Resources</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Link href="/resources/press-release-template" className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-primary transition-colors">
              <h3 className="font-semibold text-lg mb-2">Press Release Template</h3>
              <p className="text-gray-600 text-sm mb-4">Copy-paste template with formatting guide.</p>
              <span className="text-primary text-sm font-medium flex items-center gap-1">
                Get Template <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link href="/resources/press-release-examples" className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-primary transition-colors">
              <h3 className="font-semibold text-lg mb-2">Press Release Examples</h3>
              <p className="text-gray-600 text-sm mb-4">Real examples that got coverage.</p>
              <span className="text-primary text-sm font-medium flex items-center gap-1">
                See Examples <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Want Us to Handle the Checklist?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            We'll write your press release, check every box, and distribute it to relevant journalists.
            First one's free.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Get Your Free Press Release
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
