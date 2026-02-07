import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileText, XCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: '15 Press Release Mistakes That Kill Your Coverage | PRBuild',
  description: 'Avoid these 15 common press release mistakes that get your release deleted. Real examples and fixes from journalists.',
  keywords: [
    'press release mistakes',
    'press release errors',
    'common press release mistakes',
    'press release tips',
    'why press releases fail',
    'press release best practices',
  ],
  openGraph: {
    title: '15 Press Release Mistakes That Kill Your Coverage | PRBuild',
    description: 'Avoid these mistakes that get your press release deleted.',
  },
};

const mistakes = [
  {
    mistake: 'Starting with "We are excited to announce..."',
    why: 'Journalists see this phrase hundreds of times a day. It immediately signals generic, uninspired copy. Your excitement is irrelevant—the news matters.',
    fix: 'Lead with the actual news. "DataSync launches AI platform that cuts processing time by 90%."',
    severity: 'critical',
  },
  {
    mistake: 'Burying the news in paragraph 3',
    why: 'Journalists skim. If they don\'t see the news in the first paragraph, they assume there isn\'t any and move on.',
    fix: 'Put the most important information in the first sentence. Answer who, what, when, where, why immediately.',
    severity: 'critical',
  },
  {
    mistake: 'No specific numbers or data',
    why: '"Significant growth" means nothing. "247% year-over-year growth" is a story. Vague claims get ignored.',
    fix: 'Include specific metrics: revenue, users, percentages, dollar amounts. Make it quantifiable.',
    severity: 'high',
  },
  {
    mistake: 'Headline over 100 characters',
    why: 'Long headlines get truncated in email subjects and search results. They\'re also harder to scan quickly.',
    fix: 'Keep headlines under 100 characters. Front-load the most important words.',
    severity: 'medium',
  },
  {
    mistake: 'Corporate jargon and buzzwords',
    why: '"Synergistic solutions" and "paradigm shifts" make journalists cringe. It signals marketing speak over substance.',
    fix: 'Write like you\'re explaining to a smart friend. If you wouldn\'t say it in conversation, don\'t write it.',
    severity: 'high',
  },
  {
    mistake: 'Quote that just restates the facts',
    why: '"This launch represents an exciting milestone" adds nothing. Journalists want insight, not corporate cheerleading.',
    fix: 'Use quotes to add perspective, opinion, or emotion that facts can\'t convey.',
    severity: 'medium',
  },
  {
    mistake: 'Too long (over 600 words)',
    why: 'Nobody reads long press releases. Every extra paragraph reduces the chance your key points get seen.',
    fix: 'Aim for 400-600 words. One page is ideal. Cut everything that isn\'t essential.',
    severity: 'medium',
  },
  {
    mistake: 'No clear news angle',
    why: 'A press release about nothing newsworthy wastes everyone\'s time. "We exist" is not news.',
    fix: 'Ask: Would a journalist care about this? If not, wait until you have actual news.',
    severity: 'critical',
  },
  {
    mistake: 'Missing contact information',
    why: 'If a journalist wants to follow up and can\'t reach you, they move on to the next story.',
    fix: 'Include name, email, and phone. Respond within 2 hours during business hours.',
    severity: 'high',
  },
  {
    mistake: 'Sending to everyone instead of targeted journalists',
    why: 'Spray-and-pray kills your sender reputation and annoys journalists who cover unrelated beats.',
    fix: 'Research who covers your industry. Send personalized pitches to 20 relevant journalists, not 2,000 random ones.',
    severity: 'high',
  },
  {
    mistake: 'Announcing multiple things in one release',
    why: 'When you announce everything, you announce nothing. Mixed messages dilute impact.',
    fix: 'One release, one announcement. If you have multiple news items, write multiple releases.',
    severity: 'medium',
  },
  {
    mistake: 'Sending on Monday morning or Friday afternoon',
    why: 'Monday morning = inbox overload. Friday afternoon = weekend mode. Your release gets buried.',
    fix: 'Send Tuesday-Thursday, 9am-11am in the journalist\'s time zone.',
    severity: 'medium',
  },
  {
    mistake: 'Obvious AI-generated copy',
    why: 'Journalists spot AI copy in seconds. It signals laziness and gets immediately deleted.',
    fix: 'Use AI for drafts, but have humans edit for voice and authenticity.',
    severity: 'critical',
  },
  {
    mistake: 'Broken links or wrong URLs',
    why: 'If a journalist clicks and gets a 404, they\'re not trying again. You look unprofessional.',
    fix: 'Test every link before sending. Triple-check URLs.',
    severity: 'high',
  },
  {
    mistake: 'Outdated boilerplate',
    why: 'If your boilerplate says "Founded in 2020" and you\'re now a 500-person company, it undermines credibility.',
    fix: 'Update your boilerplate quarterly. Include current company size, funding stage, and key achievements.',
    severity: 'low',
  },
];

export default function PressReleaseMistakesPage() {
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
      <section className="py-16 md:py-24 bg-gradient-to-b from-red-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4" />
            Avoid These Mistakes
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            15 Press Release Mistakes<br />
            <span className="text-primary">That Kill Your Coverage</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            These common mistakes get your press release deleted before journalists 
            finish the first paragraph. Here's how to avoid them.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span>15 Mistakes</span>
            <span>•</span>
            <span>With Fixes</span>
            <span>•</span>
            <span>Real Examples</span>
          </div>
        </div>
      </section>

      {/* Severity Legend */}
      <section className="py-6 bg-gray-50 border-y">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Critical (kills coverage)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span>High (reduces chances)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Medium (looks unprofessional)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mistakes List */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            {mistakes.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden">
                <div className={`px-6 py-4 flex items-center gap-4 ${
                  item.severity === 'critical' ? 'bg-red-50 border-b border-red-100' :
                  item.severity === 'high' ? 'bg-amber-50 border-b border-amber-100' :
                  'bg-yellow-50 border-b border-yellow-100'
                }`}>
                  <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.mistake}</h3>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    item.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    item.severity === 'high' ? 'bg-amber-100 text-amber-800' :
                    item.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.severity}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-red-600 font-medium mb-2">
                      <XCircle className="w-4 h-4" />
                      <span>Why it fails:</span>
                    </div>
                    <p className="text-gray-600 pl-6">{item.why}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-green-600 font-medium mb-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>How to fix it:</span>
                    </div>
                    <p className="text-gray-600 pl-6">{item.fix}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            More Resources
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link href="/resources/press-release-template" className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary transition-colors">
              <h3 className="font-semibold text-lg mb-2">Press Release Template</h3>
              <p className="text-gray-600 text-sm mb-4">Copy-paste template that avoids these mistakes.</p>
              <span className="text-primary text-sm font-medium flex items-center gap-1">
                Get Template <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link href="/resources/press-release-examples" className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary transition-colors">
              <h3 className="font-semibold text-lg mb-2">Press Release Examples</h3>
              <p className="text-gray-600 text-sm mb-4">See what good looks like.</p>
              <span className="text-primary text-sm font-medium flex items-center gap-1">
                See Examples <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link href="/resources/pr-distribution-checklist" className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary transition-colors">
              <h3 className="font-semibold text-lg mb-2">Distribution Checklist</h3>
              <p className="text-gray-600 text-sm mb-4">25-point checklist before you send.</p>
              <span className="text-primary text-sm font-medium flex items-center gap-1">
                Get Checklist <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Don't Want to Worry About Mistakes?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            We'll write your press release and make sure it avoids all these pitfalls.
            16 journalist personas review every release. First one's free.
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
