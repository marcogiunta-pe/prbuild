import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | PRBuild',
  description: 'Sign in to your PRBuild account to manage your press releases, view feedback, and track coverage.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
