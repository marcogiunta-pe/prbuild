'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';

interface UserNavProps {
  user: {
    email: string;
    fullName?: string | null;
    role?: string;
  };
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="flex items-center gap-2 px-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-4 w-4 text-primary" />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium">{user.fullName || 'User'}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-lg border bg-white shadow-lg z-20">
            <div className="p-2">
              <div className="px-3 py-2 border-b mb-2">
                <p className="text-sm font-medium">{user.fullName || 'User'}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
                {user.role && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full capitalize">
                    {user.role}
                  </span>
                )}
              </div>
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/dashboard/account');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <Settings className="h-4 w-4" />
                Account Settings
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
