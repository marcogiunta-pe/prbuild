import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Subscribe to Press Releases | PRBuild for Journalists',
  description: 'Opt in to receive relevant press releases in your beat areas. Only get news you care about. Unsubscribe anytime.',
};

export default function JournalistSubscribeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
