import LandingPage from '@/components/landing/LandingPage';
import { FAQ_ITEMS } from '@/data/faq';

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'PRBuild Press Release Writing',
  description: 'AI-powered press release writing with 16 journalist personas review. Professional writing, unlimited revisions, showcase publication, newsletter distribution. First release free.',
  provider: { '@type': 'Organization', name: 'PRBuild' },
  url: 'https://prbuild.vercel.app',
  areaServed: 'US',
  offers: {
    '@type': 'Offer',
    name: 'First release free',
    description: 'Your first press release free. No credit card required.',
    url: 'https://prbuild.vercel.app/signup',
    price: '0',
    priceCurrency: 'USD',
  },
};

const faqPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }} />
      <LandingPage />
    </>
  );
}
