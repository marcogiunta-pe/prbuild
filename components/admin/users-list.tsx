'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Search, Mail, User, Shield, AlertCircle, UserPlus, Gift, Trash2, Loader2, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { addUser, grantFree, removeFree, deleteUser } from '@/app/admin/users/actions';

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
  currentUserId,
}: {
  initialUsers: ProfileUser[];
  error?: string;
  currentUserId?: string;
}) {
  const [search, setSearch] = useState('');
  const [addResult, setAddResult] = useState<{ ok: boolean; message: string; tempPassword?: string; email?: string } | null>(null);
  const [addPending, setAddPending] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [grantingId, setGrantingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [grantReleases, setGrantReleases] = useState<Record<string, number>>({});
  const [grantUnlimited, setGrantUnlimited] = useState<Record<string, boolean>>({});

  const filtered = initialUsers.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.email?.toLowerCase().includes(q) ||
      u.full_name?.toLowerCase().includes(q) ||
      u.company_name?.toLowerCase().includes(q)
    );
  });

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddPending(true);
    setAddResult(null);
    setActionError(null);
    const formData = new FormData(e.currentTarget);
    const result = await addUser(formData);
    setAddResult(result);
    setAddPending(false);
    if (result.ok) {
      (e.target as HTMLFormElement).reset();
    }
  };

  const handleGrant = async (u: ProfileUser) => {
    setGrantingId(u.id);
    setActionError(null);
    const unlimited = grantUnlimited[u.id] ?? false;
    const releases = unlimited ? -1 : (grantReleases[u.id] ?? 3);
    const result = await grantFree(u.id, releases, unlimited);
    setGrantingId(null);
    if (!result.ok) setActionError(result.message);
  };

  const handleRemoveFree = async (userId: string) => {
    const result = await removeFree(userId);
    if (!result.ok) setActionError(result.message);
  };

  const handleDelete = async (u: ProfileUser) => {
    if (u.role === 'admin' || u.id === currentUserId) {
      setActionError('Cannot delete admin or yourself');
      return;
    }
    if (!confirm(`Delete ${u.email}? This cannot be undone.`)) return;
    setDeletingId(u.id);
    setActionError(null);
    const result = await deleteUser(u.id);
    setDeletingId(null);
    if (!result.ok) setActionError(result.message);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="h-7 w-7" />
          Users
        </h1>
        <p className="text-slate-400 mt-1">
          Add users, grant free access, or delete. New users get a temporary password they must reset on first login.
        </p>
      </div>

      {/* Add user form */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add User
          </CardTitle>
          <CardDescription className="text-slate-400">
            Enter email and name. A temporary password will be generated — share it with the user. They must reset it on first login.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex flex-wrap gap-4 items-end">
            <div className="space-y-1">
              <Label className="text-slate-300">Email</Label>
              <Input name="email" type="email" placeholder="user@company.com" required disabled={addPending} className="bg-slate-800 border-slate-700 text-white w-64" />
            </div>
            <div className="space-y-1">
              <Label className="text-slate-300">Full name</Label>
              <Input name="fullName" type="text" placeholder="Jane Doe" disabled={addPending} className="bg-slate-800 border-slate-700 text-white w-48" />
            </div>
            <Button type="submit" disabled={addPending} className="bg-secondary hover:bg-secondary/90">
              {addPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><UserPlus className="h-4 w-4 mr-2" />Add User</>}
            </Button>
          </form>
          {addResult && (
            <div className={`mt-4 p-4 rounded-lg ${addResult.ok ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
              <p className="font-medium">{addResult.message}</p>
              {addResult.ok && addResult.tempPassword && addResult.email && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className="bg-slate-800 px-3 py-2 rounded text-sm font-mono">{addResult.tempPassword}</code>
                    <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(addResult.tempPassword!)} className="border-slate-600 text-slate-300">
                      Copy password
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600 text-slate-300"
                    onClick={() => {
                      const loginUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://prbuild.ai'}/login`;
                      const msg = `You're set up on PRBuild. Sign in here:\n\n${loginUrl}\n\nEmail: ${addResult.email}\nTemporary password: ${addResult.tempPassword}\n\nYou'll be asked to set a new password on first login.`;
                      navigator.clipboard.writeText(msg);
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy message to send
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Users table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-white">All Users ({initialUsers.length})</CardTitle>
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
          {actionError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {actionError}
            </div>
          )}
          {error ? (
            <div className="flex items-center gap-2 py-8 text-amber-400 bg-amber-500/10 rounded-lg px-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-slate-500 py-8 text-center">
              {search.trim() ? 'No users match your search.' : 'No users yet. Add one above.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-left text-slate-400">
                    <th className="pb-3 font-medium">User</th>
                    <th className="pb-3 font-medium">Company</th>
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Joined</th>
                    <th className="pb-3 font-medium">Actions</th>
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
                            <p className="text-white font-medium">{u.full_name || '—'}</p>
                            <p className="text-slate-500 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-slate-300">{u.company_name || '—'}</td>
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
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                              {u.free_releases_remaining === -1 ? 'Free (Unlimited)' : `Free (${u.free_releases_remaining ?? 0} left)`}
                            </Badge>
                            {u.role !== 'admin' && (
                              <Button size="sm" variant="ghost" className="text-slate-500 h-7" onClick={() => handleRemoveFree(u.id)}>
                                Remove free
                              </Button>
                            )}
                          </div>
                        ) : u.role !== 'admin' ? (
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-1.5 text-xs">
                              <input type="checkbox" checked={grantUnlimited[u.id] || false} onChange={(e) => setGrantUnlimited((p) => ({ ...p, [u.id]: e.target.checked }))} className="rounded" />
                              Unlimited
                            </label>
                            <Input
                              type="number"
                              min={1}
                              max={999}
                              value={grantReleases[u.id] ?? 3}
                              onChange={(e) => setGrantReleases((p) => ({ ...p, [u.id]: parseInt(e.target.value) || 3 }))}
                              className="w-14 h-7 text-xs bg-slate-800 border-slate-700"
                              disabled={grantUnlimited[u.id]}
                            />
                            <Button size="sm" onClick={() => handleGrant(u)} disabled={grantingId === u.id} className="h-7 bg-secondary/80 hover:bg-secondary">
                              {grantingId === u.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Gift className="h-3 w-3 mr-1" />Grant free</>}
                            </Button>
                          </div>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="py-3 text-slate-500">{format(new Date(u.created_at), 'MMM d, yyyy')}</td>
                      <td className="py-3">
                        {u.role !== 'admin' && u.id !== currentUserId && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7"
                            onClick={() => handleDelete(u)}
                            disabled={deletingId === u.id}
                          >
                            {deletingId === u.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Trash2 className="h-3 w-3 mr-1" />Delete</>}
                          </Button>
                        )}
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
