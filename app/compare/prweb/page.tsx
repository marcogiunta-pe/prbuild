import { Metadata } from 'next';
import Link from 'next/link';
import { Check, X, ArrowRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'PRBuild vs PRWeb: Complete Comparison for 2026',
  description: 'See how PRBuild compares to PRWeb on price, features, and results. Writing included, journalist feedback, and 97% lower cost. First release free.',
  keywords: [
    'PRWeb alternative',
    'PRWeb vs PRBuild',
    'PRWeb pricing',
    'PRWeb review',
    'press release service comparison',
    'best PRWeb alternative',
    'cheaper than PRWeb',
  ],
  openGraph: {
    title: 'PRBuild vs PRWeb: Which Press Release Service Should You Choose?',
    description: 'Compare PRBuild and PRWeb on price, features, and results. See why companies are switching.',
  },
};

const comparisonData = [
  {
    feature: 'Starting price',
    prbuild: '$9/month',
    prweb: '$99/release',
    winner: 'prbuild',
  },
  {
    feature: 'Writing included',
    prbuild: true,
    prweb: false,
    winner: 'prbuild',
  },
  {
    feature: 'Journalist feedback',
    prbuild: '16 personas review',
    prweb: 'None',
    winner: 'prbuild',
  },
  {
    feature: 'Quality score',
    prbuild: true,
    prweb: false,
    winner: 'prbuild',
  },
  {
    feature: 'Unlimited revisions',
    prbuild: true,
    prweb: false,
    winner: 'prbuild',
  },
  {
    feature: 'Distribution network',
    prbuild: 'Opt-in journalists',
    prweb: 'Syndication sites',
    winner: 'prbuild',
  },
  {
    feature: 'SEO links',
    prbuild: 'Showcase page',
    prweb: 'Syndication sites',
    winner: 'tie',
  },
  {
    feature: 'Analytics',
    prbuild: true,
    prweb: true,
    winner: 'tie',
  },
  {
    feature: 'Brand recognition',
    prbuild: 'Growing',
    prweb: 'Established',
    winner: 'prweb',
  },
];

const faqs = [
  {
    question: 'Is PRBuild better than PRWeb?',
    answer: 'PRBuild offers writing services included, journalist persona feedback, and costs 97% less than PRWeb. PRWeb is better known but requires you to write your own release and charges per-release. For most companies, especially startups and SMBs, PRBuild offers better value.',
  },
  {
    question: 'Why is PRBuild so much cheaper than PRWeb?',
    answer: 'We use AI-assisted writing with human review instead of pure human writing, and our subscription model is more efficient than per-release pricing. We also focus on quality distribution to opted-in journalists rather than expensive syndication networks.',
  },
  {
    question: 'Does PRWeb write press releases?',
    answer: 'No, PRWeb only distributes press releases. You need to write your own release or hire a PR agency. PRBuild writes the release for you as part of the service.',
  },
  {
    question: 'What does PRWeb cost?',
    answer: 'PRWeb pricing ranges from $99 to $455 per release, depending on the plan. Their Basic plan starts at $99, Standard at $199, Advanced at $299, and Premium at $455. PRBuild starts at $9/month for 1 release.',
  },
  {
    question: 'Can I switch from PRWeb to PRBuild?',
    answer: 'Yes! Many of our customers have switched from PRWeb. You can try PRBuild risk-free with your first release free, no credit card required. See how the quality compares before committing.',
  },
];

export default function PRWebComparisonPage() {
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
              Try Free →
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            Comparison Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            PRBuild vs PRWeb:<br />
            <span className="text-primary">Which Should You Choose?</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            See how PRBuild compares to PRWeb on price, features, and actual results. 
            Spoiler: One writes your release for you. The other doesn't.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                Try PRBuild Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#comparison">
              <Button size="lg" variant="outline">
                See Full Comparison
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">97%</div>
              <div className="text-white/80">Lower cost than PRWeb</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">+Writing</div>
              <div className="text-white/80">Included (PRWeb: $0)</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">16</div>
              <div className="text-white/80">Journalist reviewers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="comparison" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Feature-by-Feature Comparison
          </h2>
          
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-500">Feature</th>
                  <th className="text-center py-4 px-4 bg-primary/5 rounded-t-lg">
                    <span className="font-bold text-primary">PRBuild</span>
                  </th>
                  <th className="text-center py-4 px-4 text-gray-400">PRWeb</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4 font-medium text-gray-900">{row.feature}</td>
                    <td className={`text-center py-4 px-4 ${row.winner === 'prbuild' ? 'bg-green-50' : 'bg-primary/5'}`}>
                      {typeof row.prbuild === 'boolean' ? (
                        row.prbuild ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className={row.winner === 'prbuild' ? 'text-green-600 font-semibold' : ''}>
                          {row.prbuild}
                        </span>
                      )}
                    </td>
                    <td className={`text-center py-4 px-4 ${row.winner === 'prweb' ? 'bg-green-50' : ''}`}>
                      {typeof row.prweb === 'boolean' ? (
                        row.prweb ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className={row.winner === 'prweb' ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                          {row.prweb}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/signup">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                Try PRBuild Free — No Credit Card
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* The Big Difference */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              The Biggest Difference
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              PRWeb charges you $99-$455 to <strong>distribute</strong> a press release 
              you already wrote. PRBuild charges $9/month to <strong>write, review, 
              and distribute</strong> your release.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-primary font-bold mb-4">PRBuild</div>
                <ul className="text-left space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>We write your press release</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>16 journalist personas review it</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>You see feedback before sending</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Distributed to opted-in journalists</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-gray-400 font-bold mb-4">PRWeb</div>
                <ul className="text-left space-y-3">
                  <li className="flex items-start gap-2">
                    <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-500">You write your own release</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-500">No review or feedback</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-500">No quality score</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Distributed to syndication network</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Try a Better Alternative?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Your first press release is completely free. No credit card required.
            See why companies are switching from PRWeb.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Get Your Free Release
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
