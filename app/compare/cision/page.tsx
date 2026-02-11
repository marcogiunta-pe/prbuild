import { Metadata } from 'next';
import { ComparisonPage } from '@/components/compare/ComparisonPage';
import { competitors } from '@/data/competitors';

const data = competitors.cision;

export const metadata: Metadata = {
  title: 'PRBuild vs Cision: Complete Comparison for 2026',
  description: 'Compare PRBuild to Cision PR Newswire on price, features, and results. Save thousands with writing included. First release free.',
  keywords: ['Cision alternative', 'Cision vs PRBuild', 'Cision pricing', 'Cision PR Newswire', 'press release service comparison', 'cheaper than Cision'],
  openGraph: {
    title: 'PRBuild vs Cision: Which Press Release Service Should You Choose?',
    description: 'Compare PRBuild and Cision on price, features, and results.',
  },
};

export default function CisionComparisonPage() {
  return <ComparisonPage data={data} />;
}
