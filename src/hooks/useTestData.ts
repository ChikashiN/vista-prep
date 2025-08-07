import { useState, useEffect } from 'react';

export interface TestResult {
  id: string;
  date: string;
  type: 'full' | 'sectional' | 'daily';
  section: 'reading' | 'math' | 'both';
  domain?: string;
  totalQuestions: number;
  correctAnswers: number;
  score?: {
    reading?: number;
    math?: number;
    total?: number;
  };
  timeSpent: number;
  completedAt: Date;
  xpEarned?: number;
}

export interface UserData {
  name: string;
  level: number;
  currentXP: number;
  totalXP: number;
  streak: number;
  badge: string;
  lastActivityDate: string;
}

export interface WeeklyData {
  period: string;
  attempted: number;
  correct: number;
  percentage: number;
}

export interface DomainAccuracy {
  domain: string;
  accuracy: number;
  improvement: string;
  totalQuestions: number;
  correctAnswers: number;
}

const STORAGE_KEY = 'sat_performance_data';
const USER_DATA_KEY = 'sat_user_data';

// XP earning rules as specified
const XP_RULES = {
  ANSWERED_QUESTION: 10,
  CORRECT_ANSWER_BONUS: 5,
  FINISH_PRACTICE_SET: 50,
  FINISH_FULL_TEST: 100,
  STREAK_BONUS: 25
};

// Level thresholds (every 500 XP = 1 level)
const XP_PER_LEVEL = 500;

// Badge thresholds
const BADGES = {
  1: "SAT Rookie",
  3: "SAT Explorer", 
  5: "SAT Warrior",
  8: "SAT Master",
  12: "SAT Legend",
  15: "SAT Champion"
};

