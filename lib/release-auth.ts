// lib/release-auth.ts
// Shared authorization guard for release_requests mutation routes.
// Every client-facing write now goes through a service-role server route that
// first calls guardRelease() to verify the caller owns the row (or is admin)
// before touching it. RLS no longer permits direct browser writes.

import { createClient, createAdminClient } from '@/lib/supabase/server';

type AdminClient = ReturnType<typeof createAdminClient>;

export type ReleaseGuard =
  | { ok: false; status: number; error: string }
  | {
      ok: true;
      user: { id: string; email?: string };
      admin: AdminClient;
      release: Record<string, any>;
      isAdmin: boolean;
      isOwner: boolean;
    };

/**
 * Authenticate the caller and load the release with a service-role client.
 * Returns a 401/404/403 result if the caller is unauthenticated, the release
 * is missing, or the caller is neither the owner nor an admin.
 */
export async function guardRelease(releaseId: string): Promise<ReleaseGuard> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, status: 401, error: 'Unauthorized' };

  const admin = createAdminClient();

  const { data: release } = await admin
    .from('release_requests')
    .select('*')
    .eq('id', releaseId)
    .single();

  if (!release) return { ok: false, status: 404, error: 'Release not found' };

  const { data: profile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const isAdmin = profile?.role === 'admin';
  const isOwner = release.client_id === user.id;

  if (!isOwner && !isAdmin) {
    return { ok: false, status: 403, error: 'Forbidden' };
  }

  return { ok: true, user, admin, release, isAdmin, isOwner };
}

// Statuses from which a client may submit feedback or approve a draft.
export const CLIENT_REVIEW_STATES = [
  'awaiting_client',
  'panel_reviewed',
  'draft_generated',
];

// Statuses in which AI content/panel mutation is allowed. Anything past client
// approval (client_approved, final_*, quality_*, published, rejected) is locked
// so a caller cannot roll an approved/published release backward by re-running
// the draft, rewrite, or panel-critique pipelines.
export const EDITABLE_STATES = [
  'submitted',
  'draft_generated',
  'panel_reviewed',
  'admin_approved',
  'awaiting_client',
  'client_feedback',
  'needs_revision',
];
