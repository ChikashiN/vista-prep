import { supabase, type Question, type QuestionWithDetails, type PracticeSession, type SATBlueprintWithDetails } from './supabase';

export interface SectionalPracticeParams {
  domainId: string;
  subunitId: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionCount: number;
  userId: string;
  sessionId: string;
}

export interface FullTestModuleParams {
  moduleNumber: 1 | 2;
  userId: string;
  sessionId: string;
  module1Score?: number; // For determining module 2 difficulty
}

export interface QuestionSelectionResult {
  questions: QuestionWithDetails[];
  sessionId: string;
  moduleDifficulty?: string;
}

export class QuestionBankService {
  /**
   * Get questions for sectional practice mode
   * Pulls randomized questions matching domain + subunit + difficulty
   * Ensures no repeats for the same user in the same session
   */
  static async getSectionalPracticeQuestions(params: SectionalPracticeParams): Promise<QuestionSelectionResult> {
    const { domainId, subunitId, difficulty, questionCount, userId, sessionId } = params;

    try {
      // Get questions that match the criteria and haven't been used by this user in this session
      const { data: questions, error } = await supabase
        .from('questions')
        .select(`
          *,
          domain:domains(*),
          subunit:subunits(*)
        `)
        .eq('domain_id', domainId)
        .eq('subunit_id', subunitId)
        .eq('difficulty', difficulty)
        .not('id', 'in', `(
          SELECT question_id 
          FROM user_question_usage 
          WHERE user_id = '${userId}' 
          AND session_id = '${sessionId}'
        )`)
        .order('RANDOM()')
        .limit(questionCount);

      if (error) {
        console.error('Error fetching sectional practice questions:', error);
        throw error;
      }

      // If we don't have enough questions, get some from other difficulties
      if (questions.length < questionCount) {
        const remainingCount = questionCount - questions.length;
        const { data: additionalQuestions, error: additionalError } = await supabase
          .from('questions')
          .select(`
            *,
            domain:domains(*),
            subunit:subunits(*)
          `)
          .eq('domain_id', domainId)
          .eq('subunit_id', subunitId)
          .not('difficulty', 'eq', difficulty)
          .not('id', 'in', `(
            SELECT question_id 
            FROM user_question_usage 
            WHERE user_id = '${userId}' 
            AND session_id = '${sessionId}'
          )`)
          .order('RANDOM()')
          .limit(remainingCount);

        if (additionalError) {
          console.error('Error fetching additional questions:', additionalError);
        } else if (additionalQuestions) {
          questions.push(...additionalQuestions);
        }
      }

      // Create practice session record
      await this.createPracticeSession({
        userId,
        sessionType: 'sectional',
        domainId,
        subunitId,
        difficulty,
        sessionId
      });

      return {
        questions: questions as QuestionWithDetails[],
        sessionId
      };
    } catch (error) {
      console.error('Error in getSectionalPracticeQuestions:', error);
      throw error;
    }
  }

  /**
   * Get questions for full test mode - Module 1
   * Pulls 27 questions following the exact SAT blueprint structure
   * Mix of Easy + Medium + Hard (fully random)
   */
  static async getFullTestModule1Questions(params: Omit<FullTestModuleParams, 'moduleNumber' | 'module1Score'>): Promise<QuestionSelectionResult> {
    const { userId, sessionId } = params;

    try {
      // Get the SAT blueprint structure
      const { data: blueprint, error: blueprintError } = await supabase
        .from('sat_blueprint')
        .select(`
          *,
          domain:domains(*),
          subunit:subunits(*)
        `)
        .order('question_number');

      if (blueprintError) {
        console.error('Error fetching SAT blueprint:', blueprintError);
        throw blueprintError;
      }

      const questions: QuestionWithDetails[] = [];

      // For each blueprint position, get a random question matching the criteria
      for (const blueprintItem of blueprint as SATBlueprintWithDetails[]) {
        const { data: question, error } = await supabase
          .from('questions')
          .select(`
            *,
            domain:domains(*),
            subunit:subunits(*)
          `)
          .eq('domain_id', blueprintItem.domain_id)
          .eq('subunit_id', blueprintItem.subunit_id)
          .not('id', 'in', `(
            SELECT question_id 
            FROM user_question_usage 
            WHERE user_id = '${userId}' 
            AND session_id = '${sessionId}'
          )`)
          .order('RANDOM()')
          .limit(1)
          .single();

        if (error) {
          console.error(`Error fetching question for position ${blueprintItem.question_number}:`, error);
          // Continue with other questions if one fails
          continue;
        }

        if (question) {
          questions.push(question as QuestionWithDetails);
        }
      }

      // Create practice session record
      await this.createPracticeSession({
        userId,
        sessionType: 'full_test',
        sessionId,
        module1Difficulty: 'Mixed'
      });

      return {
        questions,
        sessionId,
        moduleDifficulty: 'Mixed'
      };
    } catch (error) {
      console.error('Error in getFullTestModule1Questions:', error);
      throw error;
    }
  }

