-- Run this on an existing database (when "relation already exists" prevents running full schema.sql).
-- Adds approved_at to invites for the request-free-access → admin approve flow.

ALTER TABLE public.invites ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- Treat existing invites as approved so current set-password links still work.
UPDATE public.invites SET approved_at = created_at WHERE approved_at IS NULL;
