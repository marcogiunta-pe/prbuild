import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileText, Check, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmailCapture } from '@/components/EmailCapture';
import { checklistCategories } from '@/data/checklist';

export const metadata: Metadata = {
  title: '23 Things Journalists Check Before They Delete Your Press Release | PRBuild',
  description: 'The 23-point checklist journalists use to decide if your press release is worth covering. Based on data from 847+ releases and 2,400+ journalist relationships.',
  keywords: [
    'press release checklist',
    'press release mistakes',
    'journalist tips',
    'PR checklist',
    'how to write a press release',
    'press release best practices',
  ],
  openGraph: {
    title: '23 Things Journalists Check Before They Delete Your Press Release | PRBuild',
    description: 'The 23-point checklist journalists use to decide if your press release is worth covering.',
  },
  alternates: { canonical: 'https://prbuild.ai/resources/press-release-checklist' },
};

export default function PressReleaseChecklistPage() {
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
              Get Free Release &rarr;
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Check className="w-4 h-4" />
            Free Checklist
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            23 Things Journalists Check<br />
            <span className="text-primary">Before They Hit Delete</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Based on data from 847+ published releases and relationships with 2,400+ journalists,
            here&apos;s exactly what separates press releases that get coverage from the 97% that get ignored.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#checklist">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                Get the Checklist
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/resources/pr-score">
              <Button size="lg" variant="outline">
                Grade Your Press Release
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold mb-1">97%</div>
              <div className="text-white/80 text-sm">of press releases get ignored</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-1">23%</div>
              <div className="text-white/80 text-sm">our average pickup rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-1">2,400+</div>
              <div className="text-white/80 text-sm">journalist relationships</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-1">847+</div>
              <div className="text-white/80 text-sm">releases published</div>
            </div>
          </div>
        </div>
      </section>

      {/* The 23-Item Checklist */}
      <section id="checklist" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            The Complete 23-Point Checklist
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Every item on this list is something we&apos;ve seen journalists check (consciously or not)
            when deciding whether to cover a story or hit delete.
          </p>

          <div className="max-w-3xl mx-auto space-y-12">
            {checklistCategories.map((category, catIndex) => {
              const startNumber = checklistCategories
                .slice(0, catIndex)
                .reduce((sum, cat) => sum + cat.items.length, 0) + 1;

              return (
                <div key={catIndex}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  <div className="space-y-4">
                    {category.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex gap-4 p-4 rounded-xl border border-gray-200 hover:border-primary/30 hover:bg-blue-50/30 transition-colors"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                          {startNumber + itemIndex}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section id="download" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <EmailCapture
              variant="card"
              title="Get the printable checklist"
              description="We'll send the full 23-point checklist as a PDF you can reference before every press release."
              buttonText="Send Me the Checklist"
              successMessage="Check your inbox! The checklist is on its way."
              leadSource="checklist"
            />
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why This Matters
          </h2>
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-red-200">
              <div className="flex items-center gap-2 text-red-500 font-semibold mb-4">
                <X className="w-5 h-5" />
                What journalists actually see
              </div>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  A generic subject line they&apos;ve seen 50 times today
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  &ldquo;We&apos;re excited to announce&rdquo; as the first words
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  No clear news hook or why-now angle
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  Buzzwords instead of real numbers
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  800+ words with no formatting
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 text-green-500 font-semibold mb-4">
                <Check className="w-5 h-5" />
                What you think they see
              </div>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  Your carefully crafted announcement
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  A professional-sounding opening
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  Your company&apos;s impressive story
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  Industry-standard language
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  Thorough, comprehensive detail
                </li>
              </ul>
            </div>
          </div>
          <p className="text-center text-gray-500 mt-8 max-w-xl mx-auto">
            The gap between perception and reality is why 97% of press releases get ignored.
            This checklist closes that gap.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Don&apos;t Want to Check 23 Things Yourself?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            We handle every item on this checklist automatically. Write your release,
            get it journalist-reviewed, and distribute it to the right people. First one&apos;s free.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Get Your Free Press Release
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-white/60 mt-4">
            No credit card required &bull; 24-hour turnaround
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} PRBuild. All rights reserved. |{' '}
            <Link href="/privacy" className="hover:text-white">Privacy</Link> |{' '}
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
