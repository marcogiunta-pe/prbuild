'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  BookOpen,
  Workflow,
  ClipboardEdit,
  MessageSquare,
  LayoutList,
  CreditCard,
  Globe,
  UserCog,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { title: 'Getting Started', href: '/docs', icon: BookOpen },
  { title: 'How It Works', href: '/docs/how-it-works', icon: Workflow },
  { title: 'Submitting a Request', href: '/docs/submitting-request', icon: ClipboardEdit },
  { title: 'Review Process', href: '/docs/review-process', icon: MessageSquare },
  { title: 'Managing Releases', href: '/docs/managing-releases', icon: LayoutList },
  { title: 'Pricing & Plans', href: '/docs/pricing', icon: CreditCard },
  { title: 'Distribution', href: '/docs/distribution', icon: Globe },
  { title: 'Account Settings', href: '/docs/account', icon: UserCog },
];

export function DocsSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-secondary/10 text-secondary'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-40 bg-secondary text-white p-3 rounded-full shadow-lg"
        aria-label="Toggle docs menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-30 w-72 bg-white border-r p-6 pt-20 overflow-y-auto transition-transform',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4">
          Documentation
        </p>
        {links}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 border-r bg-white p-6 overflow-y-auto sticky top-16 h-[calc(100vh-4rem)]">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4">
          Documentation
        </p>
        {links}
      </aside>
    </>
  );
}
