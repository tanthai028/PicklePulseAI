-- Drop existing table if it exists
DROP TABLE IF EXISTS health_stats CASCADE;

-- Create health_stats table
CREATE TABLE health_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    sleep_hours NUMERIC(4,1) NOT NULL CHECK (sleep_hours BETWEEN 0 AND 24),
    hunger INTEGER NOT NULL CHECK (hunger BETWEEN 1 AND 5),
    soreness INTEGER NOT NULL CHECK (soreness BETWEEN 1 AND 5),
    performance_rating INTEGER CHECK (performance_rating BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, date)
);

-- Add index for better query performance
CREATE INDEX idx_health_stats_user_date ON health_stats(user_id, date);

-- Enable Row Level Security
ALTER TABLE health_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own health stats"
    ON health_stats FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health stats"
    ON health_stats FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health stats"
    ON health_stats FOR UPDATE
    USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER health_stats_updated_at
    BEFORE UPDATE ON health_stats
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at(); 