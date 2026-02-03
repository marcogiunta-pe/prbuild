import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileText, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'How to Write a Press Release (2026 Guide) | PRBuild',
  description: 'Learn how to write a press release that gets coverage. Step-by-step guide with examples, templates, and tips from journalists.',
  keywords: [
    'how to write a press release',
    'press release writing guide',
    'press release tips',
    'write press release step by step',
    'press release best practices',
    'press release for beginners',
  ],
  openGraph: {
    title: 'How to Write a Press Release (2026 Guide) | PRBuild',
    description: 'Step-by-step guide to writing press releases that journalists actually want to cover.',
  },
};

const steps = [
  {
    number: 1,
    title: 'Start with a Newsworthy Angle',
    content: `Before you write a word, ask yourself: "Why would a journalist care about this?" If you can't answer that question, your news might not be ready for a press release.

**Newsworthy angles include:**
- Something genuinely new (product, feature, service)
- Significant numbers (revenue, users, growth)
- Timely relevance (trends, current events)
- Human interest (founder story, customer impact)
- Controversy or contrarian take

**Not newsworthy:**
- Minor updates or bug fixes
- Self-congratulatory announcements
- News that's only interesting to your company`,
    tip: 'Put yourself in the journalist\'s shoes. They receive hundreds of pitches daily. What makes yours worth their time?',
  },
  {
    number: 2,
    title: 'Write a Compelling Headline',
    content: `Your headline is everything. 90% of journalists decide whether to read further based on the headline alone.

**Great headline formula:**
[Company] + [Action verb] + [Result/Benefit]

**Examples:**
✓ "DataSync Launches AI Analytics Platform, Cuts Processing Time by 90%"
✓ "GreenTech Raises $5M to Expand Sustainable Packaging Nationwide"
✓ "HomeChef Hits 1 Million Subscribers, Expands to 15 New Markets"

**Avoid:**
✗ "Company XYZ Announces Exciting New Partnership"
✗ "We Are Thrilled to Share Our Latest Innovation"
✗ Anything over 100 characters`,
    tip: 'Test your headline: Would you click on this if you saw it in your inbox? Be honest.',
  },
  {
    number: 3,
    title: 'Nail the Lead Paragraph',
    content: `The first paragraph must answer the 5 Ws: Who, What, When, Where, Why. Many journalists only read this far—make it count.

**Structure:**
[Company name], [brief descriptor], today announced [the news]. [Key benefit or impact]. [Availability or timing].

**Example:**
"DataSync, a leader in enterprise data solutions, today announced the launch of DataStream AI, an analytics platform that reduces data processing time by up to 90%. The platform is available immediately to enterprise customers worldwide, with pricing starting at $500/month."

In 50 words, we've covered: who (DataSync), what (new platform), when (today), where (worldwide), why (90% faster), and even pricing.`,
    tip: 'Write this paragraph last. Once you\'ve written everything else, you\'ll know exactly what the most important points are.',
  },
  {
    number: 4,
    title: 'Add Supporting Details',
    content: `The body paragraphs expand on your announcement with specifics. Each paragraph should cover one idea.

**Include:**
- Specific numbers and data (not "significant growth" but "247% year-over-year growth")
- How it works (brief, non-technical explanation)
- Who benefits and how
- Context (market size, problem being solved)
- Social proof (beta customers, early results)

**Paragraph order:**
1. Most important supporting detail
2. Second most important
3. Context/background
4. Future implications

Journalists may cut from the bottom up, so put the most essential info first.`,
    tip: 'Every sentence should either inform or persuade. Cut anything that does neither.',
  },
  {
    number: 5,
    title: 'Include a Human Quote',
    content: `Quotes add personality and credibility. But they need to sound human, not corporate.

**Good quote characteristics:**
- Adds perspective the facts can't convey
- Sounds like something a real person would say
- Expresses opinion or emotion
- Provides insider insight

**Bad quotes (avoid):**
✗ "We are excited to announce..."
✗ "This represents a significant milestone..."
✗ "We believe this will revolutionize..."

**Better:**
✓ "Data teams spend 80% of their time waiting. We built DataStream to give them that time back."
✓ "When we hit $1M ARR in month six, we knew we were onto something bigger than we'd imagined."`,
    tip: 'Read your quote out loud. If it sounds like corporate speak, rewrite it until it sounds like coffee-with-a-friend speak.',
  },
  {
    number: 6,
    title: 'Write Your Boilerplate',
    content: `The boilerplate is a standard paragraph about your company that appears at the end of every press release.

**Include:**
- What your company does (one sentence)
- Key credibility points (customers, revenue, funding)
- Website URL

**Example:**
"About DataSync: DataSync is an enterprise data solutions company helping organizations process and analyze data faster. Founded in 2020, DataSync serves over 500 enterprise customers including Fortune 500 companies. The company has raised $15M in venture funding. Learn more at datasync.com."

Keep it to 3-4 sentences. Update it quarterly.`,
    tip: 'Your boilerplate should answer: If someone has never heard of you, what do they need to know?',
  },
  {
    number: 7,
    title: 'Add Contact Information',
    content: `Make it ridiculously easy for journalists to contact you.

**Include:**
- Name of media contact
- Title
- Email (dedicated press email is best)
- Phone number
- Response time expectation

**Example:**
Media Contact:
Sarah Johnson
Head of Communications
press@datasync.com
(555) 123-4567

Journalists work on tight deadlines. Aim to respond within 2 hours during business hours.`,
    tip: 'Test your contact info. Send yourself an email. Call the number. Make sure everything works.',
  },
  {
    number: 8,
    title: 'Format Properly',
    content: `Proper formatting signals professionalism and makes the journalist's job easier.

**Standard format:**
1. "FOR IMMEDIATE RELEASE" (or embargo date)
2. Headline (bold, centered)
3. Subheadline (optional, italics)
4. Dateline: CITY, STATE — Date —
5. Body paragraphs (double-spaced)
6. Quote with attribution
7. Boilerplate
8. Contact information
9. "###" (end mark)

**Length:** 400-600 words. One page is ideal. Never exceed two pages.

**Font:** Standard business fonts (Arial, Times New Roman, Calibri)`,
    tip: 'When in doubt, shorter is better. Journalists appreciate conciseness.',
  },
];

