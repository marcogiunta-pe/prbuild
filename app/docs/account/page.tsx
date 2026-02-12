import { Metadata } from 'next';
import Link from 'next/link';
import { User, Building, Lock, Mail, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Account Settings',
  description: 'Manage your PRBuild account: profile information, company details, password, and email preferences.',
  alternates: { canonical: 'https://prbuild.ai/docs/account' },
};

const sections = [
  {
    icon: User,
    title: 'Profile Information',
    description: 'Your name and contact details used across the platform.',
    fields: [
      { name: 'Full Name', info: 'Used in email communications and release contacts. Editable at any time.' },
      { name: 'Email', info: 'Your login email. Contact support to change this.' },
    ],
    path: '/dashboard/account',
  },
  {
    icon: Building,
    title: 'Company Information',
    description: 'Company details that auto-fill when you create new release requests.',
    fields: [
      { name: 'Company Name', info: 'Pre-fills the Company Name field in new requests.' },
      { name: 'Company Website', info: 'Pre-fills the Company Website field in new requests.' },
    ],
    path: '/dashboard/account',
  },
  {
    icon: Lock,
    title: 'Password',
    description: 'Keep your account secure with a strong password.',
    fields: [
      { name: 'Change Password', info: 'Enter your current password and a new one. Must be at least 8 characters.' },
      { name: 'Forgot Password', info: 'Use the "Forgot Password" link on the login page to reset via email.' },
    ],
    path: '/dashboard/account',
  },
  {
    icon: Mail,
    title: 'Email Notifications',
    description: 'You receive email notifications at key stages of the release lifecycle.',
    fields: [
      { name: 'Draft Ready', info: 'Sent when your press release draft is ready for review.' },
      { name: 'Feedback Received', info: 'Confirmation that we received your revision feedback.' },
      { name: 'Release Published', info: 'Notification when your release goes live on the Showcase.' },
      { name: 'Action Required', info: 'Reminder when your draft is waiting for your review.' },
    ],
    path: null,
  },
];

const tips = [
  'Keep your company info up to date — it auto-fills in new requests, saving you time.',
  'Use a strong, unique password. We recommend a password manager.',
  'Email notifications can\'t be disabled — they\'re sent at critical lifecycle stages to keep you informed.',
  'If you need to change your email address, contact support. We\'ll verify and update it for you.',
];

export default function AccountPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Account Settings</h1>
      <p className="text-lg text-gray-600 mb-12 max-w-2xl">
        Manage your profile, company information, password, and understand how
        email notifications work.
      </p>

      {/* Sections */}
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                <section.icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
            </div>
            <div className="ml-12 space-y-3">
              {section.fields.map((field) => (
                <div key={field.name} className="border rounded-lg p-3">
                  <h3 className="font-medium text-gray-900 text-sm mb-0.5">{field.name}</h3>
                  <p className="text-sm text-gray-600">{field.info}</p>
                </div>
              ))}
              {section.path && (
                <Link
                  href={section.path}
                  className="inline-flex items-center gap-1 text-sm text-secondary font-medium hover:underline mt-2"
                >
                  Go to {section.title.toLowerCase()} <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-12 p-6 bg-gray-50 rounded-xl">
        <h2 className="font-semibold text-gray-900 mb-3">Tips</h2>
        <ul className="space-y-2">
          {tips.map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-sm text-gray-600">
              <ArrowRight className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Support */}
      <div className="mt-8 p-4 border rounded-lg flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">Need help?</h3>
          <p className="text-sm text-gray-600">Our support team is here for you.</p>
        </div>
        <Link
          href="/contact"
          className="text-sm text-secondary font-medium hover:underline flex items-center gap-1"
        >
          Contact Support <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
