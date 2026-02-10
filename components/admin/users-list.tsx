'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Search, Mail, User, Building, Calendar, Shield, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export interface ProfileUser {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  role: string | null;
  subscription_status: string | null;
  current_plan: string | null;
  billing_interval: string | null;
  is_free_user: boolean;
  free_releases_remaining: number | null;
  created_at: string;
}

export function AdminUsersClient({
  initialUsers,
  error,
}: {
  initialUsers: ProfileUser[];
  error?: string;
}) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return initialUsers;
    const q = search.toLowerCase();
    return initialUsers.filter(
      (u) =>
        u.email?.toLowerCase().includes(q) ||
        u.full_name?.toLowerCase().includes(q) ||
        u.company_name?.toLowerCase().includes(q)
    );
  }, [initialUsers, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="h-7 w-7" />
          All Users
        </h1>
        <p className="text-slate-400 mt-1">
          All registered users (profiles). Use search to filter by email, name, or company.
        </p>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-white">Users ({initialUsers.length})</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search email, name, company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex items-center gap-2 py-8 text-amber-400 bg-amber-500/10 rounded-lg px-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>Could not load users: {error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-slate-500 py-8 text-center">
              {search.trim() ? 'No users match your search.' : 'No users yet.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-left text-slate-400">
                    <th className="pb-3 font-medium">User</th>
                    <th className="pb-3 font-medium">Company</th>
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium">Plan / Status</th>
                    <th className="pb-3 font-medium">Joined</th>
                    <th className="pb-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center">
                            <User className="h-4 w-4 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {u.full_name || '—'}
                            </p>
                            <p className="text-slate-500 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-slate-300">
                        {u.company_name || '—'}
                      </td>
                      <td className="py-3">
                        {u.role === 'admin' ? (
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        ) : (
                          <span className="text-slate-400">Client</span>
                        )}
                      </td>
                      <td className="py-3">
                        {u.is_free_user ? (
                          <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                            {u.free_releases_remaining === -1 ? 'Free (Unlimited)' : `Free (${u.free_releases_remaining ?? 0} left)`}
                          </Badge>
                        ) : u.current_plan ? (
                          <span className="text-slate-300">
                            {u.current_plan} / {u.subscription_status ?? '—'}
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="py-3 text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(u.created_at), 'MMM d, yyyy')}
                        </span>
                      </td>
                      <td className="py-3">
                        <Link
                          href="/admin/requests"
                          className="text-secondary hover:underline text-sm"
                        >
                          Requests
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
