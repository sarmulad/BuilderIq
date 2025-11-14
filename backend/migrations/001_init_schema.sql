-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  company_name VARCHAR(255),
  phone VARCHAR(20),
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'builder', 'admin')),
  subscription_tier VARCHAR(50) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  subscription_started_at TIMESTAMP,
  subscription_expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  is_email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Builders table
CREATE TABLE builders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) UNIQUE NOT NULL,
  logo_url VARCHAR(500),
  website_url VARCHAR(500),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  data_source VARCHAR(50) DEFAULT 'scraper',
  last_scraped_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Communities table
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  builder_id UUID NOT NULL REFERENCES builders(id) ON DELETE CASCADE,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(10),
  county VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status VARCHAR(50) DEFAULT 'active',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(builder_id, name)
);

-- Incentives table
CREATE TABLE incentives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  builder_id UUID NOT NULL REFERENCES builders(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  value DECIMAL(12, 2),
  value_type VARCHAR(50),
  description TEXT,
  lender_requirements TEXT,
  conditions TEXT,
  expiration_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  scraped_at TIMESTAMP,
  INDEX idx_builder_community (builder_id, community_id),
  INDEX idx_expiration (expiration_date)
);

-- Inventory (Quick Move-In Homes) table
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  builder_id UUID NOT NULL REFERENCES builders(id) ON DELETE CASCADE,
  address VARCHAR(500),
  lot_number VARCHAR(50),
  model_name VARCHAR(255),
  square_feet INTEGER,
  bedrooms INTEGER,
  bathrooms DECIMAL(4, 1),
  garage_spaces INTEGER,
  status VARCHAR(50) DEFAULT 'available',
  price DECIMAL(12, 2),
  estimated_completion DATE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_builder_community (builder_id, community_id),
  INDEX idx_status (status)
);

-- Favorite incentives (user saves)
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  incentive_id UUID NOT NULL REFERENCES incentives(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, incentive_id)
);

-- Submissions (User-submitted incentives for approval)
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  builder_id UUID NOT NULL REFERENCES builders(id) ON DELETE CASCADE,
  community_id UUID REFERENCES communities(id) ON DELETE SET NULL,
  type VARCHAR(100) NOT NULL,
  value DECIMAL(12, 2),
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by_id UUID REFERENCES users(id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Email subscriptions/alerts
CREATE TABLE email_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_type VARCHAR(50) DEFAULT 'weekly' CHECK (subscription_type IN ('daily', 'weekly', 'never')),
  builders_filter UUID[] DEFAULT '{}',
  cities_filter VARCHAR(255)[] DEFAULT '{}',
  last_sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Audit log for admin actions
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_created (user_id, created_at),
  INDEX idx_action (action)
);

-- Scraper logs
CREATE TABLE scraper_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  builder_id UUID NOT NULL REFERENCES builders(id) ON DELETE CASCADE,
  status VARCHAR(50) CHECK (status IN ('started', 'success', 'failed')),
  items_scraped INTEGER DEFAULT 0,
  items_created INTEGER DEFAULT 0,
  items_updated INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  INDEX idx_builder_created (builder_id, started_at)
);

-- Create indexes for common queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created ON users(created_at);
CREATE INDEX idx_incentives_active ON incentives(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_inventory_status ON inventory(status);
CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_subscriptions_user ON email_subscriptions(user_id);

-- Enable RLS (Row Level Security) for multi-tenancy
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE incentives ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can read their own profile" 
  ON users FOR SELECT 
  USING (auth.uid()::uuid = id OR (SELECT role FROM users WHERE id = auth.uid()::uuid) = 'admin');

CREATE POLICY "Public can read active incentives" 
  ON incentives FOR SELECT 
  USING (is_active = TRUE);

CREATE POLICY "Users can read favorites" 
  ON favorites FOR SELECT 
  USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can create favorites" 
  ON favorites FOR INSERT 
  WITH CHECK (user_id = auth.uid()::uuid);

CREATE POLICY "Users can delete own favorites" 
  ON favorites FOR DELETE 
  USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can read own subscriptions" 
  ON email_subscriptions FOR SELECT 
  USING (user_id = auth.uid()::uuid);