  /**
   * Get questions for full test mode - Module 2 (Adaptive)
   * Determines difficulty based on Module 1 performance
   * Maintains exact SAT blueprint structure
   */
  static async getFullTestModule2Questions(params: FullTestModuleParams): Promise<QuestionSelectionResult> {
    const { moduleNumber, userId, sessionId, module1Score } = params;

    if (moduleNumber !== 2) {
      throw new Error('Module 2 function called with wrong module number');
    }

    if (module1Score === undefined) {
      throw new Error('Module 1 score is required for Module 2 difficulty determination');
    }

    // Determine Module 2 difficulty based on Module 1 performance
    // Threshold: 19+/27 correct for Hard Module 2
    const qualifiesForHardModule = module1Score >= 19;
    const module2Difficulty = qualifiesForHardModule ? 'Hard' : 'Easy';

    try {
      // Get the SAT blueprint structure
      const { data: blueprint, error: blueprintError } = await supabase
        .from('sat_blueprint')
        .select(`
          *,
          domain:domains(*),
          subunit:subunits(*)
        `)
        .order('question_number');

      if (blueprintError) {
        console.error('Error fetching SAT blueprint:', blueprintError);
        throw blueprintError;
      }

      const questions: QuestionWithDetails[] = [];

      // For each blueprint position, get a random question matching the criteria
      for (const blueprintItem of blueprint as SATBlueprintWithDetails[]) {
        let query = supabase
          .from('questions')
          .select(`
            *,
            domain:domains(*),
            subunit:subunits(*)
          `)
          .eq('domain_id', blueprintItem.domain_id)
          .eq('subunit_id', blueprintItem.subunit_id)
          .not('id', 'in', `(
            SELECT question_id 
            FROM user_question_usage 
            WHERE user_id = '${userId}' 
            AND session_id = '${sessionId}'
          )`);

        // Apply difficulty filter based on module 2 difficulty
        if (module2Difficulty === 'Hard') {
          // Hard Module 2: Hard + Medium questions
          query = query.in('difficulty', ['Hard', 'Medium']);
        } else {
          // Easy Module 2: Easy + Medium questions
          query = query.in('difficulty', ['Easy', 'Medium']);
        }

        const { data: question, error } = await query
          .order('RANDOM()')
          .limit(1)
          .single();

        if (error) {
          console.error(`Error fetching question for position ${blueprintItem.question_number}:`, error);
          // Continue with other questions if one fails
          continue;
        }

        if (question) {
          questions.push(question as QuestionWithDetails);
        }
      }

      // Update practice session with module 2 difficulty
      await this.updatePracticeSessionModule2Difficulty(sessionId, module2Difficulty);

      return {
        questions,
        sessionId,
        moduleDifficulty: module2Difficulty
      };
    } catch (error) {
      console.error('Error in getFullTestModule2Questions:', error);
      throw error;
    }
  }

  /**
   * Record question usage for a user in a session
   */
  static async recordQuestionUsage(params: {
    userId: string;
    questionId: string;
    sessionId: string;
    practiceType: 'sectional' | 'full_test';
    moduleNumber?: number;
  }): Promise<void> {
    const { userId, questionId, sessionId, practiceType, moduleNumber } = params;

    try {
      const { error } = await supabase
        .from('user_question_usage')
        .insert({
          user_id: userId,
          question_id: questionId,
          session_id: sessionId,
          practice_type: practiceType,
          module_number: moduleNumber
        });

      if (error) {
        console.error('Error recording question usage:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in recordQuestionUsage:', error);
      throw error;
    }
  }

  /**
   * Create a new practice session
   */
  private static async createPracticeSession(params: {
    userId: string;
    sessionType: 'sectional' | 'full_test';
    sessionId: string;
    domainId?: string;
    subunitId?: string;
    difficulty?: string;
    module1Difficulty?: string;
  }): Promise<void> {
    const { userId, sessionType, sessionId, domainId, subunitId, difficulty, module1Difficulty } = params;

    try {
      const { error } = await supabase
        .from('practice_sessions')
        .insert({
          id: sessionId,
          user_id: userId,
          session_type: sessionType,
          domain_id: domainId,
          subunit_id: subunitId,
          difficulty,
          module_1_difficulty: module1Difficulty
        });

      if (error) {
        console.error('Error creating practice session:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in createPracticeSession:', error);
      throw error;
    }
  }

  /**
   * Update practice session with module 2 difficulty
   */
  private static async updatePracticeSessionModule2Difficulty(sessionId: string, module2Difficulty: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('practice_sessions')
        .update({ module_2_difficulty: module2Difficulty })
        .eq('id', sessionId);

      if (error) {
        console.error('Error updating practice session:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in updatePracticeSessionModule2Difficulty:', error);
      throw error;
    }
  }

  /**
   * Complete a practice session with results
   */
  static async completePracticeSession(params: {
    sessionId: string;
    totalQuestions: number;
    correctAnswers: number;
    scorePercentage: number;
  }): Promise<void> {
    const { sessionId, totalQuestions, correctAnswers, scorePercentage } = params;

    try {
      const { error } = await supabase
        .from('practice_sessions')
        .update({
          completed_at: new Date().toISOString(),
          total_questions: totalQuestions,
          correct_answers: correctAnswers,
          score_percentage: scorePercentage
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error completing practice session:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in completePracticeSession:', error);
      throw error;
    }
  }

  /**
   * Get available domains and subunits for sectional practice
   */
  static async getDomainsAndSubunits(): Promise<{
    domains: Array<{ id: string; name: string; description: string | null; subunits: Array<{ id: string; name: string; description: string | null }> }>;
  }> {
    try {
      const { data: domains, error: domainsError } = await supabase
        .from('domains')
        .select(`
          id,
          name,
          description,
          subunits:subunits(
            id,
            name,
            description
          )
        `)
        .order('name');

      if (domainsError) {
        console.error('Error fetching domains:', domainsError);
        throw domainsError;
      }

      return { domains: domains || [] };
    } catch (error) {
      console.error('Error in getDomainsAndSubunits:', error);
      throw error;
    }
  }

  /**
   * Generate a unique session ID
   */
  static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
} 