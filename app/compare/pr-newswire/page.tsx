import { Metadata } from 'next';
import { ComparisonPage } from '@/components/compare/ComparisonPage';
import { competitors } from '@/data/competitors';

const data = competitors['pr-newswire'];

export const metadata: Metadata = {
  title: 'PRBuild vs PR Newswire: Complete Comparison for 2026',
  description: 'Compare PRBuild to PR Newswire on price, features, and results. Save up to 99% with writing included. First release free.',
  keywords: ['PR Newswire alternative', 'PR Newswire vs PRBuild', 'PR Newswire pricing', 'PR Newswire cost', 'press release service comparison', 'cheaper than PR Newswire', 'PR Newswire review'],
  openGraph: {
    title: 'PRBuild vs PR Newswire: Which Press Release Service Should You Choose?',
    description: 'Compare PRBuild and PR Newswire on price, features, and results. Save thousands on your PR budget.',
  },
};

export default function PRNewswireComparisonPage() {
  return <ComparisonPage data={data} />;
}
