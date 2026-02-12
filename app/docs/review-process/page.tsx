import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Review Process',
  description: 'How the PRBuild journalist panel reviews your press release. Learn about feedback types, panel scores, and how critiques improve your release.',
  alternates: { canonical: 'https://prbuild.ai/docs/review-process' },
};

const personas = [
  { role: 'Tech Reporter', focus: 'Technical accuracy, product differentiation, market context' },
  { role: 'Business Editor', focus: 'Financial viability, market size, competitive positioning' },
  { role: 'Industry Analyst', focus: 'Industry trends, analyst-ready data, benchmarks' },
  { role: 'Consumer Journalist', focus: 'Human impact, real-world use cases, accessibility' },
  { role: 'Copy Editor', focus: 'AP style, grammar, clarity, readability' },
  { role: 'Headline Specialist', focus: 'Headline strength, SEO, click-worthiness' },
];

const feedbackTypes = [
  {
    icon: Star,
    title: 'Compelling',
    description: 'Whether the release would make the journalist want to cover the story. A yes/no assessment per persona.',
    color: 'text-yellow-600 bg-yellow-50',
  },
  {
    icon: MessageSquare,
    title: 'Detailed Feedback',
    description: 'Specific comments on what works, what doesn\'t, and how to improve. Each persona writes 2-3 sentences.',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: AlertTriangle,
    title: 'What\'s Missing',
    description: 'Key information or angles the release should include. Common: specific numbers, customer quotes, competitive context.',
    color: 'text-orange-600 bg-orange-50',
  },
  {
    icon: CheckCircle,
    title: 'Verdict',
    description: 'A one-line summary from each persona: "publish as-is," "needs minor edits," or "needs major revision."',
    color: 'text-green-600 bg-green-50',
  },
];

const contrarianFields = [
  { label: 'Remove', description: 'What to cut — filler, jargon, or weak claims that dilute the message.' },
  { label: 'Sharpen', description: 'Specific phrases or sections that need tightening or stronger language.' },
  { label: 'Risk', description: 'Bold angles that might polarize but would generate more coverage.' },
  { label: 'Ignore', description: 'Common PR advice that doesn\'t apply to this specific release.' },
];

export default function ReviewProcessPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Review Process</h1>
      <p className="text-lg text-gray-600 mb-12 max-w-2xl">
        Every PRBuild release is reviewed by a panel of 16 AI journalist personas before
        you see it. Here&apos;s how the process works and what the feedback looks like.
      </p>

      {/* How it works */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">The Panel</h2>
        <p className="text-gray-600 mb-6">
          Our panel includes 16 distinct journalist personas, each with a different beat,
          publication type, and editorial lens. Here are some of the perspectives represented:
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {personas.map((p) => (
            <div key={p.role} className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-1">{p.role}</h3>
              <p className="text-sm text-gray-500">{p.focus}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Plus 10 additional personas covering healthcare, finance, consumer, international, and specialty beats.
        </p>
      </section>

      {/* Feedback types */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Feedback Types</h2>
        <p className="text-gray-600 mb-6">
          Each persona provides four types of feedback on your release:
        </p>
        <div className="space-y-4">
          {feedbackTypes.map((type) => (
            <div key={type.title} className="flex gap-4 items-start">
              <div className={`p-2 rounded-lg flex-shrink-0 ${type.color}`}>
                <type.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{type.title}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Synthesis */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Panel Synthesis</h2>
        <p className="text-gray-600 mb-4">
          After all 16 personas review the draft, their feedback is synthesized into a single
          summary with clear action items. The synthesis includes:
        </p>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start gap-2">
            <ArrowRight className="h-4 w-4 text-secondary flex-shrink-0 mt-1" />
            Consensus points (what most personas agree on)
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="h-4 w-4 text-secondary flex-shrink-0 mt-1" />
            Specific revisions applied to the draft
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="h-4 w-4 text-secondary flex-shrink-0 mt-1" />
            An overall panel score reflecting newsworthiness and quality
          </li>
        </ul>
      </section>

      {/* Contrarian recommendation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contrarian Recommendation</h2>
        <p className="text-gray-600 mb-6">
          In addition to the synthesis, you receive a contrarian recommendation — unconventional
          suggestions designed to make your release stand out:
        </p>
        <div className="space-y-3">
          {contrarianFields.map((field) => (
            <div key={field.label} className="flex gap-3 items-start border rounded-lg p-4">
              <span className="text-sm font-semibold text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                {field.label}
              </span>
              <p className="text-sm text-gray-600">{field.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Next step */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <span className="text-sm text-gray-600">Next:</span>
        <Link href="/docs/managing-releases" className="text-sm text-secondary font-medium hover:underline flex items-center gap-1">
          Managing your releases <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
