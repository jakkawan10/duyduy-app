-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  file_path VARCHAR(1000) NOT NULL,
  file_size BIGINT NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  public_url VARCHAR(1000),
  status VARCHAR(50) DEFAULT 'uploaded',
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  earnings DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create id_cards table
CREATE TABLE IF NOT EXISTS id_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  side VARCHAR(10) NOT NULL CHECK (side IN ('front', 'back')),
  file_path VARCHAR(1000) NOT NULL,
  file_size BIGINT NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  original_name VARCHAR(500),
  verification_status VARCHAR(50) DEFAULT 'pending',
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, side)
);

-- Create bankbooks table
CREATE TABLE IF NOT EXISTS bankbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL UNIQUE,
  bank_name VARCHAR(200) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  masked_account_number VARCHAR(50) NOT NULL,
  file_path VARCHAR(1000) NOT NULL,
  file_size BIGINT NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  original_name VARCHAR(500),
  verification_status VARCHAR(50) DEFAULT 'pending',
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_id_cards_user_id ON id_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_id_cards_verification_status ON id_cards(verification_status);

CREATE INDEX IF NOT EXISTS idx_bankbooks_user_id ON bankbooks(user_id);
CREATE INDEX IF NOT EXISTS idx_bankbooks_verification_status ON bankbooks(verification_status);

-- Enable Row Level Security (RLS)
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE id_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE bankbooks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (users can only access their own data)
CREATE POLICY "Users can view own videos" ON videos
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own videos" ON videos
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own videos" ON videos
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own videos" ON videos
  FOR DELETE USING (auth.uid()::text = user_id);

-- Similar policies for id_cards and bankbooks
CREATE POLICY "Users can view own id_cards" ON id_cards
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own id_cards" ON id_cards
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own id_cards" ON id_cards
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own bankbooks" ON bankbooks
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own bankbooks" ON bankbooks
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own bankbooks" ON bankbooks
  FOR UPDATE USING (auth.uid()::text = user_id);
