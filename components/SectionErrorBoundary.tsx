'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  sectionName?: string;
}

interface State {
  hasError: boolean;
}

/** Catches errors in a section so the rest of the page still works. */
export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    if (typeof window !== 'undefined' && (window as unknown as { reportError?: (e: Error) => void }).reportError) {
      (window as unknown as { reportError: (e: Error) => void }).reportError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {this.props.sectionName ? `This section couldn’t load. ` : ''}
          <a href="/" className="text-primary hover:underline">Go to homepage</a>
        </div>
      );
    }
    return this.props.children;
  }
}
