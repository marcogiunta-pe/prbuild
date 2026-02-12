import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { competitors } from '@/data/competitors';

export const metadata: Metadata = {
  title: 'Compare PRBuild to Top Press Release Services | 2026',
  description:
    'See how PRBuild compares to PRWeb, PR Newswire, Business Wire, GlobeNewswire, and Cision on price, features, and results. Writing included, first release free.',
  keywords: [
    'press release service comparison',
    'PRWeb alternative',
    'PR Newswire alternative',
    'Business Wire alternative',
    'best press release service',
    'cheapest press release distribution',
  ],
  openGraph: {
    title: 'PRBuild vs the Competition: Full Comparison Guide',
    description:
      'Compare PRBuild to PRWeb, PR Newswire, Business Wire, GlobeNewswire, and Cision.',
  },
  alternates: { canonical: 'https://prbuild.ai/compare' },
};

const competitorCards = Object.values(competitors).map((c) => ({
  slug: c.slug,
  name: c.name,
  price: c.comparisonRows.find((r) => r.feature.toLowerCase().includes('price'))
    ?.competitor as string,
  differentiator: c.comparisonRows[c.comparisonRows.length - 1].competitor as string,
}));

export default function ComparePage() {
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
              Try Free &rarr;
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            Comparison Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            PRBuild vs the Competition
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            See how PRBuild stacks up against every major press release service.
            Writing included, journalist feedback, and up to 99% lower cost.
          </p>
        </div>
      </section>

      {/* Competitor Cards */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitorCards.map((card) => (
              <Link
                key={card.slug}
                href={`/compare/${card.slug}`}
                className="group block bg-white border border-gray-200 rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all"
              >
                <div className="text-sm text-gray-400 mb-2">PRBuild vs</div>
                <div className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {card.name}
                </div>
                <div className="text-sm text-gray-500 mb-1">
                  Their starting price:{' '}
                  <span className="font-semibold text-gray-700">
                    {card.price}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  Best for:{' '}
                  <span className="font-medium">{card.differentiator}</span>
                </div>
                <div className="flex items-center text-primary text-sm font-medium">
                  See full comparison
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-gray-500 mb-4">
              PRBuild starts at just <strong>$9/month</strong> with writing
              included.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                Try PRBuild Free &mdash; No Credit Card
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} PRBuild. All rights reserved. |{' '}
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>{' '}
            |{' '}
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
