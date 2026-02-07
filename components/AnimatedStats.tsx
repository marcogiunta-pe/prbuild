'use client';

import { useEffect, useState, useRef } from 'react';

interface AnimatedNumberProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

function AnimatedNumber({ end, duration = 2000, suffix = '', prefix = '' }: AnimatedNumberProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            const startTime = Date.now();
            const animate = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Easing function for smooth animation
              const easeOutQuart = 1 - Math.pow(1 - progress, 4);
              setCount(Math.floor(easeOutQuart * end));
              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setCount(end);
              }
            };
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export function AnimatedStats() {
  return (
    <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
          <AnimatedNumber end={847} suffix="+" />
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Releases Published</div>
      </div>
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
          <AnimatedNumber end={23} suffix="%" />
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Journalist Pickup Rate</div>
      </div>
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
          <AnimatedNumber end={16} />
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Journalist Reviewers</div>
      </div>
    </div>
  );
}

export function AnimatedStatsBanner() {
  return (
    <div className="bg-primary/5 dark:bg-primary/10 py-8 border-y border-primary/10 dark:border-primary/20">
      <div className="container mx-auto px-4">
        <AnimatedStats />
      </div>
    </div>
  );
}

export default AnimatedStats;
