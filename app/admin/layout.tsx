import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/admin/sidebar';
import { UserNav } from '@/components/shared/user-nav';
import { FileText } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  let profile: { full_name?: string; role?: string } | null = null;
  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = createAdminClient();
      const { data } = await admin
        .from('profiles')
        .select('full_name, role')
        .eq('id', user.id)
        .single();
      profile = data;
    }
  } catch {
    // Fallback to regular client if admin client fails
  }
  if (!profile) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  // Only allow admin users
  if (profile?.role !== 'admin') {
    redirect('/dashboard/my-releases');
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top header */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="h-full px-4 flex items-center justify-between">
          <Link href="/admin/requests" className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-secondary" />
            <span className="text-xl font-bold text-white">PRBuild</span>
            <span className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">
              Admin
            </span>
          </Link>

          <UserNav 
            user={{
              email: user.email || '',
              fullName: profile?.full_name ?? user.user_metadata?.full_name ?? user.user_metadata?.name,
              role: profile?.role ?? 'admin',
            }}
          />
        </div>
      </header>

      <div className="flex">
        <AdminSidebar />
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
