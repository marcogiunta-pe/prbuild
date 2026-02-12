import { Metadata } from 'next';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocsSidebar } from '@/components/docs/DocsSidebar';

export const metadata: Metadata = {
  title: {
    default: 'Documentation',
    template: '%s | PRBuild Docs',
  },
  description: 'Learn how to use PRBuild to create, review, and distribute professional press releases.',
  openGraph: {
    title: 'PRBuild Documentation',
    description: 'Learn how to use PRBuild to create, review, and distribute professional press releases.',
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">PRBuild</span>
            </Link>
            <span className="text-sm text-gray-400 hidden sm:inline">|</span>
            <Link href="/docs" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:inline">
              Docs
            </Link>
          </div>
          <Link href="/signup">
            <Button className="bg-secondary hover:bg-secondary/90">
              Get Free Release
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex">
        <DocsSidebar />
        <main className="flex-1 min-w-0 px-4 py-8 md:px-8 lg:px-12 max-w-4xl">
          {children}
        </main>
      </div>

      {/* Minimal footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} PRBuild. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/contact" className="hover:text-gray-900">Contact</Link>
            <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-900">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
