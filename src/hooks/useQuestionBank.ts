import { useState, useEffect, useCallback } from 'react';
import { QuestionBankService, type SectionalPracticeParams, type FullTestModuleParams, type QuestionSelectionResult } from '@/lib/questionBankService';
import { type QuestionWithDetails } from '@/lib/supabase';

export interface UseQuestionBankState {
  questions: QuestionWithDetails[];
  loading: boolean;
  error: string | null;
  sessionId: string | null;
  moduleDifficulty?: string;
}

export interface UseQuestionBankActions {
  loadSectionalPracticeQuestions: (params: Omit<SectionalPracticeParams, 'sessionId'>) => Promise<void>;
  loadFullTestModule1Questions: (params: Omit<FullTestModuleParams, 'moduleNumber' | 'module1Score'>) => Promise<void>;
  loadFullTestModule2Questions: (params: FullTestModuleParams) => Promise<void>;
  recordQuestionUsage: (questionId: string, practiceType: 'sectional' | 'full_test', moduleNumber?: number) => Promise<void>;
  completeSession: (totalQuestions: number, correctAnswers: number) => Promise<void>;
  reset: () => void;
}

export function useQuestionBank(userId: string): [UseQuestionBankState, UseQuestionBankActions] {
  const [state, setState] = useState<UseQuestionBankState>({
    questions: [],
    loading: false,
    error: null,
    sessionId: null,
    moduleDifficulty: undefined
  });

  const reset = useCallback(() => {
    setState({
      questions: [],
      loading: false,
      error: null,
      sessionId: null,
      moduleDifficulty: undefined
    });
  }, []);

  const loadSectionalPracticeQuestions = useCallback(async (params: Omit<SectionalPracticeParams, 'sessionId'>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const sessionId = QuestionBankService.generateSessionId();
      const result = await QuestionBankService.getSectionalPracticeQuestions({
        ...params,
        sessionId
      });

      setState(prev => ({
        ...prev,
        questions: result.questions,
        sessionId: result.sessionId,
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error loading sectional practice questions:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load questions'
      }));
    }
  }, []);

  const loadFullTestModule1Questions = useCallback(async (params: Omit<FullTestModuleParams, 'moduleNumber' | 'module1Score'>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await QuestionBankService.getFullTestModule1Questions(params);

      setState(prev => ({
        ...prev,
        questions: result.questions,
        sessionId: result.sessionId,
        moduleDifficulty: result.moduleDifficulty,
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error loading full test module 1 questions:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load questions'
      }));
    }
  }, []);

  const loadFullTestModule2Questions = useCallback(async (params: FullTestModuleParams) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await QuestionBankService.getFullTestModule2Questions(params);

      setState(prev => ({
        ...prev,
        questions: result.questions,
        sessionId: result.sessionId,
        moduleDifficulty: result.moduleDifficulty,
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error loading full test module 2 questions:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load questions'
      }));
    }
  }, []);

  const recordQuestionUsage = useCallback(async (
    questionId: string, 
    practiceType: 'sectional' | 'full_test', 
    moduleNumber?: number
  ) => {
    if (!state.sessionId) {
      console.error('No active session to record question usage');
      return;
    }

    try {
      await QuestionBankService.recordQuestionUsage({
        userId,
        questionId,
        sessionId: state.sessionId,
        practiceType,
        moduleNumber
      });
    } catch (error) {
      console.error('Error recording question usage:', error);
      // Don't update state for this error as it's not critical to the user experience
    }
  }, [userId, state.sessionId]);

  const completeSession = useCallback(async (totalQuestions: number, correctAnswers: number) => {
    if (!state.sessionId) {
      console.error('No active session to complete');
      return;
    }

    try {
      const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
      await QuestionBankService.completePracticeSession({
        sessionId: state.sessionId,
        totalQuestions,
        correctAnswers,
        scorePercentage
      });
    } catch (error) {
      console.error('Error completing session:', error);
      // Don't update state for this error as it's not critical to the user experience
    }
  }, [state.sessionId]);

  return [
    state,
    {
      loadSectionalPracticeQuestions,
      loadFullTestModule1Questions,
      loadFullTestModule2Questions,
      recordQuestionUsage,
      completeSession,
      reset
    }
  ];
}

// Hook for managing domains and subunits
export function useDomainsAndSubunits() {
  const [domains, setDomains] = useState<Array<{
    id: string;
    name: string;
    description: string | null;
    subunits: Array<{ id: string; name: string; description: string | null }>;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDomainsAndSubunits = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await QuestionBankService.getDomainsAndSubunits();
      setDomains(result.domains);
    } catch (err) {
      console.error('Error loading domains and subunits:', err);
      setError(err instanceof Error ? err.message : 'Failed to load domains');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDomainsAndSubunits();
  }, [loadDomainsAndSubunits]);

  return {
    domains,
    loading,
    error,
    refetch: loadDomainsAndSubunits
  };
} 