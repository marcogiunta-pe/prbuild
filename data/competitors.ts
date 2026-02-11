export interface CompetitorData {
  name: string;
  slug: string;
  website: string;
  heroSubtitle: string;
  heroHighlight: string;
  stats: { value: string; label: string }[];
  comparisonRows: {
    feature: string;
    prbuild: string | boolean;
    competitor: string | boolean;
    winner: 'prbuild' | 'competitor' | 'tie';
  }[];
  choosePrbuild: string[];
  chooseCompetitor: string[];
  faqs: { question: string; answer: string }[];
  ctaHeadline: string;
  ctaSubtext: string;
}

export const competitors: Record<string, CompetitorData> = {
  prweb: {
    name: 'PRWeb',
    slug: 'prweb',
    website: 'https://www.prweb.com',
    heroSubtitle:
      'See how PRBuild compares to PRWeb on price, features, and actual results. Spoiler: One writes your release for you. The other doesn\u2019t.',
    heroHighlight: 'Which Should You Choose?',
    stats: [
      { value: '97%', label: 'Lower cost than PRWeb' },
      { value: '+Writing', label: 'Included (PRWeb: $0)' },
      { value: '16', label: 'Journalist reviewers' },
    ],
    comparisonRows: [
      { feature: 'Starting price', prbuild: '$9/month', competitor: '$99/release', winner: 'prbuild' },
      { feature: 'Writing included', prbuild: true, competitor: false, winner: 'prbuild' },
      { feature: 'Journalist feedback', prbuild: '16 personas review', competitor: 'None', winner: 'prbuild' },
      { feature: 'Quality score', prbuild: true, competitor: false, winner: 'prbuild' },
      { feature: 'Unlimited revisions', prbuild: true, competitor: false, winner: 'prbuild' },
      { feature: 'Distribution network', prbuild: 'Opt-in journalists', competitor: 'Syndication sites', winner: 'prbuild' },
      { feature: 'SEO links', prbuild: 'Showcase page', competitor: 'Syndication sites', winner: 'tie' },
      { feature: 'Analytics', prbuild: true, competitor: true, winner: 'tie' },
      { feature: 'Brand recognition', prbuild: 'Growing', competitor: 'Established', winner: 'competitor' },
    ],
    choosePrbuild: [
      'Are a startup or small business',
      'Need help writing press releases',
      'Want feedback before sending',
      'Have a limited PR budget',
      'Publish 1-5 releases per month',
    ],
    chooseCompetitor: [
      'Already have a PR writer',
      'Need quick self-service publishing',
      'Want established syndication network',
      'Prefer per-release pricing',
    ],
    faqs: [
      {
        question: 'Is PRBuild better than PRWeb?',
        answer:
          'PRBuild offers writing services included, journalist persona feedback, and costs 97% less than PRWeb. PRWeb is better known but requires you to write your own release and charges per-release. For most companies, especially startups and SMBs, PRBuild offers better value.',
      },
      {
        question: 'Why is PRBuild so much cheaper than PRWeb?',
        answer:
          'We use AI-assisted writing with human review instead of pure human writing, and our subscription model is more efficient than per-release pricing. We also focus on quality distribution to opted-in journalists rather than expensive syndication networks.',
      },
      {
        question: 'Does PRWeb write press releases?',
        answer:
          'No, PRWeb only distributes press releases. You need to write your own release or hire a PR agency. PRBuild writes the release for you as part of the service.',
      },
      {
        question: 'What does PRWeb cost?',
        answer:
          'PRWeb pricing ranges from $99 to $455 per release, depending on the plan. Their Basic plan starts at $99, Standard at $199, Advanced at $299, and Premium at $455. PRBuild starts at $9/month for 1 release.',
      },
      {
        question: 'Can I switch from PRWeb to PRBuild?',
        answer:
          'Yes! Many of our customers have switched from PRWeb. You can try PRBuild risk-free with your first release free, no credit card required. See how the quality compares before committing.',
      },
    ],
    ctaHeadline: 'Ready to Try a Better Alternative?',
    ctaSubtext:
      'Your first press release is completely free. No credit card required. See why companies are switching from PRWeb.',
  },

  'pr-newswire': {
    name: 'PR Newswire',
    slug: 'pr-newswire',
    website: 'https://www.prnewswire.com',
    heroSubtitle:
      'PR Newswire is the gold standard for enterprise PR. But if you\u2019re a startup or SMB, you might be paying 100x more than you need to.',
    heroHighlight: 'Save Up to 99% on PR',
    stats: [
      { value: '99%', label: 'Lower cost than PR Newswire' },
      { value: '+Writing', label: 'Included (PR Newswire: $0)' },
      { value: '$1,000+', label: 'Saved per release' },
    ],
    comparisonRows: [
      { feature: 'Starting price', prbuild: '$9/month', competitor: '$350+/release', winner: 'prbuild' },
      { feature: 'National distribution', prbuild: 'Opt-in journalists', competitor: '$805-$1,070', winner: 'prbuild' },
      { feature: 'Writing included', prbuild: true, competitor: false, winner: 'prbuild' },
      { feature: 'Journalist feedback', prbuild: '16 personas review', competitor: 'None', winner: 'prbuild' },
      { feature: 'Quality score', prbuild: true, competitor: false, winner: 'prbuild' },
      { feature: 'Unlimited revisions', prbuild: true, competitor: false, winner: 'prbuild' },
      { feature: 'Distribution reach', prbuild: 'Targeted journalists', competitor: 'Global network', winner: 'competitor' },
      { feature: 'Brand recognition', prbuild: 'Growing', competitor: 'Industry leader', winner: 'competitor' },
      { feature: 'Best for', prbuild: 'Startups & SMBs', competitor: 'Enterprise & IPOs', winner: 'tie' },
    ],
    choosePrbuild: [
      'Are a startup or small business',
      'Need help writing press releases',
      'Want feedback before sending',
      'Have a limited PR budget',
      'Publish 1-5 releases per month',
    ],
    chooseCompetitor: [
      'Are an enterprise or public company',
      'Need SEC-compliant distribution',
      'Require global simultaneous release',
      'Have a dedicated PR team',
      'Budget isn\u2019t a concern',
    ],
    faqs: [
      {
        question: 'Is PRBuild better than PR Newswire?',
        answer:
          'It depends on your needs. PRBuild is better for startups and SMBs who need affordable, high-quality press releases with writing included. PR Newswire is better for enterprises needing maximum global distribution reach for major announcements like IPOs or acquisitions.',
      },
      {
        question: 'How much does PR Newswire cost?',
        answer:
          'PR Newswire pricing starts around $350 for basic distribution and goes up to $1,070+ for national distribution. Adding multimedia, targeting, and premium features can push costs to $3,000+ per release. You also need to pay for membership.',
      },
      {
        question: 'Why is PRBuild so much cheaper?',
        answer:
          'We use AI-assisted writing with human review, focus on quality over quantity in distribution, and use a subscription model. We also target opt-in journalists rather than paying for massive syndication networks.',
      },
      {
        question: 'Does PR Newswire write press releases?',
        answer:
          'No, PR Newswire only distributes press releases. You need to write your own or hire a PR agency. PRBuild writes the release for you as part of the service.',
      },
      {
        question: 'When should I use PR Newswire instead?',
        answer:
          'Use PR Newswire for major corporate announcements requiring SEC compliance, global simultaneous distribution, or when working with institutional investors who specifically look for PR Newswire distribution.',
      },
    ],
    ctaHeadline: 'Ready to Save Thousands on PR?',
    ctaSubtext:
      'Your first press release is completely free. No credit card required. See the quality before you commit.',
  },

  'business-wire': {
    name: 'Business Wire',
    slug: 'business-wire',
    website: 'https://www.businesswire.com',
    heroSubtitle:
      'Business Wire is built for Fortune 500 compliance. If you\u2019re a startup or SMB, you\u2019re paying enterprise prices for features you don\u2019t need.',
    heroHighlight: 'Save Up to 99% on PR',
    stats: [
      { value: '98%', label: 'Lower cost than Business Wire' },
      { value: '+Writing', label: 'Included (Business Wire: $0)' },
      { value: '$700+', label: 'Saved per release' },
    ],
    comparisonRows: [
      { feature: 'Starting price', prbuild: '$9/month', competitor: '$400+/release', winner: 'prbuild' },
      { feature: 'US National distribution', prbuild: 'Opt-in journalists', competitor: '$725-$1,200', winner: 'prbuild' },
      { feature: 'Writing included', prbuild: true, competitor: false, winner: 'prbuild' },
      { feature: 'Journalist feedback', prbuild: '16 personas review', competitor: 'None', winner: 'prbuild' },
      { feature: 'Quality score', prbuild: true, competitor: false, winner: 'prbuild' },
      { feature: 'Unlimited revisions', prbuild: true, competitor: false, winner: 'prbuild' },
      { feature: 'SEC/regulatory compliance', prbuild: 'Basic', competitor: 'Full compliance', winner: 'competitor' },
      { feature: 'Global distribution network', prbuild: 'US-focused', competitor: '162 countries', winner: 'competitor' },
      { feature: 'Best for', prbuild: 'Startups & SMBs', competitor: 'Enterprise & Public Companies', winner: 'tie' },
    ],
    choosePrbuild: [
      'Are a startup or small business',
      'Need help writing press releases',
      'Want feedback before sending',
      'Don\u2019t need SEC compliance',
      'Focus on US media coverage',
    ],
    chooseCompetitor: [
      'Are a public company',
      'Need SEC/regulatory compliance',
      'Require global simultaneous release',
      'Have a dedicated PR team',
      'Need multimedia distribution',
    ],
    faqs: [
      {
        question: 'Is PRBuild better than Business Wire?',
        answer:
          'It depends on your needs. PRBuild is better for startups and SMBs who need affordable, high-quality press releases with writing included. Business Wire is better for public companies needing SEC-compliant distribution or global simultaneous releases.',
      },
      {
        question: 'How much does Business Wire cost?',
        answer:
          'Business Wire pricing starts around $400 for regional distribution and $725-$1,200 for US national distribution. International distribution, multimedia, and targeting can push costs to $2,500+ per release. Annual contracts may be required.',
      },
      {
        question: 'Why is PRBuild so much cheaper?',
        answer:
          'We use AI-assisted writing with human review, focus on quality over quantity in distribution, and use a subscription model. We target opt-in journalists rather than paying for massive wire networks.',
      },
      {
        question: 'Does Business Wire write press releases?',
        answer:
          'No, Business Wire only distributes press releases. You need to write your own or hire a PR agency separately. PRBuild writes the release for you as part of the service.',
      },
      {
        question: 'When should I use Business Wire instead?',
        answer:
          'Use Business Wire for SEC-regulated announcements (earnings, material events), global simultaneous distribution requirements, or when institutional investors specifically expect Business Wire distribution.',
      },
    ],
    ctaHeadline: 'Ready to Save Thousands on PR?',
    ctaSubtext:
      'Your first press release is completely free. No credit card required. See the quality before you commit.',
  },

  globenewswire: {
    name: 'GlobeNewswire',
    slug: 'globenewswire',
    website: 'https://www.globenewswire.com',
    heroSubtitle:
      'GlobeNewswire is great for public companies with IR needs. For everyone else, there\u2019s a much more affordable option.',
    heroHighlight: 'Save Up to 98% on PR',
    stats: [
      { value: '98%', label: 'Lower cost than GlobeNewswire' },
      { value: '+Writing', label: 'Included (GlobeNewswire: $0)' },
      { value: '$500+', label: 'Saved per release' },
    ],
    comparisonRows: [
      { feature: 'Starting price', prbuild: '$9/month', competitor: '$350+/release', winner: 'prbuild' },
      { feature: 'US distribution', prbuild: 'Opt-in journalists', competitor: '$595-$995', winner: 'prbuild' },
      { feature: 'Writing included', prbuild: true, competitor: false, winner: 'prbuild' },
      { feature: 'Journalist feedback', prbuild: '16 personas review', competitor: 'None', winner: 'prbuild' },
      { feature: 'Quality score', prbuild: true, competitor: false, winner: 'prbuild' },
      { feature: 'Multimedia support', prbuild: 'Basic images', competitor: 'Full multimedia', winner: 'competitor' },
      { feature: 'Investor relations tools', prbuild: 'Not available', competitor: 'Full IR suite', winner: 'competitor' },
      { feature: 'Best for', prbuild: 'Startups & SMBs', competitor: 'Public Companies', winner: 'tie' },
    ],
    choosePrbuild: [
      'Are a startup or private company',
      'Need help writing press releases',
      'Want feedback before sending',
      'Have a limited PR budget',
    ],
    chooseCompetitor: [
      'Are a public company',
      'Need investor relations tools',
      'Have SEC filing requirements',
      'Need full multimedia support',
    ],
    faqs: [
      {
        question: 'Is PRBuild better than GlobeNewswire?',
        answer:
          'For startups and SMBs who need affordable press releases with writing included, yes. For public companies needing investor relations tools and regulatory compliance, GlobeNewswire is the better choice.',
      },
      {
        question: 'How much does GlobeNewswire cost?',
        answer:
          'GlobeNewswire pricing starts around $350 for basic distribution. US national distribution ranges from $595-$995. Adding multimedia, targeting, and international distribution can push costs to $2,000+ per release.',
      },
      {
        question: 'Does GlobeNewswire write press releases?',
        answer:
          'No, GlobeNewswire only distributes press releases. You need to write your own or hire a PR agency. PRBuild writes the release for you as part of the service.',
      },
      {
        question: 'When should I use GlobeNewswire?',
        answer:
          'Use GlobeNewswire if you\'re a public company needing investor relations tools, regulatory compliance (8-K filings), or if you need their specific international distribution network.',
      },
    ],
    ctaHeadline: 'Ready to Save on PR?',
    ctaSubtext: 'Your first press release is completely free. No credit card required.',
  },

  cision: {
    name: 'Cision',
    slug: 'cision',
    website: 'https://www.cision.com',
    heroSubtitle:
      'Cision is the enterprise standard for PR teams. But most startups don\u2019t need (or want to pay for) an enterprise solution.',
    heroHighlight: 'Enterprise PR vs What You Actually Need',
    stats: [
      { value: '99%', label: 'Lower starting cost' },
      { value: 'No', label: 'Annual contract required' },
      { value: '+Writing', label: 'Included in every plan' },
    ],
    comparisonRows: [
      { feature: 'Starting price', prbuild: '$9/month', competitor: '$5,000+/year', winner: 'prbuild' },
      { feature: 'Pay-per-release option', prbuild: true, competitor: 'Annual contract', winner: 'prbuild' },
      { feature: 'Writing included', prbuild: true, competitor: false, winner: 'prbuild' },
      { feature: 'Journalist feedback', prbuild: '16 personas review', competitor: 'None', winner: 'prbuild' },
      { feature: 'Media database', prbuild: 'Opt-in journalists', competitor: '1M+ contacts', winner: 'competitor' },
      { feature: 'Media monitoring', prbuild: 'Basic tracking', competitor: 'Full monitoring suite', winner: 'competitor' },
      { feature: 'PR analytics', prbuild: 'Engagement metrics', competitor: 'Enterprise analytics', winner: 'competitor' },
      { feature: 'Best for', prbuild: 'Startups & SMBs', competitor: 'Enterprise PR teams', winner: 'tie' },
    ],
    choosePrbuild: [
      'Are a startup or small business',
      'Don\u2019t have a dedicated PR team',
      'Need help writing press releases',
      'Want to pay per release, not annually',
    ],
    chooseCompetitor: [
      'Have an in-house PR team',
      'Need comprehensive media monitoring',
      'Want access to journalist databases',
      'Have enterprise PR budget',
    ],
    faqs: [
      {
        question: 'Is PRBuild better than Cision?',
        answer:
          'They serve different markets. PRBuild is better for startups and SMBs who need affordable press releases with writing included. Cision is an enterprise PR platform with media databases, monitoring, and analytics\u2014features most small companies don\'t need.',
      },
      {
        question: 'How much does Cision cost?',
        answer:
          'Cision requires annual contracts typically starting at $5,000-$10,000/year for basic access. Full platform access with media database, monitoring, and distribution can run $20,000-$50,000+ annually. They don\'t publish pricing publicly.',
      },
      {
        question: 'Does Cision write press releases?',
        answer:
          'No, Cision is a distribution and media intelligence platform. You need to write your own press releases or hire their services separately. PRBuild writes the release for you as part of every plan.',
      },
      {
        question: 'When should I use Cision?',
        answer:
          'Use Cision if you\'re an enterprise with a dedicated PR team, need comprehensive media monitoring, want access to their journalist database, or require detailed analytics and reporting for stakeholders.',
      },
    ],
    ctaHeadline: 'Skip the Enterprise Pricing',
    ctaSubtext: 'Your first press release is completely free. No contracts, no commitments.',
  },
};

export const allCompetitorSlugs = Object.keys(competitors);
