-- Durable, cross-instance rate limiting.
--
-- lib/rate-limit.ts was in-memory only: on Vercel each serverless instance has
-- its own Map, so the limits reset on every cold start and don't coordinate
-- across instances. This backs the limiter with a Postgres table + an atomic
-- RPC so a limit actually holds across the whole fleet.

CREATE TABLE IF NOT EXISTS public.rate_limits (
  key       TEXT PRIMARY KEY,
  count     INTEGER NOT NULL,
  reset_at  TIMESTAMPTZ NOT NULL
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
-- No policies: only the service-role client (which bypasses RLS) may touch this.
-- The anon/authenticated browser clients have no business reading or writing it.

-- Atomic check-and-increment. One statement, so concurrent requests for the
-- same key can't both slip under the limit.
--   allowed = false + retry_after (seconds) when the window count exceeds p_max
--   allowed = true  + 0            otherwise
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_key TEXT,
  p_max INTEGER,
  p_window_seconds INTEGER
)
RETURNS TABLE(allowed BOOLEAN, retry_after INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  now_ts    TIMESTAMPTZ := now();
  new_reset TIMESTAMPTZ := now() + make_interval(secs => p_window_seconds);
  cur_count INTEGER;
  cur_reset TIMESTAMPTZ;
BEGIN
  INSERT INTO public.rate_limits (key, count, reset_at)
    VALUES (p_key, 1, new_reset)
  ON CONFLICT (key) DO UPDATE
    SET count = CASE WHEN public.rate_limits.reset_at <= now_ts THEN 1
                     ELSE public.rate_limits.count + 1 END,
        reset_at = CASE WHEN public.rate_limits.reset_at <= now_ts THEN new_reset
                        ELSE public.rate_limits.reset_at END
  RETURNING count, reset_at INTO cur_count, cur_reset;

  IF cur_count > p_max THEN
    RETURN QUERY SELECT false, GREATEST(0, CEIL(EXTRACT(EPOCH FROM (cur_reset - now_ts)))::INTEGER);
  ELSE
    RETURN QUERY SELECT true, 0;
  END IF;
END;
$$;
