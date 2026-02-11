import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';
import { AdminUsersClient } from '@/components/admin/users-list';

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return <AdminUsersClient initialUsers={[]} error="Unauthorized" />;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return <AdminUsersClient initialUsers={[]} error="Admin only" />;
  }

  const admin = createAdminClient();
  const { data: users, error } = await admin
    .from('profiles')
    .select('id, email, full_name, company_name, role, subscription_status, current_plan, billing_interval, is_free_user, free_releases_remaining, created_at')
    .order('created_at', { ascending: false });

  return (
    <AdminUsersClient
      initialUsers={users || []}
      error={error?.message}
    />
  );
}
