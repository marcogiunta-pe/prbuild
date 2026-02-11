import Link from 'next/link';
import { Check, X, ArrowRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CompetitorData, competitors } from '@/data/competitors';

export function ComparisonPage({ data }: { data: CompetitorData }) {
  const otherCompetitors = Object.values(competitors).filter(
    (c) => c.slug !== data.slug
  );

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

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
            Comparison Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            PRBuild vs {data.name}:<br />
            <span className="text-primary">{data.heroHighlight}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            {data.heroSubtitle}
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
            {data.stats.map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
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
                  <th className="text-left py-4 px-4 font-semibold text-gray-500">
                    Feature
                  </th>
                  <th className="text-center py-4 px-4 bg-primary/5 rounded-t-lg">
                    <span className="font-bold text-primary">PRBuild</span>
                  </th>
                  <th className="text-center py-4 px-4 text-gray-400">
                    {data.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.comparisonRows.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {row.feature}
                    </td>
                    <td
                      className={`text-center py-4 px-4 ${
                        row.winner === 'prbuild' ? 'bg-green-50' : 'bg-primary/5'
                      }`}
                    >
                      {typeof row.prbuild === 'boolean' ? (
                        row.prbuild ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span
                          className={
                            row.winner === 'prbuild'
                              ? 'text-green-600 font-semibold'
                              : ''
                          }
                        >
                          {row.prbuild}
                        </span>
                      )}
                    </td>
                    <td
                      className={`text-center py-4 px-4 ${
                        row.winner === 'competitor' ? 'bg-green-50' : ''
                      }`}
                    >
                      {typeof row.competitor === 'boolean' ? (
                        row.competitor ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span
                          className={
                            row.winner === 'competitor'
                              ? 'text-green-600 font-semibold'
                              : 'text-gray-500'
                          }
                        >
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
                Try PRBuild Free &mdash; No Credit Card
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Which Should You Choose? */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Which Should You Choose?
          </h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-primary">
              <div className="text-primary font-bold text-xl mb-4">
                Choose PRBuild if you...
              </div>
              <ul className="space-y-3">
                {data.choosePrbuild.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block mt-6">
                <Button className="w-full bg-secondary hover:bg-secondary/90">
                  Start Free Trial &rarr;
                </Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <div className="text-gray-600 font-bold text-xl mb-4">
                Choose {data.name} if you...
              </div>
              <ul className="space-y-3 text-gray-600">
                {data.chooseCompetitor.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href={data.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-6"
              >
                <Button variant="outline" className="w-full">
                  Visit {data.name} &rarr;
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="py-12 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <h3 className="text-lg font-semibold text-gray-500 text-center mb-6">
            More Comparisons
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {otherCompetitors.map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors"
              >
                PRBuild vs {c.name}
              </Link>
            ))}
            <Link
              href="/compare"
              className="px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-full text-sm font-medium text-primary transition-colors"
            >
              View All Comparisons
            </Link>
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
            {data.faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-6"
              >
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
            {data.ctaHeadline}
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {data.ctaSubtext}
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
