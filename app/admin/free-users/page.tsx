'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Gift, Trash2, Search, Loader2, Mail } from 'lucide-react';

interface FreeUser {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  is_free_user: boolean;
  free_releases_remaining: number;
  created_at: string;
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

  /** Always show a string; never [object Object]. Extracts message from nested Resend/API errors. */
  const inviteMessageText = (() => {
    if (inviteMessage == null || inviteMessage === '') return '';
    if (typeof inviteMessage === 'string') return inviteMessage;
    if (typeof inviteMessage !== 'object' || inviteMessage === null) return String(inviteMessage);
    const m = (inviteMessage as { message?: unknown }).message;
    if (typeof m === 'string') return m;
    if (typeof m === 'object' && m !== null) {
      const s = JSON.stringify(m);
      return s === '{}' ? 'Failed to send. Check Resend API key and sender domain (NOTIFICATIONS_FROM_EMAIL).' : s;
    }
    const s = JSON.stringify(inviteMessage);
    return s === '{}' || s === '[object Object]' ? 'Failed to send invite. Check Resend API key and sender in Vercel env.' : s;
  })();
  const safeInviteMessageText = inviteMessageText === '[object Object]' ? 'Failed to send invite. Check Resend API key and sender domain.' : inviteMessageText;

  useEffect(() => {
    loadFreeUsers();
  }, []);

  const loadFreeUsers = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_free_user', true)
      .order('created_at', { ascending: false });

    setFreeUsers(data || []);
    setLoading(false);
  };

  const searchUsers = async () => {
    if (!searchEmail.trim()) return;
    
    setSearching(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .ilike('email', `%${searchEmail}%`)
      .eq('is_free_user', false)
      .limit(10);

    setSearchResults(data || []);
    setSearching(false);
  };

  const addFreeUser = async (user: FreeUser) => {
    const unlimited = unlimitedToGrant[user.id];
    const releases = unlimited ? -1 : (releasesToGrant[user.id] ?? 3);
    const supabase = createClient();
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        is_free_user: true,
        free_releases_remaining: releases
      })
      .eq('id', user.id);

    if (!error) {
      setSearchResults(prev => prev.filter(u => u.id !== user.id));
      await loadFreeUsers();
    }
  };

  const removeFreeUser = async (userId: string) => {
    if (!confirm('Remove this user from the free program?')) return;
    
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ 
        is_free_user: false,
        free_releases_remaining: 0
      })
      .eq('id', userId);

    if (!error) {
      await loadFreeUsers();
    }
  };

  const updateReleases = async (userId: string, releases: number) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ free_releases_remaining: releases })
      .eq('id', userId);

    if (!error) {
      await loadFreeUsers();
    }
  };

  const setUnlimited = async (userId: string, unlimited: boolean) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ free_releases_remaining: unlimited ? -1 : 0 })
      .eq('id', userId);

    if (!error) {
      await loadFreeUsers();
    }
  };

  const sendInvite = async () => {
    const email = inviteEmail.trim();
    if (!email) return;
    setInviteSending(true);
    setInviteMessage(null);
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
        setInviteMessage(`Invite sent to ${email}. They'll get ${inviteUnlimited ? 'unlimited' : inviteReleases} free release(s) when they sign up.`);
        setInviteEmail('');
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

      {/* Invite by email (Jarvis sends the email) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Invite by email
          </CardTitle>
          <CardDescription>
            Send an invite to someone who doesn&apos;t have an account yet. Jarvis will email them a signup link; when they sign up with that email, they&apos;ll get free access.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {safeInviteMessageText !== '' && (
            <p className={`text-sm p-3 rounded-lg ${safeInviteMessageText.startsWith('Invite sent') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
              {safeInviteMessageText}
            </p>
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
              {inviteSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4 mr-1" />}
              Send invite
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
                      {user.full_name || 'No name'} • {user.company_name || 'No company'}
                    </p>
                    <p className="text-xs text-gray-400">
                      Added {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
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
