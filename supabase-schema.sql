-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  grade INTEGER,
  board TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  board TEXT NOT NULL,
  grade INTEGER NOT NULL,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  grade INTEGER,
  board TEXT,
  questions JSONB NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  quiz_id INTEGER REFERENCES quizzes ON DELETE CASCADE NOT NULL,
  score INTEGER,
  total_questions INTEGER,
  answers JSONB,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for quizzes
CREATE POLICY "Users can view own quizzes" ON quizzes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own quizzes" ON quizzes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for quiz attempts
CREATE POLICY "Users can view own attempts" ON quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own attempts" ON quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert sample subjects
INSERT INTO subjects (name, board, grade, code) VALUES
('Mathematics', 'CBSE', 10, 'CBSE_10_MATH'),
('Science', 'CBSE', 10, 'CBSE_10_SCIENCE'),
('English', 'CBSE', 10, 'CBSE_10_ENGLISH'),
('Social Science', 'CBSE', 10, 'CBSE_10_SOCIAL'),
('Hindi', 'CBSE', 10, 'CBSE_10_HINDI'),
('Mathematics', 'ICSE', 10, 'ICSE_10_MATH'),
('Physics', 'ICSE', 10, 'ICSE_10_PHYSICS'),
('Chemistry', 'ICSE', 10, 'ICSE_10_CHEMISTRY'),
('Biology', 'ICSE', 10, 'ICSE_10_BIOLOGY'),
('English', 'ICSE', 10, 'ICSE_10_ENGLISH')
ON CONFLICT (code) DO NOTHING;