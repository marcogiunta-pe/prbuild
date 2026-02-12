import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://prbuild.ai';
  
  return [
    // Core pages
    {
      url: baseUrl,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/forgot-password`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/reset-password`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/showcase`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/journalist/subscribe`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Comparison pages (high SEO value)
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare/prweb`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare/pr-newswire`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare/business-wire`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare/globenewswire`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare/cision`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Use case pages
    {
      url: `${baseUrl}/for/startups`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/for/agencies`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/for/ecommerce`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/for/saas`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/for/nonprofits`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/for/healthcare`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Documentation pages
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/docs/how-it-works`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/docs/submitting-request`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/docs/review-process`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/docs/managing-releases`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/docs/pricing`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/docs/distribution`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/docs/account`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Resource pages
    {
      url: `${baseUrl}/resources/press-release-template`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resources/how-to-write-press-release`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resources/press-release-examples`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resources/pr-distribution-checklist`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resources/press-release-mistakes`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    // Other pages
    {
      url: `${baseUrl}/referral`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Legal pages
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date('2026-02-11'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