const commonMistakes = [
  'Starting with "We are excited to announce..."',
  'Burying the news in the third paragraph',
  'Using jargon or buzzwords',
  'Making it too long (over 600 words)',
  'Forgetting the contact information',
  'Not having a clear news angle',
  'Using a generic, non-specific headline',
  'Including multiple announcements in one release',
];

export default function HowToWritePressReleasePage() {
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
              Let Us Write It →
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FileText className="w-4 h-4" />
            Complete Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How to Write a Press Release<br />
            <span className="text-primary">That Gets Coverage</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            A step-by-step guide to writing press releases journalists actually want to cover.
            Based on feedback from real journalists.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span>15 min read</span>
            <span>•</span>
            <span>Updated Jan 2026</span>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 bg-gray-50 border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-semibold mb-4">Quick Navigation</h2>
            <div className="grid md:grid-cols-2 gap-2">
              {steps.map((step) => (
                <a 
                  key={step.number}
                  href={`#step-${step.number}`}
                  className="text-sm text-gray-600 hover:text-primary"
                >
                  {step.number}. {step.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-16">
            {steps.map((step) => (
              <div key={step.number} id={`step-${step.number}`} className="scroll-mt-24">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
                    {step.number}
                  </div>
                  <h2 className="text-2xl font-bold">{step.title}</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  {step.content.split('\n\n').map((paragraph, index) => {
                    if (paragraph.startsWith('**') && paragraph.includes(':**')) {
                      const [title, ...items] = paragraph.split('\n');
                      return (
                        <div key={index} className="mb-4">
                          <p className="font-semibold mb-2">{title.replace(/\*\*/g, '')}</p>
                          <ul className="list-disc pl-5 space-y-1">
                            {items.map((item, i) => (
                              <li key={i} className="text-gray-600">
                                {item.replace(/^- /, '').replace(/✓ |✗ /g, '')}
                                {item.includes('✓') && <CheckCircle className="inline w-4 h-4 text-green-500 ml-1" />}
                                {item.includes('✗') && <AlertCircle className="inline w-4 h-4 text-red-500 ml-1" />}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                    return <p key={index} className="text-gray-600 mb-4">{paragraph}</p>;
                  })}
                </div>
                <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-3">
                  <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-primary">Pro tip: </span>
                    <span className="text-gray-600">{step.tip}</span>
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
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Common Mistakes to Avoid
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {commonMistakes.map((mistake, index) => (
                <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-red-100">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{mistake}</span>
                </div>
              ))}
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Get Your Free Press Release
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/resources/press-release-template">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Download Template
              </Button>
            </Link>
          </div>
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
