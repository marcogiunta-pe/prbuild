'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Users, Globe, X } from 'lucide-react';

const STORAGE_KEY = 'prbuild_welcome_seen';

const steps = [
  { icon: FileText, text: 'Fill out a quick form with your news and company details' },
  { icon: Users, text: 'AI + journalist panel crafts and reviews your release' },
  { icon: Globe, text: 'Review, revise, and publish to journalists in your industry' },
];

export function WelcomeModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 relative">
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-7 w-7 text-secondary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to PRBuild!</h2>
          <p className="text-gray-600">
            Create professional press releases that journalists actually want to read.
            Here&apos;s how it works:
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                <step.icon className="h-4 w-4 text-secondary" />
              </div>
              <p className="text-sm text-gray-700 pt-1">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Link href="/dashboard/new-request" onClick={dismiss} className="block">
            <Button className="w-full bg-secondary hover:bg-secondary/90">
              Get Started
            </Button>
          </Link>
          <button
            onClick={dismiss}
            className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
          >
            I&apos;ll explore on my own
          </button>
        </div>
      </div>
    </div>
  );
}
