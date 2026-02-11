import { Metadata } from 'next';
import { ComparisonPage } from '@/components/compare/ComparisonPage';
import { competitors } from '@/data/competitors';

const data = competitors.globenewswire;

export const metadata: Metadata = {
  title: 'PRBuild vs GlobeNewswire: Complete Comparison for 2026',
  description: 'Compare PRBuild to GlobeNewswire on price, features, and results. Save up to 98% with writing included. First release free.',
  keywords: ['GlobeNewswire alternative', 'GlobeNewswire vs PRBuild', 'GlobeNewswire pricing', 'GlobeNewswire cost', 'press release service comparison', 'cheaper than GlobeNewswire'],
  openGraph: {
    title: 'PRBuild vs GlobeNewswire: Which Press Release Service Should You Choose?',
    description: 'Compare PRBuild and GlobeNewswire on price, features, and results.',
  },
};

export default function GlobeNewswireComparisonPage() {
  return <ComparisonPage data={data} />;
}
