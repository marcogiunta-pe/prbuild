import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileText, Copy, Check, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Free Press Release Template 2026 | PRBuild',
  description: 'Download our free press release template. Includes formatting guide, examples, and tips from journalists. Used by 500+ companies.',
  keywords: [
    'press release template',
    'free press release template',
    'press release format',
    'how to write a press release',
    'press release example',
    'press release template word',
    'press release structure',
  ],
  openGraph: {
    title: 'Free Press Release Template 2026 | PRBuild',
    description: 'Professional press release template with formatting guide and examples.',
  },
};

const templateSections = [
  {
    title: 'FOR IMMEDIATE RELEASE',
    content: '[Always include this or specify an embargo date]',
    tip: 'This tells journalists they can publish immediately.',
  },
  {
    title: 'Headline',
    content: '[Company] [Action] [Result/Benefit]',
    example: 'TechCorp Launches AI-Powered Analytics Platform, Cuts Data Processing Time by 90%',
    tip: 'Keep it under 100 characters. Lead with the most newsworthy element.',
  },
  {
    title: 'Subheadline (Optional)',
    content: '[Additional context or key benefit]',
    example: 'New platform processes 1TB of data in under 60 seconds, available to enterprises today',
    tip: 'Use this to add a secondary angle or key statistic.',
  },
  {
    title: 'Dateline',
    content: '[CITY, STATE] — [Date] —',
    example: 'SAN FRANCISCO, CA — January 15, 2026 —',
    tip: 'Use AP style for dates and locations.',
  },
  {
    title: 'Lead Paragraph',
    content: 'The first paragraph answers WHO, WHAT, WHEN, WHERE, and WHY. This is the most important paragraph—many journalists only read this far.',
    example: 'TechCorp, a leader in enterprise data solutions, today announced the launch of DataStream AI, an analytics platform that reduces data processing time by up to 90% compared to traditional methods. The platform is available immediately to enterprise customers.',
    tip: 'Front-load the news. Assume readers only read this paragraph.',
  },
  {
    title: 'Body Paragraphs',
    content: 'Expand on the announcement with supporting details, statistics, and context. Each paragraph should cover one idea.',
    example: 'DataStream AI uses proprietary machine learning algorithms to optimize query patterns in real-time. In beta testing with 50 enterprise customers, the platform consistently processed complex analytics jobs 10x faster than existing solutions.\n\nThe platform integrates with existing data warehouses including Snowflake, Databricks, and BigQuery, requiring no migration or infrastructure changes.',
    tip: 'Include specific numbers and data. Journalists love statistics.',
  },
  {
    title: 'Quote',
    content: 'Include a quote from a company executive that adds perspective or emotion—not just restating the facts.',
    example: '"Data teams spend 80% of their time waiting for queries to complete," said Jane Smith, CEO of TechCorp. "DataStream AI gives them that time back to focus on insights that actually move the business forward."',
    tip: 'Quotes should sound human, not corporate. Avoid "We are excited to announce."',
  },
  {
    title: 'Boilerplate',
    content: 'A standard paragraph about your company that appears at the end of every press release.',
    example: 'About TechCorp: TechCorp is an enterprise data solutions company helping organizations process and analyze data faster. Founded in 2020, TechCorp serves over 500 enterprise customers including Fortune 500 companies. Learn more at techcorp.com.',
    tip: 'Keep it to 3-4 sentences. Update it quarterly.',
  },
  {
    title: 'Contact Information',
    content: 'Media Contact:\n[Name]\n[Title]\n[Email]\n[Phone]',
    example: 'Media Contact:\nSarah Johnson\nHead of Communications\npress@techcorp.com\n(555) 123-4567',
    tip: 'Use a dedicated press email. Respond within 2 hours during business days.',
  },
  {
    title: '###',
    content: '[Standard end mark for press releases]',
    tip: 'This tells journalists they\'ve reached the end.',
  },
];

export default function PressReleaseTemplatePage() {
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
      <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FileText className="w-4 h-4" />
            Free Resource
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Press Release Template<br />
            <span className="text-primary">That Actually Works</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            The exact format used by thousands of companies to get media coverage. 
            Includes tips from journalists on what they actually want to see.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#template">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                View Template
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline">
                Or Let Us Write It For You
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold mb-1">400-600</div>
              <div className="text-white/80 text-sm">Ideal word count</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-1">1</div>
              <div className="text-white/80 text-sm">Announcement per release</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-1">3-5</div>
              <div className="text-white/80 text-sm">Paragraphs in body</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-1">1-2</div>
              <div className="text-white/80 text-sm">Quotes maximum</div>
            </div>
          </div>
        </div>
      </section>

      {/* Template */}
      <section id="template" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            The Complete Press Release Template
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-8">
            {templateSections.map((section, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="font-bold text-lg">{section.title}</h3>
                </div>
                <div className="p-6">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 font-mono text-sm">
                    {section.content}
                  </div>
                  {section.example && (
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-gray-500 mb-2">Example:</div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm whitespace-pre-wrap">
                        {section.example}
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-primary">💡</span>
                    <span>{section.tip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Common Mistakes to Avoid
          </h2>
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-red-200">
              <div className="text-red-500 font-semibold mb-2">❌ Don't</div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Start with "We are excited to announce..."</li>
                <li>• Use jargon or buzzwords</li>
                <li>• Write more than 600 words</li>
                <li>• Include multiple announcements</li>
                <li>• Forget the contact information</li>
                <li>• Use a generic subject line when emailing</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl border border-green-200">
              <div className="text-green-500 font-semibold mb-2">✓ Do</div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Lead with the news</li>
                <li>• Include specific numbers and data</li>
                <li>• Make it easy to skim</li>
                <li>• Include a human-sounding quote</li>
                <li>• Provide contact for follow-up</li>
                <li>• Personalize outreach to journalists</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Don't Want to Write It Yourself?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            We'll write your press release, have it reviewed by 16 journalist personas, 
            and distribute it to relevant media. First one's free.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Get Your Free Press Release
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-white/60 mt-4">
            No credit card required • 24-hour turnaround
          </p>
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
