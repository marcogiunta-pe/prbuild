import { Metadata } from 'next';
import Link from 'next/link';
import {
  Workflow,
  ClipboardEdit,
  MessageSquare,
  LayoutList,
  CreditCard,
  Globe,
  UserCog,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Everything you need to know about using PRBuild to create, review, and distribute professional press releases.',
  alternates: { canonical: 'https://prbuild.ai/docs' },
};

const topics = [
  {
    title: 'How It Works',
    description: 'The 5-step process from submission to publication.',
    href: '/docs/how-it-works',
    icon: Workflow,
  },
  {
    title: 'Submitting a Request',
    description: 'Walk through the intake form step by step.',
    href: '/docs/submitting-request',
    icon: ClipboardEdit,
  },
  {
    title: 'Review Process',
    description: 'How our journalist panel evaluates every release.',
    href: '/docs/review-process',
    icon: MessageSquare,
  },
  {
    title: 'Managing Releases',
    description: 'Status lifecycle, actions, and tracking your releases.',
    href: '/docs/managing-releases',
    icon: LayoutList,
  },
  {
    title: 'Pricing & Plans',
    description: 'Starter, Growth, and Pro plans explained.',
    href: '/docs/pricing',
    icon: CreditCard,
  },
  {
    title: 'Distribution',
    description: 'Showcase, journalist newsletter, and pickup rates.',
    href: '/docs/distribution',
    icon: Globe,
  },
  {
    title: 'Account Settings',
    description: 'Profile, password, and company info management.',
    href: '/docs/account',
    icon: UserCog,
  },
];

export default function DocsIndexPage() {
  return (
    <div>
      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          PRBuild Documentation
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Everything you need to create, review, and distribute professional press releases.
          Whether you&apos;re submitting your first release or managing an ongoing PR calendar,
          these guides have you covered.
        </p>
      </div>

      {/* Topic grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {topics.map((topic) => (
          <Link
            key={topic.href}
            href={topic.href}
            className="group border rounded-xl p-6 hover:border-secondary/50 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                <topic.icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 group-hover:text-secondary transition-colors">
                  {topic.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick start */}
      <div className="mt-12 p-6 bg-gray-50 rounded-xl">
        <h2 className="font-semibold text-gray-900 mb-2">Quick Start</h2>
        <ol className="space-y-2 text-sm text-gray-600">
          <li>1. <Link href="/signup" className="text-secondary hover:underline">Create your free account</Link></li>
          <li>2. <Link href="/docs/submitting-request" className="text-secondary hover:underline">Fill out the intake form</Link> (takes ~5 minutes)</li>
          <li>3. We&apos;ll draft your release using AI + journalist feedback within 24 hours</li>
          <li>4. Review, request revisions, and approve</li>
          <li>5. Your release is published to the <Link href="/showcase" className="text-secondary hover:underline">Showcase</Link> and sent to journalists</li>
        </ol>
      </div>
    </div>
  );
}
