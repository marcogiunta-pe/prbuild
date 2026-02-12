import { Metadata } from 'next';
import Link from 'next/link';
import { ClipboardEdit, Bot, Users, Pencil, Globe, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'The 5-step PRBuild process: submit your details, AI drafts your release, journalists review it, you revise, and we publish.',
  alternates: { canonical: 'https://prbuild.ai/docs/how-it-works' },
};

const steps = [
  {
    number: 1,
    title: 'Submit Your Details',
    icon: ClipboardEdit,
    description: 'Fill out our intake form with your company info, news hook, key facts, and quotes. Takes about 5 minutes.',
    details: [
      'Company name, website, and industry',
      'What you\'re announcing and why it matters',
      'Key facts, figures, and quote sources',
      'Media contact info and desired call-to-action',
    ],
  },
  {
    number: 2,
    title: 'AI Drafts Your Release',
    icon: Bot,
    description: 'Our AI engine generates a professional press release based on your input, including headline options, subhead, and full body copy.',
    details: [
      'Multiple headline options to choose from',
      'AP-style formatting and structure',
      'Boilerplate and contact section',
      'Visual and distribution suggestions',
    ],
  },
  {
    number: 3,
    title: 'Journalist Panel Review',
    icon: Users,
    description: 'A panel of 16 AI journalist personas evaluates your draft from different perspectives — tech reporters, editors, industry specialists, and more.',
    details: [
      'Each persona rates newsworthiness and clarity',
      'Specific feedback on what works and what\'s missing',
      'A synthesis of all feedback into actionable notes',
      'Contrarian recommendation for bold improvements',
    ],
  },
  {
    number: 4,
    title: 'Review & Revise',
    icon: Pencil,
    description: 'You receive the polished draft with journalist feedback baked in. Review it, request changes, or approve it as-is.',
    details: [
      'Side-by-side view of draft and feedback',
      'Request specific revisions with comments',
      'One revision round included with every plan',
      'Quality review ensures final polish',
    ],
  },
  {
    number: 5,
    title: 'Publish & Distribute',
    icon: Globe,
    description: 'Your approved release is published to the PRBuild Showcase and distributed to journalists who opted in for your industry.',
    details: [
      'Live on the public Showcase page',
      'Included in the journalist newsletter',
      'Shareable link for your own outreach',
      'Track views, shares, and journalist clicks',
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h1>
      <p className="text-lg text-gray-600 mb-12 max-w-2xl">
        From submission to publication in five steps. Most releases are ready for
        your review within 24 hours.
      </p>

      <div className="space-y-12">
        {steps.map((step, idx) => (
          <div key={step.number} className="relative">
            {/* Connector line */}
            {idx < steps.length - 1 && (
              <div className="hidden md:block absolute left-6 top-16 bottom-0 w-px bg-gray-200" />
            )}

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-lg">
                {step.number}
              </div>
              <div className="flex-1 pb-8">
                <div className="flex items-center gap-3 mb-2">
                  <step.icon className="h-5 w-5 text-secondary" />
                  <h2 className="text-xl font-semibold text-gray-900">{step.title}</h2>
                </div>
                <p className="text-gray-600 mb-4">{step.description}</p>
                <ul className="space-y-2">
                  {step.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2 text-sm text-gray-500">
                      <ArrowRight className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 p-6 bg-secondary/5 rounded-xl text-center">
        <p className="font-medium text-gray-900 mb-2">Ready to get started?</p>
        <p className="text-sm text-gray-600 mb-4">Your first release is free — no credit card required.</p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 bg-secondary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-secondary/90 transition-colors"
        >
          Create Your Free Release <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
