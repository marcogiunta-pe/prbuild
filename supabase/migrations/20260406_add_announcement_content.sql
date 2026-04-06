-- Add announcement_content column for client email + LinkedIn post
ALTER TABLE release_requests
ADD COLUMN IF NOT EXISTS announcement_content jsonb DEFAULT NULL;

-- Add suggestion field support (panel feedback already stored as jsonb, no schema change needed)
