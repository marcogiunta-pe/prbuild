// components/StructuredData.tsx

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PRBuild',
    url: 'https://prbuild.vercel.app',
    logo: 'https://prbuild.vercel.app/logo.png',
    description: 'AI-powered press release writing with human quality control',
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@prbuild.com',
      contactType: 'customer service'
    },
    sameAs: [
      'https://twitter.com/prbuild',
      'https://linkedin.com/company/prbuild'
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'PRBuild',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'AI-powered press release writing service with journalist panel review',
    offers: [
      {
        '@type': 'Offer',
        name: 'Starter',
        price: '9',
        priceCurrency: 'USD',
        priceValidUntil: '2026-12-31',
        availability: 'https://schema.org/InStock'
      },
      {
        '@type': 'Offer',
        name: 'Growth',
        price: '19',
        priceCurrency: 'USD',
        priceValidUntil: '2026-12-31',
        availability: 'https://schema.org/InStock'
      },
      {
        '@type': 'Offer',
        name: 'Pro',
        price: '39',
        priceCurrency: 'USD',
        priceValidUntil: '2026-12-31',
        availability: 'https://schema.org/InStock'
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema() {
  const faqs = [
    {
      question: 'What do I get with my first free release?',
      answer: 'Your first press release includes professional AI + human writing, review by 16 journalist personas, unlimited revisions, showcase publication, and newsletter distribution to opted-in journalists.'
    },
    {
      question: 'How is this different from PRWeb or PR Newswire?',
      answer: 'Unlike wire services that charge $400+ to blast your release to sites nobody reads, we write your release, have it reviewed by journalist personas, and send it to journalists who opted in to receive news in your category.'
    },
    {
      question: 'How long does it take to get my press release?',
      answer: 'Standard turnaround is 24-48 hours. Growth and Pro plans include priority turnaround options.'
    },
    {
      question: 'What if I\'m not happy with my press release?',
      answer: 'We offer unlimited revisions until you\'re satisfied. Our process includes feedback from 16 journalist personas, so you\'ll see exactly what needs improvement before approving.'
    }
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PRBuild',
    url: 'https://prbuild.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://prbuild.vercel.app/showcase?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
