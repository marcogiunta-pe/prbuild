// lib/analytics.ts
// Google Analytics 4 and custom event tracking

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Initialize GA4 (call this in layout.tsx or _app.tsx)
export function initGA(measurementId: string) {
  if (typeof window === 'undefined') return;
  
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_path: window.location.pathname,
  });
}

// Page view tracking
export function pageView(url: string) {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
    page_path: url,
  });
}

// Generic event tracking
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

// Specific events for PRBuild
export const analytics = {
  // Signup funnel
  signupStarted: (source: string) => {
    trackEvent('signup_started', 'signup', source);
  },
  
  signupStepCompleted: (step: number, stepName: string) => {
    trackEvent('signup_step_completed', 'signup', `step_${step}_${stepName}`);
  },
  
  signupCompleted: (plan: string) => {
    trackEvent('signup_completed', 'signup', plan);
  },

  // CTA tracking
  ctaClicked: (location: string, text: string) => {
    trackEvent('cta_clicked', 'engagement', `${location}: ${text}`);
  },

  // Pricing
  pricingViewed: () => {
    trackEvent('pricing_viewed', 'engagement');
  },
  
  planSelected: (plan: string) => {
    trackEvent('plan_selected', 'pricing', plan);
  },
  
  billingToggled: (interval: 'monthly' | 'yearly') => {
    trackEvent('billing_toggled', 'pricing', interval);
  },

  // Content engagement
  faqOpened: (question: string) => {
    trackEvent('faq_opened', 'engagement', question);
  },
  
  testimonialViewed: (name: string) => {
    trackEvent('testimonial_viewed', 'engagement', name);
  },

  // Exit intent
  exitIntentShown: () => {
    trackEvent('exit_intent_shown', 'conversion');
  },
  
  exitIntentConverted: () => {
    trackEvent('exit_intent_converted', 'conversion');
  },
  
  exitIntentDismissed: () => {
    trackEvent('exit_intent_dismissed', 'conversion');
  },

  // Scroll depth
  scrollDepth: (percentage: number) => {
    trackEvent('scroll_depth', 'engagement', `${percentage}%`, percentage);
  },

  // Comparison pages
  comparisonViewed: (competitor: string) => {
    trackEvent('comparison_viewed', 'engagement', competitor);
  },

  // Resource pages
  resourceViewed: (resource: string) => {
    trackEvent('resource_viewed', 'engagement', resource);
  },
  
  templateDownloaded: () => {
    trackEvent('template_downloaded', 'conversion');
  },

  // Errors
  errorOccurred: (errorType: string, errorMessage: string) => {
    trackEvent('error_occurred', 'error', `${errorType}: ${errorMessage}`);
  },
};

export default analytics;
