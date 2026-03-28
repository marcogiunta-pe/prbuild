import type { Metadata } from 'next';
import HowItWorksSlides from './HowItWorksSlides';

export const metadata: Metadata = {
  title: 'How It Works',
  description:
    'See how PRBuild turns your news into a professionally written, journalist-reviewed press release — in four simple steps. 16 persona reviewers. 4 distribution channels. First release free.',
  alternates: {
    canonical: 'https://prbuild.ai/how-it-works',
  },
  openGraph: {
    title: 'How PRBuild Works — From News to Coverage in 4 Steps',
    description:
      'Professional press release writing, 16-persona journalist review, and targeted distribution to real reporter inboxes. See the full process.',
    url: 'https://prbuild.ai/how-it-works',
  },
};

export default function HowItWorksPage() {
  return <HowItWorksSlides />;
}
