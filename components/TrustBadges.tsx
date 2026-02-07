'use client';

import { Shield, Clock, RefreshCw, Users, CreditCard, Zap } from 'lucide-react';

const badges = [
  {
    icon: Shield,
    text: 'Secure & Private',
  },
  {
    icon: Clock,
    text: '24-Hour Turnaround',
  },
  {
    icon: RefreshCw,
    text: 'Unlimited Revisions',
  },
  {
    icon: Users,
    text: '16 Journalist Reviews',
  },
  {
    icon: CreditCard,
    text: 'No Credit Card Required',
  },
  {
    icon: Zap,
    text: 'First Release Free',
  },
];

export function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
      {badges.map((badge) => (
        <div
          key={badge.text}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-full"
        >
          <badge.icon className="w-4 h-4 text-primary" />
          <span>{badge.text}</span>
        </div>
      ))}
    </div>
  );
}

export function TrustBadgesCompact() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
      {badges.slice(0, 4).map((badge) => (
        <div key={badge.text} className="flex items-center gap-1.5">
          <badge.icon className="w-4 h-4 text-green-500" />
          <span>{badge.text}</span>
        </div>
      ))}
    </div>
  );
}

export default TrustBadges;
