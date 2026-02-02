// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PRBuild - Professional Press Releases That Get Coverage',
  description: 'AI-powered press release creation with human quality control. Get journalist-quality press releases starting at $9.',
  keywords: ['press release', 'PR', 'public relations', 'media coverage', 'press release writing'],
  openGraph: {
    title: 'PRBuild - Professional Press Releases That Get Coverage',
    description: 'AI-powered press release creation with human quality control.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
