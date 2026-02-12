import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FAQContent } from '@/components/FAQContent';

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions | PRBuild',
  description: 'Get answers to common questions about PRBuild press release service. Pricing, features, journalist personas, distribution, and more.',
  keywords: [
    'PRBuild FAQ',
    'press release service FAQ',
    'PRBuild pricing',
    'how PRBuild works',
    'press release questions',
  ],
  openGraph: {
    title: 'FAQ - Frequently Asked Questions | PRBuild',
    description: 'Get answers to common questions about PRBuild.',
  },
  alternates: { canonical: 'https://prbuild.ai/faq' },
};

const faqCategories = [
  {
    name: 'Getting Started',
    questions: [
      {
        q: 'How does PRBuild work?',
        a: 'You fill out a simple form about your news (company name, what happened, why it matters). Our AI drafts a press release, humans refine it, and 16 journalist personas review it. You get the draft with feedback, request any changes, then we distribute it to relevant journalists.',
      },
      {
        q: 'Is the first release really free?',
        a: 'Yes, completely free. No credit card required. We want you to see the quality before you pay anything. If you love it, upgrade to a paid plan. If not, you still got a free professional press release.',
      },
      {
        q: 'How long does it take to get my press release?',
        a: 'Typically 24 hours from when you submit your request. Rush turnaround (same-day) is available on the Pro plan.',
      },
      {
        q: 'What information do I need to provide?',
        a: 'Just the basics: your company name, what the news is, why it matters, and any specific details you want included. We handle the writing, formatting, and journalist-speak.',
      },
    ],
  },
  {
    name: 'The Journalist Personas',
    questions: [
      {
        q: 'What are the 16 journalist personas?',
        a: 'Our journalist personas are AI models trained on real journalist preferences across different beats: tech, business, lifestyle, local news, trade publications, finance, and more. Each persona evaluates your release from their specific perspective.',
      },
      {
        q: 'What feedback do they provide?',
        a: 'Each persona reviews for newsworthiness, clarity, hook strength, and what would make them actually cover your story. You get specific suggestions like "add metrics in paragraph 2" or "the lead buries the news."',
      },
      {
        q: 'Why 16 personas?',
        a: 'Different journalists care about different things. A tech blogger wants specs. A business reporter wants revenue impact. A local news editor wants the local angle. 16 perspectives means your release is optimized for multiple audiences.',
      },
    ],
  },
  {
    name: 'Pricing & Plans',
    questions: [
      {
        q: 'What does each plan include?',
        a: 'Starter ($9/mo): 1 release/month, journalist panel review, one revision round. Growth ($19/mo): 3 releases/month, everything in Starter plus priority turnaround and detailed analytics. Pro ($39/mo): 5 releases/month, everything in Growth plus rush delivery and dedicated support.',
      },
      {
        q: 'Can I upgrade or downgrade anytime?',
        a: 'Yes, you can change your plan at any time. Upgrades take effect immediately. Downgrades take effect at your next billing cycle.',
      },
      {
        q: 'Do unused releases roll over?',
        a: 'No, releases don\'t roll over month to month. This keeps our pricing low. If you consistently need more releases, the Pro plan (5/month) may be a better fit.',
      },
      {
        q: 'Is there a contract or commitment?',
        a: 'No contracts. Cancel anytime with one click. We\'re month-to-month because we want you to stay because you love the product, not because you\'re locked in.',
      },
    ],
  },
  {
    name: 'Distribution',
    questions: [
      {
        q: 'How does distribution work?',
        a: 'We send your release to journalists who have opted in to receive news in your category. Unlike wire services that blast to everyone, we target journalists who actually want news like yours.',
      },
      {
        q: 'What\'s the pickup rate?',
        a: 'Our pickup rate is 23%, measuring journalist engagement within 7 days of distribution. This includes opens, clicks, replies, and coverage. The industry average for wire services is around 2%.',
      },
      {
        q: 'Do you guarantee coverage?',
        a: 'No one can guarantee coverage—journalists make their own decisions. But we dramatically improve your odds with better writing, journalist feedback, and targeted distribution.',
      },
      {
        q: 'Where is my release published?',
        a: 'Every release is published on our public Showcase (prbuild.ai/showcase), distributed to our journalist email list, and sent to category-specific newsletter subscribers.',
      },
    ],
  },
  {
    name: 'Quality & Revisions',
    questions: [
      {
        q: 'What if I don\'t like the draft?',
        a: 'Request unlimited revisions until you\'re happy. Seriously, unlimited. We\'d rather revise 10 times than send something you\'re not proud of.',
      },
      {
        q: 'Is the content AI-generated?',
        a: 'The initial draft uses AI, but every release is refined by humans and reviewed by our 16 journalist personas. The final product doesn\'t sound like AI—that\'s the whole point.',
      },
      {
        q: 'Can I see examples of your work?',
        a: 'Yes! Visit our Showcase to see real published releases. You can also check our examples page for annotated samples that got coverage.',
      },
    ],
  },
  {
    name: 'Comparison',
    questions: [
      {
        q: 'How is PRBuild different from PRWeb?',
        a: 'PRWeb charges $400+ per release for distribution only—you write it yourself. PRBuild starts at $9/month and includes writing, journalist feedback, and distribution. See our full comparison at /compare/prweb.',
      },
      {
        q: 'Why not just use ChatGPT?',
        a: 'ChatGPT writes press releases that sound like AI. Journalists spot them instantly and delete them. Our process includes human refinement and journalist persona feedback specifically to make releases that don\'t trigger that "AI garbage" instinct.',
      },
      {
        q: 'Should I use PRBuild or a PR agency?',
        a: 'PR agencies make sense if you have $3,000+/month budget, need ongoing media relationships, and want strategic counsel. PRBuild is better if you need occasional press releases done well at startup-friendly prices.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">PRBuild</span>
          </Link>
          <Link href="/signup">
            <Button className="bg-secondary hover:bg-secondary/90">
              Get Free Release →
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about PRBuild. Can't find your answer?
            Email us at support@prbuild.ai.
          </p>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <FAQContent faqCategories={faqCategories} />
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-lg text-gray-600 mb-8">
            We're here to help. Email us and we'll get back to you within 24 hours.
          </p>
          <a href="mailto:support@prbuild.ai">
            <Button size="lg" variant="outline">
              Email support@prbuild.ai
            </Button>
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Your first press release is free. See the quality before you pay anything.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Get Your Free Release
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} PRBuild. All rights reserved. |{' '}
            <Link href="/privacy" className="hover:text-white">Privacy</Link> |{' '}
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
