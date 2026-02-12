'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { analytics } from '@/lib/analytics';

interface FAQ {
  q: string;
  a: string;
}

interface FAQCategory {
  name: string;
  questions: FAQ[];
}

interface FAQContentProps {
  faqCategories: FAQCategory[];
}

export function FAQContent({ faqCategories }: FAQContentProps) {
  // Initialize with first question of each category open
  const [openItems, setOpenItems] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    faqCategories.forEach((_, catIdx) => {
      initial.add(`${catIdx}-0`);
    });
    return initial;
  });

  const toggle = (key: string, question: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
        analytics.faqOpened(question);
      }
      return next;
    });
  };

  const totalQuestions = faqCategories.reduce((sum, cat) => sum + cat.questions.length, 0);
  const allExpanded = openItems.size === totalQuestions;

  const expandAll = () => {
    const all = new Set<string>();
    faqCategories.forEach((cat, catIdx) => {
      cat.questions.forEach((_, qIdx) => {
        all.add(`${catIdx}-${qIdx}`);
      });
    });
    setOpenItems(all);
  };

  const collapseAll = () => {
    setOpenItems(new Set());
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      {/* Expand/Collapse controls */}
      <div className="flex justify-end">
        <button
          onClick={allExpanded ? collapseAll : expandAll}
          className="text-sm font-medium text-secondary hover:text-secondary/80 transition-colors"
        >
          {allExpanded ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      {faqCategories.map((category, categoryIndex) => (
        <div key={categoryIndex}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            {category.name}
          </h2>
          <div className="space-y-3">
            {category.questions.map((faq, faqIndex) => {
              const key = `${categoryIndex}-${faqIndex}`;
              const isOpen = openItems.has(key);
              return (
                <div key={faqIndex} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggle(key, faq.q)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4"
                  >
                    <h3 className="font-semibold text-lg text-gray-900">
                      {faq.q}
                    </h3>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
