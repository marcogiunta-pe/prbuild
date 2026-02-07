'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const MESSAGES = [
  { text: "Sarah from CloudApp just published a release", icon: "🟢" },
  { text: "TechCorp's release was picked up by 3 journalists", icon: "🟢" },
  { text: "New signup from San Francisco", icon: "🟢" },
  { text: "Journalist opened a release 2 min ago", icon: "🟢" },
  { text: "New release published · DataSync", icon: "🟢" },
];

export function SocialProofTicker() {
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % MESSAGES.length);
    }, 6000);
    return () => clearInterval(t);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm animate-in slide-in-from-left duration-300">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg px-4 py-3 flex items-center gap-3">
        <span className="text-lg">{MESSAGES[current].icon}</span>
        <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{MESSAGES[current].text}</p>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
