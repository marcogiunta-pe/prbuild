'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FileText, 
  Users, 
  UserCircle,
  Mail, 
  Globe, 
  BarChart3,
  Settings,
  Shield,
  Lightbulb,
  Wand2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    title: 'Requests',
    href: '/admin/requests',
    icon: FileText,
    description: 'Manage PR requests',
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: UserCircle,
    description: 'All registered users',
  },
  {
    title: 'Showcase',
    href: '/admin/showcase',
    icon: Globe,
    description: 'Published releases',
  },
  {
    title: 'Journalists',
    href: '/admin/journalists',
    icon: Users,
    description: 'Subscriber management',
  },
  {
    title: 'Newsletters',
    href: '/admin/newsletters',
    icon: Mail,
    description: 'Email campaigns',
  },
  {
    title: 'Feedback',
    href: '/admin/feedback',
    icon: Lightbulb,
    description: 'Feature requests',
  },
  {
    title: 'AI Prompts',
    href: '/admin/prompts',
    icon: Wand2,
    description: 'Edit AI prompts',
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 min-h-[calc(100vh-4rem)] p-4">
      <div className="flex items-center gap-2 px-4 py-2 mb-4">
        <Shield className="h-5 w-5 text-secondary" />
        <span className="text-white font-semibold">Admin Panel</span>
      </div>

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
                  ? 'bg-secondary text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              <div>
                <p>{item.title}</p>
                <p className={cn(
                  'text-xs',
                  isActive ? 'text-white/70' : 'text-slate-500'
                )}>
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Quick stats */}
      <div className="mt-8 p-4 bg-slate-800 rounded-lg">
        <h4 className="font-medium text-sm text-white mb-3">Quick Stats</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Pending Review</span>
            <span className="text-white font-medium">--</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Published Today</span>
            <span className="text-white font-medium">--</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Active Journalists</span>
            <span className="text-white font-medium">--</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
