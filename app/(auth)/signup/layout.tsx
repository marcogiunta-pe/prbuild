import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Start Free Trial | PRBuild',
  description: 'Create your PRBuild account. Your first press release is free — no credit card required. AI writing, 16 journalist reviewers, real distribution.',
  openGraph: {
    title: 'Start Free Trial | PRBuild',
    description: 'Your first press release free. No credit card. AI writing, journalist panel review, 23% pickup rate.',
    url: 'https://prbuild.ai/signup',
  },
  alternates: { canonical: 'https://prbuild.ai/signup' },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
