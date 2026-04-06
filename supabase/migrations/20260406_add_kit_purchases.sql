-- Kit purchases table: tracks one-time $49 Launch PR Kit payments
CREATE TABLE IF NOT EXISTS kit_purchases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_session_id text UNIQUE NOT NULL,
  customer_email text,
  amount_cents integer NOT NULL,
  status text NOT NULL DEFAULT 'paid',
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for looking up purchases by email (used during signup linking)
CREATE INDEX IF NOT EXISTS idx_kit_purchases_email ON kit_purchases(customer_email);

-- RLS: admins can read all, users can read their own
ALTER TABLE kit_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage kit purchases"
  ON kit_purchases FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can view their own kit purchases"
  ON kit_purchases FOR SELECT
  USING (user_id = auth.uid());
