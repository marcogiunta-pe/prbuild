import { Metadata } from 'next';
import { ComparisonPage } from '@/components/compare/ComparisonPage';
import { competitors } from '@/data/competitors';

const data = competitors['business-wire'];

export const metadata: Metadata = {
  title: 'PRBuild vs Business Wire: Complete Comparison for 2026',
  description: 'Compare PRBuild to Business Wire on price, features, and results. Save up to 99% with writing included. First release free.',
  keywords: ['Business Wire alternative', 'Business Wire vs PRBuild', 'Business Wire pricing', 'Business Wire cost', 'press release service comparison', 'cheaper than Business Wire', 'Business Wire review'],
  openGraph: {
    title: 'PRBuild vs Business Wire: Which Press Release Service Should You Choose?',
    description: 'Compare PRBuild and Business Wire on price, features, and results. Save thousands on your PR budget.',
  },
  alternates: { canonical: 'https://prbuild.ai/compare/business-wire' },
};

export default function BusinessWireComparisonPage() {
  return <ComparisonPage data={data} />;
}
