-- Reconcile prod's release_requests table with the post-creation column
-- migrations that may not have reached prod (same dashboard/CLI drift that left
-- profiles.industry missing). Base-schema columns ship with the table; the risk
-- is the later ALTERs. Both statements are ADD COLUMN IF NOT EXISTS — safe to
-- re-run.
--
--   announcement_content — client email + LinkedIn post (api/ai/generate-announcement, preview page)
--   pitch_emails         — 5 journalist pitch emails (api/ai/generate-pitches, preview page)

ALTER TABLE public.release_requests ADD COLUMN IF NOT EXISTS announcement_content JSONB;
ALTER TABLE public.release_requests ADD COLUMN IF NOT EXISTS pitch_emails JSONB;

-- Refresh PostgREST's schema cache so the columns are queryable immediately.
NOTIFY pgrst, 'reload schema';
