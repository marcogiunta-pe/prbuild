import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FileText, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import Stripe from 'stripe';

export const metadata: Metadata = {
  title: 'Payment Confirmed | PRBuild',
  robots: { index: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function KitSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect('/kit');
  }

  let paid = false;
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    paid = session.payment_status === 'paid';
  } catch {
    // Invalid or expired session
  }

  if (!paid) {
    return (
      <div className="min-h-screen bg-paper font-body">
        <header className="bg-surface-container-low">
          <div className="mx-auto max-w-5xl px-6 py-4 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-container" />
              <span className="font-headline text-xl font-extrabold text-on-surface">PRBuild</span>
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-xl px-6 py-24 text-center">
          <AlertCircle className="h-12 w-12 text-ink-muted mx-auto mb-6" />
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface mb-4">
            Payment not found.
          </h1>
          <p className="text-ink-muted leading-relaxed mb-8">
            We couldn&apos;t verify this payment. If you believe this is an error,
            please contact support.
          </p>
          <Link
            href="/kit"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-container px-8 py-3 text-base font-headline font-bold text-on-primary transition-all hover:opacity-90 active:scale-95 min-h-[44px]"
          >
            Back to Launch PR Kit
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper font-body">
      {/* Minimal header */}
      <header className="border-b border-rule bg-paper-light">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-display text-xl text-ink">PRBuild</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <CheckCircle className="h-12 w-12 text-primary mx-auto mb-6" />
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface mb-4">
          Payment confirmed.
        </h1>
        <p className="text-ink-muted leading-relaxed mb-8">
          Your Launch PR Kit is on the way. Create your account to fill out
          the intake form and we&apos;ll deliver your press release, pitch
          emails, and panel review within 24 hours.
        </p>
        <Link
          href="/signup?from=kit"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-container px-8 py-3 text-base font-headline font-bold text-on-primary transition-all hover:opacity-90 active:scale-95 min-h-[44px]"
        >
          Create Your Account
          <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="text-xs text-ink-muted mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </main>
    </div>
  );
}
