-- Create a public waitlist table for pre-launch email signups
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  user_type VARCHAR(50) CHECK (user_type IN ('realtor', 'builder', 'buyer', 'other')),
  city VARCHAR(100),
  ip_address VARCHAR(45),
  referral_source VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notified BOOLEAN DEFAULT FALSE
);

-- Index for quick email lookups
CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_created ON waitlist(created_at DESC);

-- Enable RLS but allow public inserts
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can signup for waitlist" 
  ON waitlist FOR INSERT 
  WITH CHECK (true);

-- Only authenticated admins can read waitlist
CREATE POLICY "Only admins can read waitlist" 
  ON waitlist FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.uid() = auth.users.id 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );
