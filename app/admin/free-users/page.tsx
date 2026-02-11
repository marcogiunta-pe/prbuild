'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Gift, Trash2, Search, Loader2, Mail, Clock, CheckCircle } from 'lucide-react';

interface PendingInvite {
  id: string;
  email: string;
  created_at: string;
  free_releases_remaining?: number;
}

interface FreeUser {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  is_free_user: boolean;
  free_releases_remaining: number;
  created_at: string;
  _invite?: true; // approved invite awaiting set-password
}

export default function FreeUsersPage() {
  const [freeUsers, setFreeUsers] = useState<FreeUser[]>([]);
  const [allUsers, setAllUsers] = useState<FreeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<FreeUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [releasesToGrant, setReleasesToGrant] = useState<Record<string, number>>({});
  const [unlimitedToGrant, setUnlimitedToGrant] = useState<Record<string, boolean>>({});
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteReleases, setInviteReleases] = useState(3);
  const [inviteUnlimited, setInviteUnlimited] = useState(false);
  const [inviteSending, setInviteSending] = useState(false);
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);
  const [lastSetPasswordLink, setLastSetPasswordLink] = useState<string | null>(null);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [grantError, setGrantError] = useState<string | null>(null);

  const inviteMessageText = (() => {
    if (inviteMessage == null || inviteMessage === '') return '';
    if (typeof inviteMessage === 'string') return inviteMessage;
    if (typeof inviteMessage !== 'object' || inviteMessage === null) return String(inviteMessage);
    const m = (inviteMessage as { message?: unknown }).message;
    if (typeof m === 'string') return m;
    return JSON.stringify(inviteMessage);
  })();
  const safeInviteMessageText = inviteMessageText === '[object Object]' ? 'Something went wrong.' : inviteMessageText;

  useEffect(() => {
    loadFreeUsers();
    loadPendingInvites();
  }, []);

  const loadPendingInvites = async () => {
    try {
      const res = await fetch('/api/admin/pending-invites');
      const data = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(data.invites)) setPendingInvites(data.invites);
      else setPendingInvites([]);
    } catch {
      setPendingInvites([]);
    }
  };

  const loadFreeUsers = async () => {
    try {
      const res = await fetch('/api/admin/free-users');
      const data = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(data.users)) {
        setFreeUsers(data.users);
      } else {
        setFreeUsers([]);
      }
    } catch {
      setFreeUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    if (!searchEmail.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/admin/search-users?q=${encodeURIComponent(searchEmail.trim())}`);
      const data = await res.json().catch(() => ({}));
      setSearchResults(res.ok && Array.isArray(data.users) ? data.users : []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const addFreeUser = async (user: FreeUser) => {
    setGrantError(null);
    const unlimited = unlimitedToGrant[user.id];
    const releases = unlimited ? -1 : (releasesToGrant[user.id] ?? 3);
    try {
      const res = await fetch('/api/admin/grant-free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, freeReleases: releases, unlimited }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSearchResults(prev => prev.filter(u => u.id !== user.id));
        await loadFreeUsers();
      } else {
        setGrantError(data?.error ?? 'Failed to grant free access');
      }
    } catch (e) {
      setGrantError(e instanceof Error ? e.message : 'Failed to grant free access');
    }
  };

  const removeFreeUser = async (userId: string) => {
    if (!confirm('Remove this user from the free program?')) return;
    setGrantError(null);
    try {
      const res = await fetch('/api/admin/free-users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'remove' }),
      });
      if (res.ok) await loadFreeUsers();
      else setGrantError((await res.json().catch(() => ({}))).error ?? 'Failed');
    } catch (e) {
      setGrantError(e instanceof Error ? e.message : 'Failed');
    }
  };

  const updateReleases = async (userId: string, releases: number) => {
    setGrantError(null);
    try {
      const res = await fetch('/api/admin/free-users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'update', freeReleasesRemaining: releases }),
      });
      if (res.ok) await loadFreeUsers();
    } catch {
      /* ignore */
    }
  };

  const setUnlimited = async (userId: string, unlimited: boolean) => {
    setGrantError(null);
    try {
      const res = await fetch('/api/admin/free-users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'update', unlimited }),
      });
      if (res.ok) await loadFreeUsers();
    } catch {
      /* ignore */
    }
  };

  const sendInvite = async () => {
    const email = inviteEmail.trim();
    if (!email) return;
    setInviteSending(true);
    setInviteMessage(null);
    setLastSetPasswordLink(null);
    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          freeReleases: inviteUnlimited ? -1 : inviteReleases,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setInviteMessage(data?.message ?? `Added ${email}. Share the set-password link with them.`);
        setInviteEmail('');
        if (typeof data?.setPasswordLink === 'string') setLastSetPasswordLink(data.setPasswordLink);
      } else {
        const err = data?.error;
        if (typeof err === 'string') {
          setInviteMessage(err);
        } else if (err && typeof err === 'object') {
          const m = (err as { message?: unknown }).message;
          setInviteMessage(
            typeof m === 'string' ? m : typeof m === 'object' && m !== null ? JSON.stringify(m) : (res.statusText || 'Failed to send invite')
          );
        } else {
          setInviteMessage(res.statusText || 'Failed to send invite');
        }
      }
    } catch (e) {
      setInviteMessage(e instanceof Error ? e.message : 'Failed to send invite');
    }
    setInviteSending(false);
  };

  const approvePending = async (inviteId: string) => {
    setApprovingId(inviteId);
    setInviteMessage(null);
    setLastSetPasswordLink(null);
    try {
      const res = await fetch('/api/admin/invite/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: inviteId }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setInviteMessage(data?.message ?? 'Approved. Share the set-password link with them.');
        if (typeof data?.setPasswordLink === 'string') setLastSetPasswordLink(data.setPasswordLink);
        setPendingInvites((prev) => prev.filter((p) => p.id !== inviteId));
      } else {
        setInviteMessage(data?.error ?? 'Failed to approve');
      }
    } catch (e) {
      setInviteMessage(e instanceof Error ? e.message : 'Failed to approve');
    } finally {
      setApprovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Free Users</h1>
        <p className="text-gray-600 mt-1">
          Manage users who receive free access to PRBuild
        </p>
      </div>

      {/* Pending requests (from /request-free-access) */}
      {pendingInvites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              Pending requests
              <Badge variant="secondary">{pendingInvites.length}</Badge>
            </CardTitle>
            <CardDescription>
              People who requested free access via the request link. Approve to let them set a password and sign in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y rounded-lg border">
              {pendingInvites.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-3">
                  <div>
                    <p className="font-medium">{inv.email}</p>
                    <p className="text-xs text-gray-500">
                      Requested {new Date(inv.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => approvePending(inv.id)}
                    disabled={approvingId === inv.id}
                  >
                    {approvingId === inv.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add by email — no email sent; they sign up and get access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Add by email
          </CardTitle>
          <CardDescription>
            Add an email for someone who doesn&apos;t have an account yet. No email is sent. Share the set-password link with them so they can create an account and sign in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {safeInviteMessageText !== '' && (
            <div className={`text-sm p-3 rounded-lg ${safeInviteMessageText.startsWith('Added') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
              <p>{safeInviteMessageText}</p>
              {lastSetPasswordLink && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Label className="text-green-800 font-medium">Set-password link:</Label>
                  <input
                    type="text"
                    readOnly
                    value={lastSetPasswordLink}
                    className="flex-1 min-w-[200px] rounded border border-green-300 bg-white px-2 py-1.5 text-xs text-gray-800"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-green-600 text-green-800 hover:bg-green-100"
                    onClick={() => navigator.clipboard.writeText(lastSetPasswordLink)}
                  >
                    Copy
                  </Button>
                </div>
              )}
            </div>
          )}
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px] space-y-1">
              <Label className="text-sm">Email</Label>
              <Input
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                disabled={inviteSending}
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={inviteUnlimited}
                onChange={(e) => setInviteUnlimited(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Unlimited</span>
            </label>
            {!inviteUnlimited && (
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min={1}
                  max={999}
                  value={inviteReleases}
                  onChange={(e) => setInviteReleases(parseInt(e.target.value) || 3)}
                  className="w-16 h-9"
                  disabled={inviteSending}
                />
                <span className="text-sm text-gray-500">releases</span>
              </div>
            )}
            <Button onClick={sendInvite} disabled={inviteSending || !inviteEmail.trim()}>
              {inviteSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4 mr-1" />}
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Free User */}
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
        <CardContent className="space-y-4">
          {grantError && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{grantError}</p>
          )}
          <div className="flex gap-2">
            <Input
              placeholder="Search by email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
            />
            <Button onClick={searchUsers} disabled={searching}>
              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="ml-2">Search</span>
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="border rounded-lg divide-y">
              {searchResults.map(user => (
                <div key={user.id} className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      {user.full_name || 'No name'} • {user.company_name || 'No company'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-sm">
                      <input
                        type="checkbox"
                        checked={unlimitedToGrant[user.id] || false}
                        onChange={(e) => setUnlimitedToGrant(prev => ({ ...prev, [user.id]: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      Unlimited
                    </label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="1"
                        max="999"
                        value={releasesToGrant[user.id] ?? 3}
                        onChange={(e) => setReleasesToGrant(prev => ({ 
                          ...prev, 
                          [user.id]: parseInt(e.target.value) || 3 
                        }))}
                        className="w-16 h-8"
                        disabled={unlimitedToGrant[user.id]}
                      />
                      <span className="text-sm text-gray-500">releases</span>
                    </div>
                    <Button size="sm" onClick={() => addFreeUser(user)}>
                      <Gift className="h-4 w-4 mr-1" />
                      Grant Free
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchResults.length === 0 && searchEmail && !searching && (
            <p className="text-sm text-gray-500 text-center py-4">
              No users found. They need to sign up first before you can grant free access.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Current Free Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-green-600" />
            Current Free Users
            <Badge variant="secondary">{freeUsers.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {freeUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No free users yet. Search above to add users to the free program.
            </p>
          ) : (
            <div className="divide-y">
              {freeUsers.map(user => (
                <div key={user.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      {user._invite ? (
                        <span className="text-amber-600">Awaiting signup — share set-password link</span>
                      ) : (
                        `${user.full_name || 'No name'} • ${user.company_name || 'No company'}`
                      )}
                    </p>
                    <p className="text-xs text-gray-400">
                      Added {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {user._invite ? (
                      <Badge variant="outline" className="text-amber-600 border-amber-300">
                        Pending signup
                      </Badge>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1.5 text-sm">
                            <input
                              type="checkbox"
                              checked={user.free_releases_remaining === -1}
                              onChange={(e) => setUnlimited(user.id, e.target.checked)}
                              className="rounded border-gray-300"
                            />
                            Unlimited
                          </label>
                          {user.free_releases_remaining !== -1 && (
                            <>
                              <Label className="text-sm">Releases:</Label>
                              <Input
                                type="number"
                                min="0"
                                max="999"
                                value={user.free_releases_remaining}
                                onChange={(e) => updateReleases(user.id, parseInt(e.target.value) || 0)}
                                className="w-16 h-8"
                              />
                            </>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFreeUser(user.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