export function useTestData() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [userData, setUserData] = useState<UserData>({
    name: "Alex",
    level: 1,
    currentXP: 0,
    totalXP: 0,
    streak: 0,
    badge: "SAT Rookie",
    lastActivityDate: new Date().toDateString()
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    const storedUserData = localStorage.getItem(USER_DATA_KEY);
    
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setTestResults(parsed.map((result: any) => ({
          ...result,
          completedAt: new Date(result.completedAt)
        })));
      } catch (error) {
        console.error('Error loading test data:', error);
      }
    }
    
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    } else {
      // Add some sample data for demonstration
      const sampleData = [
        {
          id: '1',
          date: 'Aug 06',
          type: 'full' as const,
          section: 'both' as const,
          totalQuestions: 134,
          correctAnswers: 108,
          score: { reading: 680, math: 780, total: 1460 },
          timeSpent: 7200,
          completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          xpEarned: 1340
        },
        {
          id: '2', 
          date: 'Jul 30',
          type: 'full' as const,
          section: 'both' as const,
          totalQuestions: 134,
          correctAnswers: 98,
          score: { reading: 650, math: 760, total: 1410 },
          timeSpent: 7200,
          completedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
          xpEarned: 1240
        }
      ];
      setTestResults(sampleData);
    }

    if (storedUserData) {
      try {
        const parsed = JSON.parse(storedUserData);
        setUserData(parsed);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (testResults.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(testResults));
    }
  }, [testResults]);

  useEffect(() => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  }, [userData]);

  // Calculate XP earned based on performance
  const calculateXPEarned = (totalQuestions: number, correctAnswers: number, type: 'full' | 'sectional' | 'daily') => {
    let xp = 0;
    
    // Base XP for answered questions
    xp += totalQuestions * XP_RULES.ANSWERED_QUESTION;
    
    // Bonus XP for correct answers
    xp += correctAnswers * XP_RULES.CORRECT_ANSWER_BONUS;
    
    // Completion bonus
    if (type === 'sectional' || type === 'daily') {
      xp += XP_RULES.FINISH_PRACTICE_SET;
    } else if (type === 'full') {
      xp += XP_RULES.FINISH_FULL_TEST;
    }
    
    return xp;
  };

  // Update user level and badge based on XP
  const updateUserLevel = (newTotalXP: number) => {
    const newLevel = Math.floor(newTotalXP / XP_PER_LEVEL) + 1;
    const currentLevelXP = newTotalXP % XP_PER_LEVEL;
    
    // Determine badge
    let newBadge = "SAT Rookie";
    for (const [level, badge] of Object.entries(BADGES)) {
      if (newLevel >= parseInt(level)) {
        newBadge = badge;
      }
    }
    
    return {
      level: newLevel,
      currentXP: currentLevelXP,
      totalXP: newTotalXP,
      badge: newBadge
    };
  };

  // Update streak
  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastActivity = new Date(userData.lastActivityDate);
    const daysSinceLastActivity = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastActivity === 1) {
      // Consecutive day
      const newStreak = userData.streak + 1;
      const streakBonus = newStreak >= 3 ? XP_RULES.STREAK_BONUS : 0;
      
      setUserData(prev => ({
        ...prev,
        streak: newStreak,
        lastActivityDate: today,
        ...updateUserLevel(prev.totalXP + streakBonus)
      }));
      
      return streakBonus;
    } else if (daysSinceLastActivity === 0) {
      // Same day, no streak update
      return 0;
    } else {
      // Streak broken
      setUserData(prev => ({
        ...prev,
        streak: 1,
        lastActivityDate: today
      }));
      return 0;
    }
  };

  const addTestResult = (result: Omit<TestResult, 'id' | 'completedAt' | 'xpEarned'>) => {
    const xpEarned = calculateXPEarned(result.totalQuestions, result.correctAnswers, result.type);
    const streakBonus = updateStreak();
    const totalXPEarned = xpEarned + streakBonus;
    
    const newResult: TestResult = {
      ...result,
      id: Date.now().toString(),
      completedAt: new Date(),
      xpEarned: totalXPEarned
    };
    
    setTestResults(prev => [...prev, newResult]);
    
    // Update user data with new XP
    setUserData(prev => ({
      ...prev,
      ...updateUserLevel(prev.totalXP + totalXPEarned)
    }));
    
    return totalXPEarned;
  };

  const getUserData = () => userData;

  const getNextLevelXP = () => (userData.level * XP_PER_LEVEL);

  const getRecentScores = (limit: number = 3) => {
    return testResults
      .filter(result => result.type === 'full' && result.score)
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
      .slice(0, limit)
      .map(result => ({
        date: result.date,
        scoreRange: result.score?.total ? `${Math.max(result.score.total - 100, 400)}-${Math.min(result.score.total + 100, 1600)}` : '400-1600',
        readingScore: result.score?.reading || 400,
        mathScore: result.score?.math || 400,
        totalScore: result.score?.total || 800
      }));
  };

  const getWeeklyData = (): WeeklyData[] => {
    const now = new Date();
    const weeklyData: WeeklyData[] = [];
    
    for (let i = 4; i >= 0; i--) {
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() - (i * 7));
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 7);
      
      const weekResults = testResults.filter(result => 
        result.completedAt >= startDate && result.completedAt < endDate
      );
      
      const attempted = weekResults.reduce((sum, result) => sum + result.totalQuestions, 0);
      const correct = weekResults.reduce((sum, result) => sum + result.correctAnswers, 0);
      
      if (attempted > 0) {
        weeklyData.push({
          period: `${String(startDate.getMonth() + 1).padStart(2, '0')}/${String(startDate.getDate()).padStart(2, '0')}-${String(endDate.getMonth() + 1).padStart(2, '0')}/${String(endDate.getDate()).padStart(2, '0')}`,
          attempted,
          correct,
          percentage: Math.round((correct / attempted) * 100)
        });
      }
    }
    
    // Always show at least 3 weeks with data or placeholders
    while (weeklyData.length < 3) {
      const lastDate = weeklyData.length > 0 ? new Date(weeklyData[weeklyData.length - 1].period.split('-')[0]) : now;
      lastDate.setDate(lastDate.getDate() - 7);
      
      weeklyData.push({
        period: `${String(lastDate.getMonth() + 1).padStart(2, '0')}/${String(lastDate.getDate()).padStart(2, '0')}-${String(lastDate.getMonth() + 1).padStart(2, '0')}/${String(lastDate.getDate() + 6).padStart(2, '0')}`,
        attempted: 0,
        correct: 0,
        percentage: 0
      });
    }
    
    return weeklyData.slice(0, 5); // Show latest 5 weeks
  };

  const getOverallAccuracy = () => {
    const totalQuestions = testResults.reduce((sum, result) => sum + result.totalQuestions, 0);
    const totalCorrect = testResults.reduce((sum, result) => sum + result.correctAnswers, 0);
    
    return {
      totalQuestions,
      totalCorrect,
      percentage: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
    };
  };

  const getDomainAccuracy = (): DomainAccuracy[] => {
    const domainMap = new Map<string, { correct: number; total: number; previous: number }>();
    
    // Convert domain keys to readable names
    const domainNames: { [key: string]: string } = {
      'information-ideas': 'Information and Ideas',
      'craft-structure': 'Craft and Structure', 
      'expression-ideas': 'Expression of Ideas',
      'standard-conventions': 'Standard English Conventions',
      'algebra': 'Algebra',
      'advanced-math': 'Advanced Math',
      'problem-solving': 'Problem-Solving and Data Analysis',
      'geometry': 'Geometry and Trigonometry'
    };
    
    testResults.forEach(result => {
      if (result.domain) {
        const current = domainMap.get(result.domain) || { correct: 0, total: 0, previous: 0 };
        domainMap.set(result.domain, {
          correct: current.correct + result.correctAnswers,
          total: current.total + result.totalQuestions,
          previous: current.previous // This would need more complex logic for real improvement tracking
        });
      }
    });
    
    return Array.from(domainMap.entries()).map(([domain, data]) => {
      const accuracy = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
      const displayName = domainNames[domain] || domain;
      return {
        domain: displayName,
        accuracy,
        improvement: `+${Math.floor(Math.random() * 10)}%`, // Placeholder - would need historical data
        totalQuestions: data.total,
        correctAnswers: data.correct
      };
    }).sort((a, b) => b.accuracy - a.accuracy); // Sort by accuracy descending
  };

  const getStrongestAndWeakest = () => {
    const domainAccuracy = getDomainAccuracy();
    if (domainAccuracy.length === 0) {
      return {
        strongest: { domain: 'No data yet', accuracy: 0 },
        weakest: { domain: 'No data yet', accuracy: 0 }
      };
    }
    
    const strongest = domainAccuracy.reduce((max, current) => 
      current.accuracy > max.accuracy ? current : max
    );
    
    const weakest = domainAccuracy.reduce((min, current) => 
      current.accuracy < min.accuracy ? current : min
    );
    
    return { strongest, weakest };
  };

  // Function to manually add XP for testing
  const addXP = (amount: number) => {
    setUserData(prev => ({
      ...prev,
      ...updateUserLevel(prev.totalXP + amount)
    }));
  };

  return {
    testResults,
    addTestResult,
    addXP, // Add this for testing
    getRecentScores,
    getWeeklyData,
    getOverallAccuracy,
    getDomainAccuracy,
    getStrongestAndWeakest,
    getUserData,
    getNextLevelXP
  };
}