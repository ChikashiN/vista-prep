import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Domain {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subunit {
  id: string;
  domain_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  domain_id: string;
  subunit_id: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question_text: string;
  choices: string[];
  answer: number; // 0-based index
  explanation: string | null;
  passage_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserQuestionUsage {
  id: string;
  user_id: string;
  question_id: string;
  session_id: string;
  practice_type: 'sectional' | 'full_test';
  module_number: number | null;
  answered_at: string;
}

export interface PracticeSession {
  id: string;
  user_id: string;
  session_type: 'sectional' | 'full_test';
  domain_id: string | null;
  subunit_id: string | null;
  difficulty: string | null;
  module_1_difficulty: string | null;
  module_2_difficulty: string | null;
  started_at: string;
  completed_at: string | null;
  total_questions: number | null;
  correct_answers: number | null;
  score_percentage: number | null;
}

export interface SATBlueprint {
  id: string;
  question_number: number;
  domain_id: string;
  subunit_id: string;
  description: string;
  created_at: string;
}

// Extended types with joins
export interface QuestionWithDetails extends Question {
  domain: Domain;
  subunit: Subunit;
}

export interface SATBlueprintWithDetails extends SATBlueprint {
  domain: Domain;
  subunit: Subunit;
} 