import { Metadata } from 'next';
import Link from 'next/link';
import { Check, X, ArrowRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'PRBuild vs Business Wire: Complete Comparison for 2026',
  description: 'Compare PRBuild to Business Wire on price, features, and results. Save up to 99% with writing included. First release free.',
  keywords: [
    'Business Wire alternative',
    'Business Wire vs PRBuild',
    'Business Wire pricing',
    'Business Wire cost',
    'press release service comparison',
    'cheaper than Business Wire',
    'Business Wire review',
  ],
  openGraph: {
    title: 'PRBuild vs Business Wire: Which Press Release Service Should You Choose?',
    description: 'Compare PRBuild and Business Wire on price, features, and results. Save thousands on your PR budget.',
  },
};

const comparisonData = [
  {
    feature: 'Starting price',
    prbuild: '$9/month',
    competitor: '$400+/release',
    winner: 'prbuild',
  },
  {
    feature: 'US National distribution',
    prbuild: 'Opt-in journalists',
    competitor: '$725-$1,200',
    winner: 'prbuild',
  },
  {
    feature: 'Writing included',
    prbuild: true,
    competitor: false,
    winner: 'prbuild',
  },
  {
    feature: 'Journalist feedback',
    prbuild: '16 personas review',
    competitor: 'None',
    winner: 'prbuild',
  },
  {
    feature: 'Quality score',
    prbuild: true,
    competitor: false,
    winner: 'prbuild',
  },
  {
    feature: 'Unlimited revisions',
    prbuild: true,
    competitor: false,
    winner: 'prbuild',
  },
  {
    feature: 'SEC/regulatory compliance',
    prbuild: 'Basic',
    competitor: 'Full compliance',
    winner: 'competitor',
  },
  {
    feature: 'Global distribution network',
    prbuild: 'US-focused',
    competitor: '162 countries',
    winner: 'competitor',
  },
  {
    feature: 'Best for',
    prbuild: 'Startups & SMBs',
    competitor: 'Enterprise & Public Companies',
    winner: 'tie',
  },
];

const faqs = [
  {
    question: 'Is PRBuild better than Business Wire?',
    answer: 'It depends on your needs. PRBuild is better for startups and SMBs who need affordable, high-quality press releases with writing included. Business Wire is better for public companies needing SEC-compliant distribution or global simultaneous releases.',
  },
  {
    question: 'How much does Business Wire cost?',
    answer: 'Business Wire pricing starts around $400 for regional distribution and $725-$1,200 for US national distribution. International distribution, multimedia, and targeting can push costs to $2,500+ per release. Annual contracts may be required.',
  },
  {
    question: 'Why is PRBuild so much cheaper?',
    answer: 'We use AI-assisted writing with human review, focus on quality over quantity in distribution, and use a subscription model. We target opt-in journalists rather than paying for massive wire networks.',
  },
  {
    question: 'Does Business Wire write press releases?',
    answer: 'No, Business Wire only distributes press releases. You need to write your own or hire a PR agency separately. PRBuild writes the release for you as part of the service.',
  },
  {
    question: 'When should I use Business Wire instead?',
    answer: 'Use Business Wire for SEC-regulated announcements (earnings, material events), global simultaneous distribution requirements, or when institutional investors specifically expect Business Wire distribution.',
  },
];

export default function BusinessWireComparisonPage() {
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
            PRBuild vs Business Wire:<br />
            <span className="text-primary">Save Up to 99% on PR</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Business Wire is built for Fortune 500 compliance. If you're a startup 
            or SMB, you're paying enterprise prices for features you don't need.
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
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-white/80">Lower cost than Business Wire</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">+Writing</div>
              <div className="text-white/80">Included (Business Wire: $0)</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$700+</div>
              <div className="text-white/80">Saved per release</div>
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
                  <th className="text-center py-4 px-4 text-gray-400">Business Wire</th>
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
                    <td className={`text-center py-4 px-4 ${row.winner === 'competitor' ? 'bg-green-50' : ''}`}>
                      {typeof row.competitor === 'boolean' ? (
                        row.competitor ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className={row.winner === 'competitor' ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                          {row.competitor}
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

      {/* Who Should Use Which */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Which Should You Choose?
          </h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-primary">
              <div className="text-primary font-bold text-xl mb-4">Choose PRBuild if you...</div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Are a startup or small business</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Need help writing press releases</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Want feedback before sending</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Don't need SEC compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Focus on US media coverage</span>
                </li>
              </ul>
              <Link href="/signup" className="block mt-6">
                <Button className="w-full bg-secondary hover:bg-secondary/90">
                  Start Free Trial →
                </Button>
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <div className="text-gray-600 font-bold text-xl mb-4">Choose Business Wire if you...</div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Are a public company</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Need SEC/regulatory compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Require global simultaneous release</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Have a dedicated PR team</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Need multimedia distribution</span>
                </li>
              </ul>
              <a href="https://www.businesswire.com" target="_blank" rel="noopener noreferrer" className="block mt-6">
                <Button variant="outline" className="w-full">
                  Visit Business Wire →
                </Button>
              </a>
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
            Ready to Save Thousands on PR?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Your first press release is completely free. No credit card required.
            See the quality before you commit.
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
