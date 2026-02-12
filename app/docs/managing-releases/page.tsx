import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Managing Releases',
  description: 'Track your press release through 14 status stages. Learn what actions are available at each step and how the lifecycle works.',
  alternates: { canonical: 'https://prbuild.ai/docs/managing-releases' },
};

const statuses = [
  {
    name: 'Submitted',
    code: 'submitted',
    color: 'bg-blue-100 text-blue-700',
    description: 'Your request has been received. Our team is reviewing your input.',
    action: 'Wait for draft generation (usually within a few hours).',
  },
  {
    name: 'Draft Generated',
    code: 'draft_generated',
    color: 'bg-purple-100 text-purple-700',
    description: 'AI has created the initial draft with headline options and full body copy.',
    action: 'The draft is sent to the journalist panel for review.',
  },
  {
    name: 'Panel Reviewed',
    code: 'panel_reviewed',
    color: 'bg-purple-100 text-purple-700',
    description: 'All 16 journalist personas have provided feedback.',
    action: 'Our team refines the draft based on panel feedback.',
  },
  {
    name: 'Admin Approved',
    code: 'admin_approved',
    color: 'bg-purple-100 text-purple-700',
    description: 'The refined draft has passed our internal quality check.',
    action: 'The draft is sent to you for review.',
  },
  {
    name: 'Awaiting Your Review',
    code: 'awaiting_client',
    color: 'bg-yellow-100 text-yellow-700',
    description: 'The draft is ready for your review. This status requires your action.',
    action: 'Review the draft and either approve, request changes, or provide feedback.',
  },
  {
    name: 'Feedback Received',
    code: 'client_feedback',
    color: 'bg-orange-100 text-orange-700',
    description: 'We\'ve received your feedback and are incorporating your changes.',
    action: 'Wait for the revised draft (usually within 24 hours).',
  },
  {
    name: 'Approved',
    code: 'client_approved',
    color: 'bg-green-100 text-green-700',
    description: 'You\'ve approved the draft. It moves to final review.',
    action: 'No action needed — we\'re finalizing your release.',
  },
  {
    name: 'Final Review',
    code: 'final_pending',
    color: 'bg-blue-100 text-blue-700',
    description: 'Final proofreading and formatting before publication.',
    action: 'Our team does a final quality pass.',
  },
  {
    name: 'Final Approved',
    code: 'final_approved',
    color: 'bg-green-100 text-green-700',
    description: 'The release has passed final review.',
    action: 'Moves to quality review.',
  },
  {
    name: 'Quality Review',
    code: 'quality_review',
    color: 'bg-blue-100 text-blue-700',
    description: 'A senior editor reviews the release for quality standards.',
    action: 'Last check before publication.',
  },
  {
    name: 'Quality Approved',
    code: 'quality_approved',
    color: 'bg-green-100 text-green-700',
    description: 'The release has met all quality standards.',
    action: 'Ready for publication.',
  },
  {
    name: 'Published',
    code: 'published',
    color: 'bg-teal-100 text-teal-700',
    description: 'Your release is live on the Showcase and has been distributed to journalists.',
    action: 'Track views, shares, and journalist clicks on your dashboard.',
  },
  {
    name: 'Needs Revision',
    code: 'needs_revision',
    color: 'bg-red-100 text-red-700',
    description: 'The release needs changes before it can proceed. This can happen at any stage.',
    action: 'Check the admin notes for specific revision requests.',
  },
  {
    name: 'Rejected',
    code: 'rejected',
    color: 'bg-red-100 text-red-700',
    description: 'The release did not meet our quality standards. This is rare.',
    action: 'Contact support to discuss next steps or submit a new request.',
  },
];

const dashboardFeatures = [
  { title: 'Release list', description: 'All your releases sorted by date, with status badges and action indicators.' },
  { title: 'Detail view', description: 'Click any release to see the full draft, feedback, and revision history.' },
  { title: 'Action buttons', description: 'Context-aware actions — "Review Now" appears when your input is needed.' },
  { title: 'Status timeline', description: 'See when each status change happened and who made it.' },
];

export default function ManagingReleasesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Managing Releases</h1>
      <p className="text-lg text-gray-600 mb-12 max-w-2xl">
        Every release moves through a defined lifecycle. Here&apos;s what each status means
        and what you can do at each stage.
      </p>

      {/* Status lifecycle */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Status Lifecycle</h2>
        <div className="space-y-4">
          {statuses.map((status, idx) => (
            <div key={status.code} className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs text-gray-400 font-mono w-5">{idx + 1}.</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${status.color}`}>
                  {status.name}
                </span>
              </div>
              <p className="text-sm text-gray-600 ml-8 mb-1">{status.description}</p>
              <p className="text-sm text-gray-500 ml-8">
                <span className="font-medium text-gray-700">Your action:</span> {status.action}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard features */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Dashboard Features</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {dashboardFeatures.map((feature) => (
            <div key={feature.title} className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Next step */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <span className="text-sm text-gray-600">Next:</span>
        <Link href="/docs/pricing" className="text-sm text-secondary font-medium hover:underline flex items-center gap-1">
          Pricing & plans <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
