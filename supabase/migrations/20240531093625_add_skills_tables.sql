-- Create skills table
CREATE TABLE skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    section TEXT NOT NULL CHECK (section IN ('planning', 'practicing')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add index for better query performance
CREATE INDEX idx_skills_user ON skills(user_id);

-- Enable Row Level Security
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Create policies for skills table
CREATE POLICY "Users can view own skills"
    ON skills FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skills"
    ON skills FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills"
    ON skills FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills"
    ON skills FOR DELETE
    USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER skills_updated_at
    BEFORE UPDATE ON skills
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Update health_stats table to add performance_rating
ALTER TABLE health_stats 
ADD COLUMN IF NOT EXISTS performance_rating INTEGER CHECK (performance_rating BETWEEN 1 AND 5); 