'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const MESSAGES = [
  { text: "TechFlow's release was picked up by 3 journalists", icon: "🟢" },
  { text: "New release published — delivered in 22 hours", icon: "🟢" },
  { text: "Journalist replied to a release 4 min ago", icon: "🟢" },
  { text: "DataSync's release scored 9.2/10 from panel", icon: "🟢" },
  { text: "New signup from Austin, TX", icon: "🟢" },
  { text: "GreenTech's release featured in industry newsletter", icon: "🟢" },
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
      <div className="bg-white/95 backdrop-blur border border-gray-200 rounded-lg shadow-lg px-4 py-3 flex items-center gap-3">
        <span className="text-lg">{MESSAGES[current].icon}</span>
        <p className="text-sm text-gray-700 flex-1">{MESSAGES[current].text}</p>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-gray-400 hover:text-gray-600 rounded min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
