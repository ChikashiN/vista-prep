-- SAT Reading & Writing Question Bank Schema
-- Supabase Database Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Domains table (Craft & Structure, Information & Ideas, etc.)
CREATE TABLE domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subunits table (Words in Context, Rhetorical Synthesis, etc.)
CREATE TABLE subunits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain_id UUID REFERENCES domains(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(domain_id, name)
);

-- Questions table
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain_id UUID REFERENCES domains(id) ON DELETE CASCADE,
    subunit_id UUID REFERENCES subunits(id) ON DELETE CASCADE,
    difficulty VARCHAR(10) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    question_text TEXT NOT NULL,
    choices JSONB NOT NULL, -- Array of answer choices
    answer INTEGER NOT NULL, -- Index of correct answer (0-based)
    explanation TEXT,
    passage_text TEXT, -- For questions with passages
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User question usage tracking
CREATE TABLE user_question_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- Will reference auth.users when auth is set up
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    session_id UUID NOT NULL, -- To track usage within a session
    practice_type VARCHAR(20) NOT NULL, -- 'sectional' or 'full_test'
    module_number INTEGER, -- For full test mode (1 or 2)
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, question_id, session_id)
);

-- Practice sessions table
CREATE TABLE practice_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    session_type VARCHAR(20) NOT NULL, -- 'sectional' or 'full_test'
    domain_id UUID REFERENCES domains(id), -- For sectional practice
    subunit_id UUID REFERENCES subunits(id), -- For sectional practice
    difficulty VARCHAR(10), -- For sectional practice
    module_1_difficulty VARCHAR(10), -- For full test mode
    module_2_difficulty VARCHAR(10), -- For full test mode (determined after module 1)
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    total_questions INTEGER,
    correct_answers INTEGER,
    score_percentage DECIMAL(5,2)
);

-- SAT Blueprint table for full test structure
CREATE TABLE sat_blueprint (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_number INTEGER NOT NULL,
    domain_id UUID REFERENCES domains(id) ON DELETE CASCADE,
    subunit_id UUID REFERENCES subunits(id) ON DELETE CASCADE,
    description VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(question_number)
);

-- Insert default domains
INSERT INTO domains (name, description) VALUES
('Craft & Structure', 'Understanding how authors use language and structure to convey meaning'),
('Information & Ideas', 'Comprehending explicit and implicit information in texts'),
('Standard English Conventions', 'Understanding and applying standard English grammar and usage'),
('Expression of Ideas', 'Understanding how authors develop and organize ideas');

-- Insert default subunits
INSERT INTO subunits (domain_id, name, description) VALUES
-- Craft & Structure
((SELECT id FROM domains WHERE name = 'Craft & Structure'), 'Words in Context', 'Understanding vocabulary in context'),
((SELECT id FROM domains WHERE name = 'Craft & Structure'), 'Text Structure & Purpose', 'Understanding how texts are organized'),
((SELECT id FROM domains WHERE name = 'Craft & Structure'), 'Cross-Text Connections', 'Understanding relationships between texts'),

-- Information & Ideas
((SELECT id FROM domains WHERE name = 'Information & Ideas'), 'Central Ideas & Details', 'Identifying main ideas and supporting details'),
((SELECT id FROM domains WHERE name = 'Information & Ideas'), 'Command of Evidence: Textual', 'Using textual evidence to support claims'),
((SELECT id FROM domains WHERE name = 'Information & Ideas'), 'Command of Evidence: Quantitative', 'Using quantitative evidence to support claims'),
((SELECT id FROM domains WHERE name = 'Information & Ideas'), 'Inferences', 'Making logical inferences from text'),

-- Standard English Conventions
((SELECT id FROM domains WHERE name = 'Standard English Conventions'), 'Boundaries', 'Understanding sentence boundaries and punctuation'),
((SELECT id FROM domains WHERE name = 'Standard English Conventions'), 'Form, Structure, and Sense', 'Understanding sentence structure and meaning'),

-- Expression of Ideas
((SELECT id FROM domains WHERE name = 'Expression of Ideas'), 'Transitions', 'Understanding logical transitions between ideas'),
((SELECT id FROM domains WHERE name = 'Expression of Ideas'), 'Rhetorical Synthesis', 'Synthesizing information from multiple sources');

-- Insert SAT blueprint structure (27 questions)
INSERT INTO sat_blueprint (question_number, domain_id, subunit_id, description) VALUES
-- Questions 1-5: Craft & Structure - Words in Context
(1, (SELECT id FROM domains WHERE name = 'Craft & Structure'), (SELECT id FROM subunits WHERE name = 'Words in Context'), 'Words in Context'),
(2, (SELECT id FROM domains WHERE name = 'Craft & Structure'), (SELECT id FROM subunits WHERE name = 'Words in Context'), 'Words in Context'),
(3, (SELECT id FROM domains WHERE name = 'Craft & Structure'), (SELECT id FROM subunits WHERE name = 'Words in Context'), 'Words in Context'),
(4, (SELECT id FROM domains WHERE name = 'Craft & Structure'), (SELECT id FROM subunits WHERE name = 'Words in Context'), 'Words in Context'),
(5, (SELECT id FROM domains WHERE name = 'Craft & Structure'), (SELECT id FROM subunits WHERE name = 'Words in Context'), 'Words in Context'),

-- Question 6: Craft & Structure - Text Structure & Purpose
(6, (SELECT id FROM domains WHERE name = 'Craft & Structure'), (SELECT id FROM subunits WHERE name = 'Text Structure & Purpose'), 'Text Structure & Purpose'),

