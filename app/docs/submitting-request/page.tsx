import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Lightbulb } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Submitting a Request',
  description: 'Step-by-step walkthrough of the PRBuild intake form. Learn what information you need and tips for a great submission.',
  alternates: { canonical: 'https://prbuild.ai/docs/submitting-request' },
};

const formSteps = [
  {
    number: 1,
    title: 'Company Information',
    fields: [
      { name: 'Company Name', required: true, tip: 'Use your official company name as it should appear in the release.' },
      { name: 'Company Website', required: true, tip: 'Must be a valid URL. This appears in the boilerplate section.' },
      { name: 'Industry', required: true, tip: 'Choose the closest match — it determines which journalists receive your release.' },
    ],
  },
  {
    number: 2,
    title: 'Announcement Details',
    fields: [
      { name: 'Announcement Type', required: true, tip: 'Product launch, funding, partnership, hire, award, event, milestone, or other.' },
      { name: 'News Hook', required: true, tip: 'The single most important thing you\'re announcing. Lead with the news, not the background.' },
      { name: 'Dateline City', required: true, tip: 'The city that appears at the start of the release (e.g. "SAN FRANCISCO").' },
      { name: 'Release Date', required: true, tip: 'When you want the release published. We need at least 24 hours lead time.' },
    ],
  },
  {
    number: 3,
    title: 'Key Facts & Quotes',
    fields: [
      { name: 'Core Facts', required: true, tip: 'Add 3-5 bullet points. Include specific numbers — "$2M raised" is stronger than "significant funding."' },
      { name: 'Quote Sources', required: false, tip: 'Name, title, and optionally a draft quote. We\'ll polish it if provided, or write one if not.' },
    ],
  },
  {
    number: 4,
    title: 'Company Background',
    fields: [
      { name: 'Boilerplate', required: false, tip: 'Your standard "About [Company]" paragraph. We\'ll use it at the end of the release.' },
      { name: 'Company Facts', required: false, tip: 'Additional context: founding year, team size, notable customers, etc.' },
    ],
  },
  {
    number: 5,
    title: 'Media Contact',
    fields: [
      { name: 'Contact Name', required: true, tip: 'The person journalists should reach out to.' },
      { name: 'Contact Title', required: false, tip: 'Their role at the company.' },
      { name: 'Contact Email', required: true, tip: 'Must be a valid email. This appears publicly in the release.' },
      { name: 'Contact Phone', required: false, tip: 'Optional but recommended — journalists sometimes prefer to call.' },
    ],
  },
  {
    number: 6,
    title: 'Extras & CTA',
    fields: [
      { name: 'Visuals Description', required: false, tip: 'Describe any images, screenshots, or videos you plan to use.' },
      { name: 'Desired CTA', required: true, tip: 'What should readers do next? E.g. "Visit example.com" or "Sign up for the beta."' },
      { name: 'Supporting Materials', required: false, tip: 'Links to docs, pitch decks, or background info that helps us write a better release.' },
    ],
  },
];

const proTips = [
  'Lead with the news. "Company X raises $5M" is better than "Company X, founded in 2020, today announced..."',
  'Include specific numbers. Revenue, users, funding amount, growth percentage — concrete data makes releases newsworthy.',
  'Keep quotes authentic. Write how the person actually talks, not corporate-speak.',
  'Choose the right announcement type. It affects how we structure the release and which journalists see it.',
  'Provide supporting materials. Background context helps us write a stronger release faster.',
];

export default function SubmittingRequestPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Submitting a Request</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl">
        The intake form has 6 sections. Most people complete it in about 5 minutes.
        Fields marked with * are required.
      </p>

      {/* Pro tips */}
      <div className="mb-12 p-6 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-5 w-5 text-amber-600" />
          <h2 className="font-semibold text-amber-900">Tips from Our Journalists</h2>
        </div>
        <ul className="space-y-2">
          {proTips.map((tip) => (
            <li key={tip} className="text-sm text-amber-800 flex items-start gap-2">
              <ArrowRight className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-600" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Form steps */}
      <div className="space-y-10">
        {formSteps.map((step) => (
          <div key={step.number}>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-sm font-bold">
                {step.number}
              </span>
              <h2 className="text-xl font-semibold text-gray-900">{step.title}</h2>
            </div>
            <div className="ml-11 space-y-4">
              {step.fields.map((field) => (
                <div key={field.name} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">{field.name}</h3>
                    {field.required && (
                      <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Required</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{field.tip}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Next step */}
      <div className="mt-12 flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <span className="text-sm text-gray-600">After submitting:</span>
        <Link href="/docs/review-process" className="text-sm text-secondary font-medium hover:underline flex items-center gap-1">
          Learn about the review process <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
