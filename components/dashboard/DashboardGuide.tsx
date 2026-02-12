'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'prbuild_guide_seen';
const WELCOME_KEY = 'prbuild_welcome_seen';

interface GuideStep {
  target: string; // data-guide attribute value
  title: string;
  description: string;
}

const steps: GuideStep[] = [
  {
    target: 'new-request',
    title: 'New Request',
    description: 'Start here to create your first press release. Takes about 5 minutes.',
  },
  {
    target: 'my-releases',
    title: 'My Releases',
    description: "Track your releases here. You'll see status updates as we write and review.",
  },
  {
    target: 'help',
    title: 'Help Docs',
    description: 'Need help? Our docs cover everything from submission to distribution.',
  },
];

export function DashboardGuide() {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const positionTooltip = useCallback(() => {
    const step = steps[currentStep];
    const el = document.querySelector(`[data-guide="${step.target}"]`);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPosition({
      top: rect.top + rect.height / 2,
      left: rect.right + 16,
    });
  }, [currentStep]);

  useEffect(() => {
    // Only show if welcome modal was seen but guide hasn't been shown yet
    if (localStorage.getItem(STORAGE_KEY)) return;
    if (!localStorage.getItem(WELCOME_KEY)) return;
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    positionTooltip();
    window.addEventListener('resize', positionTooltip);
    return () => window.removeEventListener('resize', positionTooltip);
  }, [visible, currentStep, positionTooltip]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      dismiss();
    }
  };

  if (!visible) return null;

  const step = steps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/20" onClick={dismiss} />

      {/* Tooltip */}
      <div
        className="fixed z-50 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-4"
        style={{ top: position.top - 40, left: position.left }}
      >
        {/* Arrow pointing left */}
        <div
          className="absolute w-3 h-3 bg-white border-l border-b border-gray-200 rotate-45"
          style={{ left: -7, top: 32 }}
        />

        <div className="text-xs text-gray-400 mb-1">
          {currentStep + 1} of {steps.length}
        </div>
        <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
        <p className="text-sm text-gray-600 mb-4">{step.description}</p>

        <div className="flex items-center justify-between">
          <button
            onClick={dismiss}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Skip tour
          </button>
          <button
            onClick={next}
            className="px-3 py-1.5 bg-secondary text-white text-sm font-medium rounded-lg hover:bg-secondary/90 transition-colors"
          >
            {currentStep < steps.length - 1 ? 'Next' : 'Done'}
          </button>
        </div>
      </div>
    </>
  );
}
