-- DriveWell Database Schema for Supabase
-- Execute this script in the Supabase SQL Editor

-- ============================================
-- TABLES
-- ============================================

-- Company Users (Admin accounts)
CREATE TABLE IF NOT EXISTS company_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers (Driver accounts)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  driver_license_number VARCHAR(100),
  driver_license_years INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Driver Profiles (One per customer)
CREATE TABLE IF NOT EXISTS driver_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL UNIQUE REFERENCES customers(id) ON DELETE CASCADE,

  -- Analysis window
  analysis_start_date TIMESTAMPTZ,
  analysis_end_date TIMESTAMPTZ,
  total_distance_km DECIMAL(10,2),
  total_driving_hours DECIMAL(10,2),

  -- Scores
  overall_score DECIMAL(5,2),
  overall_grade VARCHAR(1),
  risk_level VARCHAR(20),
  premium_modifier DECIMAL(5,3),

  -- 15 Driving parameters
  harsh_braking_per_100km DECIMAL(6,2),
  harsh_acceleration_per_100km DECIMAL(6,2),
  speeding_violations_per_100km DECIMAL(6,2),
  speeding_magnitude_kmh DECIMAL(6,2),
  smooth_acceleration_percentage DECIMAL(5,2),
  idling_time_percentage DECIMAL(5,2),
  optimal_gear_usage_percentage DECIMAL(5,2),
  fuel_efficiency_score DECIMAL(5,2),
  night_driving_percentage DECIMAL(5,2),
  weekend_driving_percentage DECIMAL(5,2),
  phone_usage_per_100km DECIMAL(6,2),
  fatigue_indicators_per_100km DECIMAL(6,2),
  total_mileage_driven INTEGER,
  years_holding_license INTEGER,
  route_variety_score DECIMAL(5,2),

  -- Computed data (JSON)
  competency_scores JSONB DEFAULT '[]'::JSONB,
  recommendations JSONB DEFAULT '[]'::JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coaching Sessions
CREATE TABLE IF NOT EXISTS coaching_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coaching Messages
CREATE TABLE IF NOT EXISTS coaching_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES coaching_sessions(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id),
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  context_metadata JSONB DEFAULT '{}'::JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_customers_auth_user_id ON customers(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_driver_profiles_customer_id ON driver_profiles(customer_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_customer_id ON coaching_sessions(customer_id);
CREATE INDEX IF NOT EXISTS idx_coaching_messages_session_id ON coaching_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_coaching_messages_timestamp ON coaching_messages(timestamp);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE company_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_messages ENABLE ROW LEVEL SECURITY;

-- Company Users Policies
CREATE POLICY "Company users can view own record" ON company_users
  FOR SELECT USING (auth.uid() = auth_user_id);

-- Customers Policies
CREATE POLICY "Company users can manage all customers" ON customers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM company_users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Customers can view own record" ON customers
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Customers can update own record" ON customers
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- Driver Profiles Policies
CREATE POLICY "Company users can manage all profiles" ON driver_profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM company_users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Customers can view own profile" ON driver_profiles
  FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
  );

-- Coaching Sessions Policies
CREATE POLICY "Company users can view all sessions" ON coaching_sessions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM company_users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Customers can manage own sessions" ON coaching_sessions
  FOR ALL USING (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
  );

-- Coaching Messages Policies
CREATE POLICY "Company users can view all messages" ON coaching_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM company_users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Customers can manage own messages" ON coaching_messages
  FOR ALL USING (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_driver_profiles_updated_at
  BEFORE UPDATE ON driver_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coaching_sessions_updated_at
  BEFORE UPDATE ON coaching_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INITIAL DATA (Optional - for testing)
-- ============================================

-- Note: To create an admin user, first create a user in Supabase Auth,
-- then insert their auth_user_id here:
-- INSERT INTO company_users (auth_user_id, email, full_name)
-- VALUES ('your-auth-user-uuid', 'admin@company.com', 'Admin User');
