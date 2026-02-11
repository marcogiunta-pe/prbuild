import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { UserNav } from '@/components/shared/user-nav';
import { FileText } from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single();

  const displayName = profile?.full_name ?? user.user_metadata?.full_name ?? user.user_metadata?.name;

  // Redirect admin users to admin dashboard
  if (profile?.role === 'admin') {
    redirect('/admin/requests');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top header */}
      <header className="h-16 bg-white border-b sticky top-0 z-50">
        <div className="h-full px-4 flex items-center justify-between">
          <Link href="/dashboard/my-releases" className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">PRBuild</span>
          </Link>

          <UserNav 
            user={{
              email: user.email || '',
              fullName: displayName,
              role: profile?.role,
            }}
          />
        </div>
      </header>

      <div className="flex">
        <DashboardSidebar />
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