-- Questions 7-8: Information & Ideas - Central Ideas & Details
(7, (SELECT id FROM domains WHERE name = 'Information & Ideas'), (SELECT id FROM subunits WHERE name = 'Central Ideas & Details'), 'Central Ideas & Details'),
(8, (SELECT id FROM domains WHERE name = 'Information & Ideas'), (SELECT id FROM subunits WHERE name = 'Central Ideas & Details'), 'Central Ideas & Details'),

-- Questions 9-10: Information & Ideas - Command of Evidence: Textual
(9, (SELECT id FROM domains WHERE name = 'Information & Ideas'), (SELECT id FROM subunits WHERE name = 'Command of Evidence: Textual'), 'Command of Evidence: Textual'),
(10, (SELECT id FROM domains WHERE name = 'Information & Ideas'), (SELECT id FROM subunits WHERE name = 'Command of Evidence: Textual'), 'Command of Evidence: Textual'),

-- Question 11: Information & Ideas - Command of Evidence: Quantitative
(11, (SELECT id FROM domains WHERE name = 'Information & Ideas'), (SELECT id FROM subunits WHERE name = 'Command of Evidence: Quantitative'), 'Command of Evidence: Quantitative'),

-- Questions 12-13: Information & Ideas - Inferences
(12, (SELECT id FROM domains WHERE name = 'Information & Ideas'), (SELECT id FROM subunits WHERE name = 'Inferences'), 'Inferences'),
(13, (SELECT id FROM domains WHERE name = 'Information & Ideas'), (SELECT id FROM subunits WHERE name = 'Inferences'), 'Inferences'),

-- Question 14: Craft & Structure - Cross-Text Connections
(14, (SELECT id FROM domains WHERE name = 'Craft & Structure'), (SELECT id FROM subunits WHERE name = 'Cross-Text Connections'), 'Cross-Text Connections'),

-- Questions 15-17: Standard Conventions - Boundaries
(15, (SELECT id FROM domains WHERE name = 'Standard English Conventions'), (SELECT id FROM subunits WHERE name = 'Boundaries'), 'Boundaries'),
(16, (SELECT id FROM domains WHERE name = 'Standard English Conventions'), (SELECT id FROM subunits WHERE name = 'Boundaries'), 'Boundaries'),
(17, (SELECT id FROM domains WHERE name = 'Standard English Conventions'), (SELECT id FROM subunits WHERE name = 'Boundaries'), 'Boundaries'),

-- Questions 18-19: Standard Conventions - Form, Structure, and Sense
(18, (SELECT id FROM domains WHERE name = 'Standard English Conventions'), (SELECT id FROM subunits WHERE name = 'Form, Structure, and Sense'), 'Form, Structure, and Sense'),
(19, (SELECT id FROM domains WHERE name = 'Standard English Conventions'), (SELECT id FROM subunits WHERE name = 'Form, Structure, and Sense'), 'Form, Structure, and Sense'),

-- Questions 20-21: Standard Conventions - Boundaries
(20, (SELECT id FROM domains WHERE name = 'Standard English Conventions'), (SELECT id FROM subunits WHERE name = 'Boundaries'), 'Boundaries'),
(21, (SELECT id FROM domains WHERE name = 'Standard English Conventions'), (SELECT id FROM subunits WHERE name = 'Boundaries'), 'Boundaries'),

-- Questions 22-24: Expression of Ideas - Transitions
(22, (SELECT id FROM domains WHERE name = 'Expression of Ideas'), (SELECT id FROM subunits WHERE name = 'Transitions'), 'Transitions'),
(23, (SELECT id FROM domains WHERE name = 'Expression of Ideas'), (SELECT id FROM subunits WHERE name = 'Transitions'), 'Transitions'),
(24, (SELECT id FROM domains WHERE name = 'Expression of Ideas'), (SELECT id FROM subunits WHERE name = 'Transitions'), 'Transitions'),

-- Questions 25-27: Expression of Ideas - Rhetorical Synthesis
(25, (SELECT id FROM domains WHERE name = 'Expression of Ideas'), (SELECT id FROM subunits WHERE name = 'Rhetorical Synthesis'), 'Rhetorical Synthesis'),
(26, (SELECT id FROM domains WHERE name = 'Expression of Ideas'), (SELECT id FROM subunits WHERE name = 'Rhetorical Synthesis'), 'Rhetorical Synthesis'),
(27, (SELECT id FROM domains WHERE name = 'Expression of Ideas'), (SELECT id FROM subunits WHERE name = 'Rhetorical Synthesis'), 'Rhetorical Synthesis');

-- Create indexes for performance
CREATE INDEX idx_questions_domain_subunit_difficulty ON questions(domain_id, subunit_id, difficulty);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_user_question_usage_user_session ON user_question_usage(user_id, session_id);
CREATE INDEX idx_practice_sessions_user_type ON practice_sessions(user_id, session_type);
CREATE INDEX idx_sat_blueprint_question_number ON sat_blueprint(question_number);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_domains_updated_at BEFORE UPDATE ON domains FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subunits_updated_at BEFORE UPDATE ON subunits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_question_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read questions
CREATE POLICY "Allow authenticated users to read questions" ON questions
    FOR SELECT USING (true);

-- Allow users to manage their own usage data
CREATE POLICY "Users can manage their own question usage" ON user_question_usage
    FOR ALL USING (auth.uid() = user_id);

-- Allow users to manage their own practice sessions
CREATE POLICY "Users can manage their own practice sessions" ON practice_sessions
    FOR ALL USING (auth.uid() = user_id); 