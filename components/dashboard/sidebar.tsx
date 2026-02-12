'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, PlusCircle, User, LayoutDashboard, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    title: 'My Releases',
    href: '/dashboard/my-releases',
    icon: FileText,
  },
  {
    title: 'New Request',
    href: '/dashboard/new-request',
    icon: PlusCircle,
  },
  {
    title: 'Feedback',
    href: '/dashboard/feedback',
    icon: Lightbulb,
  },
  {
    title: 'Account',
    href: '/dashboard/account',
    icon: User,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r min-h-[calc(100vh-4rem)] p-4">
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-secondary/10 text-secondary'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Help section */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-sm text-gray-900 mb-2">Need help?</h4>
        <p className="text-xs text-gray-600 mb-3">
          Our team is here to help you create effective press releases.
        </p>
        <Link
          href="/docs"
          className="text-xs text-secondary font-medium hover:underline"
        >
          View Help Docs →
        </Link>
      </div>
    </aside>
  );
}
