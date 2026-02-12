import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Globe, Mail, BarChart3, Share2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Distribution',
  description: 'How PRBuild distributes your press release: public Showcase, journalist newsletter, and pickup tracking. 23% average pickup rate.',
  alternates: { canonical: 'https://prbuild.ai/docs/distribution' },
};

const channels = [
  {
    icon: Globe,
    title: 'PRBuild Showcase',
    description: 'Every published release gets its own page on the PRBuild Showcase — a public, SEO-optimized directory of press releases.',
    details: [
      'Permanent, shareable URL for each release',
      'SEO-optimized with structured data markup',
      'Category-based browsing for journalists',
      'View count and share tracking',
    ],
  },
  {
    icon: Mail,
    title: 'Journalist Newsletter',
    description: 'Journalists subscribe to PRBuild by industry category. When your release is published, it\'s included in the next newsletter for your category.',
    details: [
      'Journalists self-select their categories and beat',
      'Email verification ensures real journalist addresses',
      'Immediate, daily, or weekly digest options',
      'Direct click-through tracking per release',
    ],
  },
  {
    icon: Share2,
    title: 'Your Own Outreach',
    description: 'Use the shareable link to include your release in your own emails, social posts, and media pitches.',
    details: [
      'Professional, hosted release page you can link to',
      'Open Graph tags for social media sharing',
      'No paywall — anyone can read the full release',
      'Embed-friendly for company newsrooms',
    ],
  },
];

const stats = [
  { number: '23%', label: 'Average Pickup Rate', description: 'Percentage of releases that receive journalist coverage or follow-up inquiries.' },
  { number: '847+', label: 'Releases Published', description: 'Total releases distributed through the PRBuild platform.' },
  { number: '2,400+', label: 'Journalist Subscribers', description: 'Verified journalists receiving releases in their preferred categories.' },
  { number: '16', label: 'Journalist Personas', description: 'AI personas that review every release before it reaches real journalists.' },
];

const analytics = [
  { metric: 'Views', description: 'Total page views on your Showcase release.' },
  { metric: 'Shares', description: 'Number of times the release was shared using the share button.' },
  { metric: 'Journalist Clicks', description: 'Clicks from the journalist newsletter to your release page.' },
  { metric: 'Published Date', description: 'When your release went live on the Showcase.' },
];

export default function DistributionPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Distribution</h1>
      <p className="text-lg text-gray-600 mb-12 max-w-2xl">
        When your release is published, it reaches journalists through multiple channels.
        Here&apos;s how distribution works and what metrics you can track.
      </p>

      {/* Channels */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Distribution Channels</h2>
        <div className="space-y-8">
          {channels.map((channel) => (
            <div key={channel.title} className="border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                  <channel.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{channel.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{channel.description}</p>
              <ul className="space-y-2">
                {channel.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-2 text-sm text-gray-500">
                    <ArrowRight className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Platform Stats</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-secondary mb-1">{stat.number}</div>
              <div className="text-sm font-medium text-gray-900">{stat.label}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="h-5 w-5 text-secondary" />
          <h2 className="text-2xl font-semibold text-gray-900">Tracking & Analytics</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Each published release includes basic analytics visible on your dashboard:
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {analytics.map((a) => (
            <div key={a.metric} className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-1">{a.metric}</h3>
              <p className="text-sm text-gray-600">{a.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Next step */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <span className="text-sm text-gray-600">Next:</span>
        <Link href="/docs/account" className="text-sm text-secondary font-medium hover:underline flex items-center gap-1">
          Account settings <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
