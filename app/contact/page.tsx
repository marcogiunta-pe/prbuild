import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Mail, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Contact PRBuild - Get in Touch',
  description: 'Have questions about PRBuild? Contact our team for support, sales inquiries, or partnership opportunities.',
  openGraph: {
    title: 'Contact PRBuild - Get in Touch',
    description: 'We\'re here to help. Reach out anytime.',
  },
  alternates: { canonical: 'https://prbuild.ai/contact' },
};

const contactOptions = [
  {
    icon: Mail,
    title: 'General Inquiries',
    description: 'Questions about PRBuild or how it works?',
    contact: 'hello@prbuild.ai',
    response: 'We respond within 24 hours',
  },
  {
    icon: MessageSquare,
    title: 'Customer Support',
    description: 'Need help with your account or releases?',
    contact: 'support@prbuild.ai',
    response: 'We respond within 4 hours',
  },
  {
    icon: Clock,
    title: 'Sales & Enterprise',
    description: 'Agency pricing or custom solutions?',
    contact: 'sales@prbuild.ai',
    response: 'We respond within 24 hours',
  },
];

const faqs = [
  {
    q: 'How quickly do you respond?',
    a: 'Support emails get a response within 4 hours during business hours (9am-6pm EST, Monday-Friday). Other inquiries within 24 hours.',
  },
  {
    q: 'Do you offer phone support?',
    a: 'Not currently. We\'ve found email support allows us to give more thoughtful, detailed responses. For urgent issues, email support@prbuild.ai with "URGENT" in the subject.',
  },
  {
    q: 'I\'m a journalist. How do I get added to your list?',
    a: 'Visit prbuild.ai/journalist/subscribe to opt-in to receive press releases in your beat areas. You can unsubscribe anytime.',
  },
];

export default function ContactPage() {
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
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have a question? We're here to help. Choose the best way to reach us below.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {contactOptions.map((option) => (
              <div key={option.title} className="bg-gray-50 rounded-2xl p-8 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <option.icon className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-xl font-bold mb-2">{option.title}</h2>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <a 
                  href={`mailto:${option.contact}`}
                  className="text-primary font-semibold hover:underline block mb-2"
                >
                  {option.contact}
                </a>
                <p className="text-sm text-gray-500">{option.response}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Questions */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Common Questions</h2>
          <div className="max-w-2xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/faq" className="text-primary hover:underline">
              View all FAQs →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Rather Just Try It?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Your first release is free. See how PRBuild works firsthand.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90">
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
