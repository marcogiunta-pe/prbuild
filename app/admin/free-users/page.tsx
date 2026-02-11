import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, Mail, Clock, UserPlus } from 'lucide-react';
import { FreeUsersClient } from './FreeUsersClient';

export default async function FreeUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div className="p-6 rounded-lg bg-red-50 border border-red-200">
        <p className="font-semibold text-red-800">Configuration error</p>
        <p className="text-red-700 mt-1">
          SUPABASE_SERVICE_ROLE_KEY is not set in Vercel. Add it in Project Settings → Environment Variables.
        </p>
      </div>
    );
  }

  const admin = createAdminClient();
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/dashboard/my-releases');

  const { q: searchQuery } = await searchParams;

  const cols = 'id, email, full_name, company_name, is_free_user, free_releases_remaining, created_at';

  const [profilesRes, invitesRes, pendingRes, searchRes] = await Promise.all([
    admin.from('profiles').select(cols).order('created_at', { ascending: false }),
    admin.from('invites').select('id, email, free_releases_remaining, created_at').not('approved_at', 'is', null).is('used_at', null),
    admin.from('invites').select('id, email, created_at, free_releases_remaining').is('approved_at', null).is('used_at', null).order('created_at', { ascending: false }),
    searchQuery?.trim()
      ? admin.from('profiles').select(cols).ilike('email', `%${searchQuery.trim()}%`).eq('is_free_user', false).limit(10)
      : Promise.resolve({ data: [] as Awaited<ReturnType<typeof admin.from<'profiles'>>>['data'] }),
  ]);

  const profiles = profilesRes.data || [];
  const freeUsers = profiles.filter((p) => p.is_free_user === true || p.is_free_user === 'true');

  const invitedRows = (invitesRes.data || []).map((inv) => ({
    id: inv.id,
    email: inv.email,
    full_name: null,
    company_name: null,
    is_free_user: true,
    free_releases_remaining: inv.free_releases_remaining ?? 3,
    created_at: inv.created_at,
    _invite: true as const,
  }));

  const allFreeUsers = [...freeUsers, ...invitedRows].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const pendingInvites = pendingRes.data || [];
  const searchResults = (searchRes.data || []).filter((p) => !p.is_free_user);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Free Users</h1>
        <p className="text-gray-600 mt-1">Manage users who receive free access to PRBuild</p>
      </div>

      {pendingInvites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              Pending requests
              <Badge variant="secondary">{pendingInvites.length}</Badge>
            </CardTitle>
            <CardDescription>
              People who requested free access via the request link. Approve to let them set a password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FreeUsersClient pendingInvites={pendingInvites} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Add by email
          </CardTitle>
          <CardDescription>
            Add an email for someone who doesn&apos;t have an account yet. No email is sent. Share the set-password link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FreeUsersClient addByEmail />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add Free User
          </CardTitle>
          <CardDescription>
            Search for existing users to grant them free access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FreeUsersClient
            searchForm
            searchResults={searchResults}
            searchQuery={searchQuery ?? ''}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-green-600" />
            Current Free Users
            <Badge variant="secondary">{allFreeUsers.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FreeUsersClient freeUsers={allFreeUsers} />
        </CardContent>
      </Card>
    </div>
  );
}
