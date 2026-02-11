'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Gift, Mail, Clock, UserPlus, Search, Loader2, CheckCircle, Trash2 } from 'lucide-react';
import {
  addInviteByEmail,
  approveInvite,
  grantFreeAccess,
  removeFreeUser,
  updateFreeUserReleases,
} from './actions';

type PendingInvite = { id: string; email: string; created_at: string };
type FreeUser = {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  is_free_user: boolean;
  free_releases_remaining: number;
  created_at: string;
  _invite?: true;
};

export function FreeUsersClient({
  pendingInvites = [],
  freeUsers = [],
  searchResults = [],
  searchQuery = '',
  addByEmail = false,
  searchForm = false,
}: {
  pendingInvites?: PendingInvite[];
  freeUsers?: FreeUser[];
  searchResults?: FreeUser[];
  searchQuery?: string;
  addByEmail?: boolean;
  searchForm?: boolean;
}) {
  const router = useRouter();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteReleases, setInviteReleases] = useState(3);
  const [inviteUnlimited, setInviteUnlimited] = useState(false);
  const [invitePending, setInvitePending] = useState(false);
  const [inviteResult, setInviteResult] = useState<{ ok: boolean; message: string; setPasswordLink?: string } | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [approveResult, setApproveResult] = useState<{ ok: boolean; message: string; setPasswordLink?: string } | null>(null);
  const [grantReleases, setGrantReleases] = useState<Record<string, number>>({});
  const [grantUnlimited, setGrantUnlimited] = useState<Record<string, boolean>>({});
  const [grantingId, setGrantingId] = useState<string | null>(null);
  const [grantError, setGrantError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleAddInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInvitePending(true);
    setInviteResult(null);
    const formData = new FormData(e.currentTarget);
    formData.set('unlimited', inviteUnlimited ? 'on' : 'off');
    formData.set('releases', String(inviteReleases));
    const result = await addInviteByEmail(formData);
    setInviteResult(result);
    setInvitePending(false);
    if (result.ok) {
      setInviteEmail('');
      router.refresh();
    }
  };

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    setApproveResult(null);
    const result = await approveInvite(id);
    setApproveResult(result);
    setApprovingId(null);
    if (result.ok) router.refresh();
  };

  const handleGrant = async (user: FreeUser) => {
    setGrantingId(user.id);
    setGrantError(null);
    const unlimited = grantUnlimited[user.id] ?? false;
    const releases = unlimited ? -1 : (grantReleases[user.id] ?? 3);
    const result = await grantFreeAccess(user.id, releases, unlimited);
    setGrantingId(null);
    if (result.ok) {
      router.refresh();
    } else {
      setGrantError(result.message);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm('Remove from free program?')) return;
    const result = await removeFreeUser(userId);
    if (result.ok) router.refresh();
    else setActionError(result.message);
  };

  const handleUpdateReleases = async (userId: string, releases: number, unlimited: boolean) => {
    const result = await updateFreeUserReleases(userId, releases, unlimited);
    if (result.ok) router.refresh();
    else setActionError(result.message);
  };

  if (addByEmail) {
    return (
      <form onSubmit={handleAddInvite} className="space-y-4">
        {inviteResult && (
          <div className={`p-3 rounded-lg text-sm ${inviteResult.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
            <p>{inviteResult.message}</p>
            {inviteResult.setPasswordLink && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Label className="font-medium">Set-password link:</Label>
                <input type="text" readOnly value={inviteResult.setPasswordLink} className="flex-1 min-w-[200px] rounded border px-2 py-1.5 text-xs" />
                <Button type="button" size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(inviteResult.setPasswordLink!)}>Copy</Button>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px] space-y-1">
            <Label>Email</Label>
            <Input name="email" type="email" placeholder="colleague@company.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} disabled={invitePending} required />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={inviteUnlimited} onChange={(e) => setInviteUnlimited(e.target.checked)} className="rounded" />
            <span className="text-sm">Unlimited</span>
          </label>
          {!inviteUnlimited && (
            <div className="flex items-center gap-1">
              <Input type="number" name="releases" min={1} max={999} value={inviteReleases} onChange={(e) => setInviteReleases(parseInt(e.target.value) || 3)} className="w-16 h-9" disabled={invitePending} />
              <span className="text-sm text-gray-500">releases</span>
            </div>
          )}
          <Button type="submit" disabled={invitePending}>{invitePending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><UserPlus className="h-4 w-4 mr-1" />Add</>}</Button>
        </div>
      </form>
    );
  }

  if (pendingInvites.length > 0) {
    return (
      <div className="space-y-4">
        {approveResult && (
          <div className={`p-3 rounded-lg text-sm ${approveResult.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
            <p>{approveResult.message}</p>
            {approveResult.setPasswordLink && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <input type="text" readOnly value={approveResult.setPasswordLink} className="flex-1 min-w-[200px] rounded border px-2 py-1.5 text-xs" />
                <Button type="button" size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(approveResult.setPasswordLink!)}>Copy</Button>
              </div>
            )}
          </div>
        )}
        <div className="divide-y rounded-lg border">
          {pendingInvites.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between p-3">
              <div>
                <p className="font-medium">{inv.email}</p>
                <p className="text-xs text-gray-500">Requested {new Date(inv.created_at).toLocaleString()}</p>
              </div>
              <Button size="sm" onClick={() => handleApprove(inv.id)} disabled={approvingId === inv.id}>
                {approvingId === inv.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle className="h-4 w-4 mr-1" />Approve</>}
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (searchForm) {
    return (
      <div className="space-y-4">
        {grantError && <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{grantError}</p>}
        <form action="/admin/free-users" method="get" className="flex gap-2">
          <Input name="q" placeholder="Search by email..." defaultValue={searchQuery} />
          <Button type="submit"><Search className="h-4 w-4 mr-2" />Search</Button>
        </form>
        {searchResults.length > 0 ? (
          <div className="border rounded-lg divide-y">
            {searchResults.map((u) => (
              <div key={u.id} className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{u.email}</p>
                  <p className="text-sm text-gray-500">{u.full_name || 'No name'} • {u.company_name || 'No company'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-sm">
                    <input type="checkbox" checked={grantUnlimited[u.id] || false} onChange={(e) => setGrantUnlimited((p) => ({ ...p, [u.id]: e.target.checked }))} className="rounded" />
                    Unlimited
                  </label>
                  <Input type="number" min={1} max={999} value={grantReleases[u.id] ?? 3} onChange={(e) => setGrantReleases((p) => ({ ...p, [u.id]: parseInt(e.target.value) || 3 }))} className="w-16 h-8" disabled={grantUnlimited[u.id]} />
                  <span className="text-sm text-gray-500">releases</span>
                  <Button size="sm" onClick={() => handleGrant(u)} disabled={grantingId === u.id}>
                    {grantingId === u.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Gift className="h-4 w-4 mr-1" />Grant Free</>}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <p className="text-sm text-gray-500 text-center py-4">No users found. They need to sign up first.</p>
        ) : null}
      </div>
    );
  }

  if (freeUsers.length > 0) {
    return (
      <div className="space-y-4">
        {actionError && <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{actionError}</p>}
        <div className="divide-y">
          {freeUsers.map((u) => (
            <div key={u.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{u.email}</p>
                <p className="text-sm text-gray-500">
                  {u._invite ? <span className="text-amber-600">Awaiting signup</span> : `${u.full_name || 'No name'} • ${u.company_name || 'No company'}`}
                </p>
                <p className="text-xs text-gray-400">Added {new Date(u.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                {u._invite ? (
                  <Badge variant="outline" className="text-amber-600">Pending signup</Badge>
                ) : (
                  <>
                    <label className="flex items-center gap-1.5 text-sm">
                      <input type="checkbox" checked={u.free_releases_remaining === -1} onChange={(e) => handleUpdateReleases(u.id, e.target.checked ? -1 : (u.free_releases_remaining > 0 ? u.free_releases_remaining : 3), e.target.checked)} className="rounded" />
                      Unlimited
                    </label>
                    {u.free_releases_remaining !== -1 && (
                      <>
                        <Label className="text-sm">Releases:</Label>
                        <Input type="number" min={0} max={999} defaultValue={u.free_releases_remaining} onBlur={(e) => { const v = parseInt(e.target.value) || 0; if (v !== u.free_releases_remaining) handleUpdateReleases(u.id, v, false); }} className="w-16 h-8" />
                      </>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleRemove(u.id)} className="text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <p className="text-gray-500 text-center py-8">No free users yet. Search above to add users.</p>;
}
