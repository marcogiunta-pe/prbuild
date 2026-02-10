import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function SetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 flex flex-col">
      <header className="p-6">
        <Link href="/" className="flex items-center space-x-2 w-fit">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">PRBuild</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
      <footer className="p-6 text-center text-sm text-gray-500">
        © 2026 PRBuild. All rights reserved.
      </footer>
    </div>
  );
}
