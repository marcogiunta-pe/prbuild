'use client';

import { useRef, useState, useEffect } from 'react';
import { Users, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function AnimatedScore({ end = 8.5, duration = 1200 }: { end?: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const step = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setValue(Number((easeOut * end).toFixed(1)));
            if (progress < 1) requestAnimationFrame(step);
            else setValue(end);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return <span ref={ref}>{value}/10</span>;
}

export function HeroMockup() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / 40;
    const y = (e.clientY - centerY) / 40;
    setTransform({ x: Math.max(-4, Math.min(4, x)), y: Math.max(-4, Math.min(4, y)) });
  };

  const handleMouseLeave = () => setTransform({ x: 0, y: 0 });

  return (
    <div
      className="max-w-4xl mx-auto w-full overflow-hidden px-2 sm:px-0"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className="hero-mockup-card relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-transform duration-200 ease-out w-full max-w-full animate-pulse-glow"
        style={{
          transform: `perspective(800px) rotateY(${transform.x}deg) rotateX(${-transform.y}deg)`,
        }}
      >
        {/* Browser chrome — macOS style */}
        <div className="bg-gradient-to-b from-gray-100 to-gray-90 dark:from-gray-700 dark:to-gray-800 px-3 sm:px-4 py-2 sm:py-2.5 border-b border-gray-200 dark:border-gray-600 flex items-center gap-2 sm:gap-3">
          <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white/80 dark:bg-gray-900/80 rounded-md px-2 sm:px-4 py-1.5 text-[10px] sm:text-xs text-gray-500 shadow-inner max-w-[140px] sm:max-w-xs w-full text-center truncate">
              app.prbuild.ai/dashboard
            </div>
          </div>
          <div className="w-12" />
        </div>
        <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900/50">
          <div className="grid md:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm font-semibold text-gray-900 mb-3">Your Releases</div>
              <div className="space-y-2">
                <div className="bg-green-50 border border-green-200 rounded-md p-2 text-xs">
                  <div className="font-medium text-green-800">TechCorp Launch</div>
                  <div className="text-green-600">Published • 847 views</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-2 text-xs">
                  <div className="font-medium text-blue-800">Q4 Results</div>
                  <div className="text-blue-600">In Review</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-2 text-xs">
                  <div className="font-medium text-gray-800">Partnership News</div>
                  <div className="text-gray-600">Draft</div>
                </div>
              </div>
            </div>
            <div className="md:col-span-2 bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-gray-900">Panel Feedback</div>
                <Badge className="bg-green-100 text-green-800 text-xs">
                  Score: <AnimatedScore />
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3 text-xs">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 flex-1">
                    <div className="font-medium text-gray-900">Tech Journalist</div>
                    <div className="text-gray-600">&quot;Strong headline. Add specific metrics in paragraph 2.&quot;</div>
                  </div>
                </div>
                <div className="flex gap-3 text-xs">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 flex-1">
                    <div className="font-medium text-gray-900">PR Expert</div>
                    <div className="text-gray-600">&quot;Quote placement is perfect. Consider adding a call-to-action.&quot;</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
