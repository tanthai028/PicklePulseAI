-- Drop existing health_stats table and recreate with new schema
DROP TABLE IF EXISTS health_stats CASCADE;

CREATE TABLE health_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    sleep_hours NUMERIC NOT NULL DEFAULT 7,
    hunger INTEGER NOT NULL DEFAULT 3 CHECK (hunger BETWEEN 1 AND 5),
    soreness INTEGER NOT NULL DEFAULT 3 CHECK (soreness BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Recreate index for better query performance
CREATE INDEX idx_health_stats_user_date ON health_stats(user_id, date);

-- Set up Row Level Security (RLS)
ALTER TABLE health_stats ENABLE ROW LEVEL SECURITY;

-- Recreate policies
CREATE POLICY "Users can view own health stats"
    ON health_stats FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health stats"
    ON health_stats FOR INSERT
    WITH CHECK (auth.uid() = user_id);
