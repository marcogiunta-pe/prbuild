import { Metadata } from 'next';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PRScoreQuiz } from '@/components/quiz/PRScoreQuiz';

export const metadata: Metadata = {
  title: 'Grade Your Press Release — Free 23-Point PR Quiz | PRBuild',
  description: 'Score your press release against the 23 things journalists check before they hit delete. Get a personalized report with actionable recommendations.',
  keywords: [
    'press release quiz',
    'grade my press release',
    'PR score',
    'press release checker',
    'press release grader',
    'press release audit',
  ],
  openGraph: {
    title: 'Grade Your Press Release — Free 23-Point PR Quiz | PRBuild',
    description: 'Score your press release against the 23 things journalists check before they hit delete.',
  },
  alternates: { canonical: 'https://prbuild.ai/resources/pr-score' },
};

export default function PRScorePage() {
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
              Get Free Release &rarr;
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Grade Your Press Release
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Answer 23 yes/no questions about your press release and get a score plus
            personalized recommendations to improve your chances of getting coverage.
          </p>
        </div>
      </section>

      {/* Quiz */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <PRScoreQuiz />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} PRBuild. All rights reserved. |{' '}
            <Link href="/privacy" className="hover:text-white">Privacy</Link> |{' '}
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
