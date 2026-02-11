import { Metadata } from 'next';
import { ComparisonPage } from '@/components/compare/ComparisonPage';
import { competitors } from '@/data/competitors';

const data = competitors.prweb;

export const metadata: Metadata = {
  title: 'PRBuild vs PRWeb: Complete Comparison for 2026',
  description: 'See how PRBuild compares to PRWeb on price, features, and results. Writing included, journalist feedback, and 97% lower cost. First release free.',
  keywords: ['PRWeb alternative', 'PRWeb vs PRBuild', 'PRWeb pricing', 'PRWeb review', 'press release service comparison', 'best PRWeb alternative', 'cheaper than PRWeb'],
  openGraph: {
    title: 'PRBuild vs PRWeb: Which Press Release Service Should You Choose?',
    description: 'Compare PRBuild and PRWeb on price, features, and results. See why companies are switching.',
  },
};

export default function PRWebComparisonPage() {
  return <ComparisonPage data={data} />;
}
