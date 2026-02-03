import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileText, Gift, Users, DollarSign, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Referral Program - Earn Free Press Releases | PRBuild',
  description: 'Refer friends to PRBuild and earn free press releases. Give $10, get $10. No limit on referrals.',
  keywords: [
    'PRBuild referral',
    'press release referral program',
    'earn free press releases',
  ],
  openGraph: {
    title: 'Referral Program - Earn Free Press Releases | PRBuild',
    description: 'Give $10, get $10. Refer friends and earn free press releases.',
  },
};

const steps = [
  {
    icon: Users,
    title: 'Share Your Link',
    description: 'Get your unique referral link from your dashboard. Share it with friends, colleagues, or your network.',
  },
  {
    icon: Gift,
    title: 'They Get $10 Off',
    description: 'Your friends get $10 off their first paid month. That\'s basically a free month on our Starter plan.',
  },
  {
    icon: DollarSign,
    title: 'You Get $10 Credit',
    description: 'When they subscribe to a paid plan, you get $10 credit toward your next release. Stack unlimited credits.',
  },
];

const faqs = [
  {
    question: 'How do I get my referral link?',
    answer: 'Sign up for a free account, then go to your dashboard. Your unique referral link is in the Account section.',
  },
  {
    question: 'Is there a limit to how many people I can refer?',
    answer: 'No limit! Refer as many people as you want. Each successful referral earns you $10 credit.',
  },
  {
    question: 'When do I get my credit?',
    answer: 'Credits are applied to your account as soon as your referral subscribes to a paid plan. You\'ll get an email notification.',
  },
  {
    question: 'Do credits expire?',
    answer: 'No, referral credits never expire. Use them whenever you want.',
  },
  {
    question: 'Can I refer myself?',
    answer: 'Nice try! Referral links are tracked by email, so self-referrals aren\'t possible.',
  },
];

export default function ReferralPage() {
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
              Sign Up Free →
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-yellow-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Gift className="w-4 h-4" />
            Referral Program
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Give $10, Get $10<br />
            <span className="text-primary">Earn Free Press Releases</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Share PRBuild with friends. When they subscribe, you both save money.
            No limit on referrals. Stack unlimited credits.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90">
              Get Your Referral Link
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Example: Stack Your Savings
            </h2>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">You refer 3 friends</span>
                  <span className="font-semibold">3 × $10 = $30 credit</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Your monthly plan</span>
                  <span className="font-semibold">$29/month (Pro)</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">After credits</span>
                  <span className="font-semibold text-green-600">$0 this month!</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Remaining credit</span>
                  <span className="font-semibold">$1 (rolls over)</span>
                </div>
              </div>
              <div className="mt-8 bg-primary/5 rounded-xl p-4 text-center">
                <p className="text-primary font-semibold">
                  Refer 3 friends per month = Free PRBuild forever
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mock Referral Link */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Your Referral Link
            </h2>
            <p className="text-gray-600 mb-8">
              Sign up to get your unique referral link
            </p>
            <div className="bg-gray-100 rounded-xl p-4 flex items-center gap-3">
              <div className="flex-1 text-left text-gray-400 text-sm truncate">
                https://prbuild.vercel.app/r/your-unique-code
              </div>
              <Button variant="outline" size="sm" disabled>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            <Link href="/signup" className="block mt-6">
              <Button className="bg-secondary hover:bg-secondary/90">
                Sign Up to Get Your Link
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Earning Free Releases
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Sign up for free. Share your link. Earn unlimited credits.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Get Started Free
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
