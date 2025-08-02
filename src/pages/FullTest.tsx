import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Timer, Flag, ChevronLeft, ChevronRight, Calculator, BookOpen, Save, Eye, PauseCircle, Menu, FileText, Pause, Square } from "lucide-react";

interface Question {
  id: number;
  passage?: string;
  question: string;
  choices: string[];
  correctAnswer: number;
  domain: string;
  difficulty: string;
  section: "reading" | "math";
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    passage: "The Renaissance period marked a significant shift in European art and culture. Artists began to focus more on realistic portrayals of human figures and natural landscapes.",
    question: "Based on the passage, the Renaissance period was characterized by:",
    choices: ["A continuation of medieval artistic traditions", "A shift toward more realistic artistic representations", "A focus solely on religious themes", "A decline in artistic innovation"],
    correctAnswer: 1,
    domain: "information-ideas",
    difficulty: "Medium",
    section: "reading"
  },
  {
    id: 2,
    question: "If 3x + 5 = 17, what is the value of x?",
    choices: ["2", "4", "6", "8"],
    correctAnswer: 1,
    domain: "algebra",
    difficulty: "Easy",
    section: "math"
  }
];

export default function FullTest() {
  const location = useLocation();
  const navigate = useNavigate();
  const settings = location.state || {};
  
  const [currentModule, setCurrentModule] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  // Module-specific state management
  const [module1Answers, setModule1Answers] = useState<(number | null)[]>([]);
  const [module2Answers, setModule2Answers] = useState<(number | null)[]>([]);
  const [module1Flagged, setModule1Flagged] = useState<Set<number>>(new Set());
  const [module2Flagged, setModule2Flagged] = useState<Set<number>>(new Set());
  
  // Current module's answers and flags (computed based on currentModule)
  const answers = currentModule === 1 ? module1Answers : module2Answers;
  const setAnswers = currentModule === 1 ? setModule1Answers : setModule2Answers;
  const flagged = currentModule === 1 ? module1Flagged : module2Flagged;
  const setFlagged = currentModule === 1 ? setModule1Flagged : setModule2Flagged;

  const [timeLeft, setTimeLeft] = useState(
    settings.mode === "full-math" ? 35 * 60 : 32 * 60
  ); // Math: 35 minutes, Reading: 32 minutes
  const [showBreak, setShowBreak] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(10 * 60); // 10 minutes
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentSection, setCurrentSection] = useState<"reading" | "math">(
    settings.mode === "full-math" ? "math" : "reading"
  );
  const [showReview, setShowReview] = useState(false);
  const [savedState, setSavedState] = useState<any>(null);
  const [showFlaggedPanel, setShowFlaggedPanel] = useState(false);
  const [showQuestionReview, setShowQuestionReview] = useState(false);
  const [module1Score, setModule1Score] = useState<number | null>(null);
  const [shouldUseHardModule2, setShouldUseHardModule2] = useState(false);
  const [highlightedText, setHighlightedText] = useState<Set<string>>(new Set());
  const [eliminatedChoices, setEliminatedChoices] = useState<Set<string>>(new Set());
  const [showCalculator, setShowCalculator] = useState(false);
  const [showReferenceSheet, setShowReferenceSheet] = useState(false);

  const getModuleQuestions = () => {
    if (settings.mode === "full-reading") {
      return 27; // 27 questions per module for Reading & Writing
    } else if (settings.mode === "full-math") {
      return 22; // 22 questions per module for Math
    } else {
      return currentSection === "reading" ? 27 : 22;
    }
  };

  const getModuleTime = () => {
    if (currentSection === "reading") {
      return 32 * 60; // 32 minutes
    } else {
      return 35 * 60; // 35 minutes
    }
  };

  // Initialize module answers arrays
  useEffect(() => {
    const questionsPerModule = getModuleQuestions();
    if (module1Answers.length === 0) {
      setModule1Answers(new Array(questionsPerModule).fill(null));
    }
    if (module2Answers.length === 0) {
      setModule2Answers(new Array(questionsPerModule).fill(null));
    }
  }, [currentSection, settings.mode]);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0 || isCompleted) {
      handleModuleComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(time => time - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isCompleted]);

  // Break timer effect
  useEffect(() => {
    if (!showBreak || breakTimeLeft <= 0) return;

    const timer = setInterval(() => {
      setBreakTimeLeft(time => {
        if (time <= 1) {
          setShowBreak(false);
          startNextSection();
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showBreak, breakTimeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < getModuleQuestions() - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
    }
  };

  const handleFlag = () => {
    const newFlagged = new Set(flagged);
    if (flagged.has(currentQuestion)) {
      newFlagged.delete(currentQuestion);
    } else {
      newFlagged.add(currentQuestion);
    }
    setFlagged(newFlagged);
  };

  const handleModuleComplete = () => {
    // Check if user wants to review before submitting
    const unanswered = answers.filter(a => a === null).length;
    const flaggedCount = flagged.size;
    
    if (unanswered > 0 || flaggedCount > 0) {
      setShowReview(true);
      return;
    }
    
    proceedToNextModule();
  };

  const proceedToNextModule = () => {
    if (currentModule === 1) {
      // Save Module 1 answers
      setModule1Answers([...answers]);
      
      // Calculate Module 1 score for adaptive testing
      const correctAnswers = answers.filter((answer, index) => {
        const q = sampleQuestions[index % sampleQuestions.length];
        return answer === q.correctAnswer;
      }).length;
      
      setModule1Score(correctAnswers);
      
      // Determine if Module 2 should be harder based on thresholds
      const threshold = currentSection === "reading" ? 19 : 15; // R&W: 19/27, Math: 15/22
      setShouldUseHardModule2(correctAnswers >= threshold);
      
      // Start Module 2
      setCurrentModule(2);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      // Initialize Module 2 answers if empty
      if (module2Answers.length === 0) {
        setModule2Answers(new Array(getModuleQuestions()).fill(null));
      }
      setTimeLeft(getModuleTime());
    } else if (currentModule === 2) {
      // Save Module 2 answers
      setModule2Answers([...answers]);
      
      if (currentSection === "reading" && (settings.mode === "full-test" || settings.mode === "full-reading")) {
        if (settings.mode === "full-test") {
          // Show break option
          setShowBreak(true);
          setBreakTimeLeft(10 * 60);
        } else {
          setIsCompleted(true);
        }
      } else {
        setIsCompleted(true);
      }
    }
  };

  const startNextSection = () => {
    setCurrentSection("math");
    setCurrentModule(1);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setTimeLeft(35 * 60); // Math modules are 35 minutes
    // Reset module-specific states for new section
    setModule1Answers(new Array(22).fill(null)); // Math has 22 questions
    setModule2Answers([]);
    setModule1Flagged(new Set());
    setModule2Flagged(new Set());
    setModule1Score(null);
    setShouldUseHardModule2(false);
  };

  const handleSkipBreak = () => {
    setShowBreak(false);
    startNextSection();
  };

  const handleSaveAndExit = () => {
    const currentState = {
      currentModule,
      currentQuestion,
      answers,
      flagged: Array.from(flagged),
      timeLeft,
      currentSection,
      settings
    };
    
    // Save to localStorage
    localStorage.setItem('savedTestState', JSON.stringify(currentState));
    navigate('/dashboard');
  };

  const handleResumeTest = () => {
    const saved = localStorage.getItem('savedTestState');
    if (saved) {
      const state = JSON.parse(saved);
      setCurrentModule(state.currentModule);
      setCurrentQuestion(state.currentQuestion);
      setAnswers(state.answers);
      setFlagged(new Set(state.flagged));
      setTimeLeft(state.timeLeft);
      setCurrentSection(state.currentSection);
      localStorage.removeItem('savedTestState');
    }
  };

  const currentQ = sampleQuestions[currentQuestion % sampleQuestions.length];
  const progress = ((currentQuestion + 1) / getModuleQuestions()) * 100;
  const answeredCount = answers.filter(a => a !== null).length;

  // Question Review Pop-up
  const QuestionReviewModal = () => {
    const unansweredQuestions = answers.map((a, i) => a === null ? i : null).filter(q => q !== null) as number[];
    const flaggedQuestions = Array.from(flagged);
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden bg-gradient-card shadow-glow">
          <CardHeader className="text-center border-b">
            <CardTitle className="text-xl">Question Review</CardTitle>
            <p className="text-sm text-muted-foreground">Click any question to jump to it</p>
          </CardHeader>
          <CardContent className="p-6 overflow-y-auto">
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3">
              {Array.from({ length: getModuleQuestions() }, (_, index) => {
                const isAnswered = answers[index] !== null;
                const isFlagged = flagged.has(index);
                const isCurrent = index === currentQuestion;
                
                return (
                  <Button
                    key={index}
                    variant={isCurrent ? "default" : isAnswered ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => {
                      setCurrentQuestion(index);
                      setSelectedAnswer(answers[index]);
                      setShowQuestionReview(false);
                    }}
                    className={`
                      relative h-12 w-12 p-0 rounded-lg
                      ${!isAnswered ? 'border-destructive text-destructive' : ''}
                      ${isCurrent ? 'ring-2 ring-primary' : ''}
                    `}
                  >
                    <span className="text-xs font-medium">{index + 1}</span>
                    {isFlagged && (
                      <Flag className="absolute -top-1 -right-1 h-3 w-3 text-orange-500" />
                    )}
                    {isAnswered && !isCurrent && (
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                    )}
                  </Button>
                );
              })}
            </div>
            
            {/* Filter sections */}
            <div className="mt-6 space-y-4">
              {unansweredQuestions.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-destructive">
                    ❌ Unanswered Questions ({unansweredQuestions.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {unansweredQuestions.map(qIndex => (
                      <Button
                        key={qIndex}
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setCurrentQuestion(qIndex);
                          setSelectedAnswer(answers[qIndex]);
                          setShowQuestionReview(false);
                        }}
                        className="text-xs"
                      >
                        Q{qIndex + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {flaggedQuestions.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-orange-600">
                    🚩 Flagged for Review ({flaggedQuestions.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {flaggedQuestions.map(qIndex => (
                      <Button
                        key={qIndex}
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setCurrentQuestion(qIndex);
                          setSelectedAnswer(answers[qIndex]);
                          setShowQuestionReview(false);
                        }}
                        className="text-xs"
                      >
                        <Flag className="h-3 w-3 mr-1" />
                        Q{qIndex + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <div className="border-t p-4">
            <Button 
              variant="outline" 
              onClick={() => setShowQuestionReview(false)}
              className="w-full"
            >
              Close Review
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  // Review Modal
  if (showReview) {
    const unanswered = answers.map((a, i) => a === null ? i + 1 : null).filter(Boolean);
    const flaggedQuestions = Array.from(flagged).map(i => i + 1);

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-gradient-card shadow-glow">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Review Before Submit</CardTitle>
            <p className="text-muted-foreground">Check your answers before moving on</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {unanswered.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium">Unanswered Questions ({unanswered.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {unanswered.map(qNum => (
                    <Button
                      key={qNum}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentQuestion(qNum - 1);
                        setSelectedAnswer(answers[qNum - 1]);
                        setShowReview(false);
                      }}
                      className="rounded-lg"
                    >
                      Q{qNum}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {flaggedQuestions.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium">Flagged Questions ({flaggedQuestions.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {flaggedQuestions.map(qNum => (
                    <Button
                      key={qNum}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentQuestion(qNum - 1);
                        setSelectedAnswer(answers[qNum - 1]);
                        setShowReview(false);
                      }}
                      className="rounded-lg"
                    >
                      <Flag className="h-3 w-3 mr-1" />
                      Q{qNum}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                onClick={() => setShowReview(false)}
                className="rounded-xl"
              >
                Continue Working
              </Button>
              <Button 
                variant="default" 
                onClick={() => {
                  setShowReview(false);
                  proceedToNextModule();
                }}
                className="rounded-xl bg-gradient-primary shadow-glow"
              >
                Submit Module
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showBreak) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gradient-card shadow-glow">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Break Time</CardTitle>
            <p className="text-muted-foreground">Take a well-deserved break before Math</p>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="text-4xl font-bold text-primary">{formatTime(breakTimeLeft)}</div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Your break will automatically end when the timer reaches 0.
              </p>
              <Button onClick={handleSkipBreak} variant="outline" className="rounded-xl">
                Skip Break & Continue to Math
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCompleted) {
    // Calculate combined scores from both modules
    const calculateCombinedScore = () => {
      if (settings.mode === "full-test") {
        // Full test: calculate both sections
        const readingModule1Correct = module1Answers.slice(0, 27).filter((answer, index) => {
          const q = sampleQuestions[index % sampleQuestions.length];
          return answer === q.correctAnswer;
        }).length;
        
        const readingModule2Correct = module2Answers.slice(0, 27).filter((answer, index) => {
          const q = sampleQuestions[index % sampleQuestions.length];
          return answer === q.correctAnswer;
        }).length;
        
        const mathModule1Correct = module1Answers.slice(0, 22).filter((answer, index) => {
          const q = sampleQuestions[index % sampleQuestions.length];
          return answer === q.correctAnswer;
        }).length;
        
        const mathModule2Correct = module2Answers.slice(0, 22).filter((answer, index) => {
          const q = sampleQuestions[index % sampleQuestions.length];
          return answer === q.correctAnswer;
        }).length;
        
        return {
          readingRawScore: readingModule1Correct + readingModule2Correct,
          mathRawScore: mathModule1Correct + mathModule2Correct,
          readingModule1: readingModule1Correct,
          readingModule2: readingModule2Correct,
          mathModule1: mathModule1Correct,
          mathModule2: mathModule2Correct,
          totalQuestions: 54 + 44, // 27+27 R&W, 22+22 Math
          totalCorrect: readingModule1Correct + readingModule2Correct + mathModule1Correct + mathModule2Correct
        };
      } else {
        // Single section test
        const module1Correct = module1Answers.filter((answer, index) => {
          const q = sampleQuestions[index % sampleQuestions.length];
          return answer === q.correctAnswer;
        }).length;
        
        const module2Correct = module2Answers.filter((answer, index) => {
          const q = sampleQuestions[index % sampleQuestions.length];
          return answer === q.correctAnswer;
        }).length;
        
        const totalCorrect = module1Correct + module2Correct;
        const totalQuestions = getModuleQuestions() * 2;
        
        return {
          rawScore: totalCorrect,
          module1Score: module1Correct,
          module2Score: module2Correct,
          totalQuestions,
          totalCorrect,
          accuracy: (totalCorrect / totalQuestions) * 100
        };
      }
    };
    
    const scores = calculateCombinedScore();
    
    // Calculate authentic SAT scores using the official formulas
    const calculateSATScore = (rawScore: number, isHardModule2: boolean, sectionType: "reading" | "math") => {
      // Max raw scores: 54 for R&W, 44 for Math
      const maxRaw = sectionType === "reading" ? 54 : 44;
      
      // Step 1: Raw to Scaled (200-800)
      const baseScaled = 200 + (rawScore / maxRaw) * 600;
      
      // Step 2: Apply ceiling or penalty method based on module difficulty
      let finalScore: number;
      
      if (!isHardModule2) {
        // Easy Module 2: Use penalty method (subtract 130 points)
        finalScore = baseScaled - 130;
        // Cap at minimum 200
        finalScore = Math.max(200, finalScore);
      } else {
        // Hard Module 2: Use ceiling method (no penalty)
        finalScore = Math.min(baseScaled, 800); // Cap at 800
      }
      
      return Math.round(finalScore);
    };
    
    // Calculate scores based on test mode
    if (settings.mode === "full-test") {
      const readingScore = calculateSATScore(scores.readingRawScore, shouldUseHardModule2, "reading");
      const mathScore = calculateSATScore(scores.mathRawScore, shouldUseHardModule2, "math");
      const totalScore = readingScore + mathScore;
      const overallAccuracy = Math.round((scores.totalCorrect / scores.totalQuestions) * 100);
      
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl bg-gradient-card shadow-glow">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Full Test Complete!</CardTitle>
              <p className="text-muted-foreground">Your SAT practice test results</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-primary">{totalScore}</div>
                  <div className="text-sm text-muted-foreground">Total SAT Score (/1600)</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600">{readingScore}</div>
                  <div className="text-sm text-muted-foreground">Reading & Writing (/800)</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">{mathScore}</div>
                  <div className="text-sm text-muted-foreground">Math (/800)</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium text-blue-600">Reading & Writing Performance</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Module 1:</span>
                      <span className="font-medium">{scores.readingModule1}/27</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Module 2:</span>
                      <span className="font-medium">{scores.readingModule2}/27 ({shouldUseHardModule2 ? 'Hard' : 'Easy'})</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>Total:</span>
                      <span className="font-medium">{scores.readingRawScore}/54</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accuracy:</span>
                      <span className="font-medium">{Math.round((scores.readingRawScore / 54) * 100)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium text-green-600">Math Performance</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Module 1:</span>
                      <span className="font-medium">{scores.mathModule1}/22</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Module 2:</span>
                      <span className="font-medium">{scores.mathModule2}/22 ({shouldUseHardModule2 ? 'Hard' : 'Easy'})</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>Total:</span>
                      <span className="font-medium">{scores.mathRawScore}/44</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accuracy:</span>
                      <span className="font-medium">{Math.round((scores.mathRawScore / 44) * 100)}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-lg font-medium">Overall Test Accuracy: {overallAccuracy}%</div>
                <div className="text-sm text-muted-foreground">
                  {scores.totalCorrect} correct out of {scores.totalQuestions} total questions
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/practice')}
                  className="rounded-xl"
                >
                  More Practice
                </Button>
                <Button 
                  variant="default" 
                  onClick={() => navigate('/diagnostics', { 
                    state: { 
                      questions: sampleQuestions.map((q, index) => ({
                        ...q,
                        userAnswer: answers[index] || null
                      }))
                    }
                  })}
                  className="rounded-xl bg-gradient-primary shadow-glow"
                >
                  View Detailed Diagnostic
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    } else {
      // Single section test
      const sectionScore = calculateSATScore(scores.rawScore, shouldUseHardModule2, currentSection);
      
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-gradient-card shadow-glow">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Test Complete!</CardTitle>
              <p className="text-muted-foreground">
                {currentSection === "reading" ? "Reading & Writing" : "Math"} Section Results
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">{scores.accuracy.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Overall Accuracy</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">{scores.totalCorrect}/{scores.totalQuestions}</div>
                  <div className="text-sm text-muted-foreground">Questions Correct</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">{sectionScore}/800</div>
                  <div className="text-sm text-muted-foreground">SAT Score</div>
                </div>
              </div>
              
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium">Performance Breakdown</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Module 1:</span>
                    <span className="font-medium ml-2">{scores.module1Score}/{getModuleQuestions()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Module 2:</span>
                    <span className="font-medium ml-2">{scores.module2Score}/{getModuleQuestions()} ({shouldUseHardModule2 ? 'Hard' : 'Easy'})</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/practice')}
                  className="rounded-xl"
                >
                  More Practice
                </Button>
                <Button 
                  variant="default" 
                  onClick={() => navigate('/diagnostics', { 
                    state: { 
                      questions: sampleQuestions.map((q, index) => ({
                        ...q,
                        userAnswer: answers[index] || null
                      }))
                    }
                  })}
                  className="rounded-xl bg-gradient-primary shadow-glow"
                >
                  View Diagnostic
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header streak={5} totalScore={1250} currentXP={250} level={3} />
      
      {/* Header with section info */}
      <div className="bg-gradient-primary text-white shadow-glow">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">
                {currentSection === "reading" ? "Reading and Writing" : "Math"}: Module {currentModule}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-slate-300">TIME REMAINING</p>
                <div className="bg-white text-slate-900 px-3 py-1 rounded-full font-mono text-sm">
                  {formatTime(timeLeft)}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Pause className="h-3 w-3 mr-1" />
                  PAUSE SECTION
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={handleModuleComplete}
                >
                  <Square className="h-3 w-3 mr-1" />
                  END MODULE
                </Button>
              </div>
            </div>
          </div>
          
          {/* Math Tools (only for Math sections) */}
          {currentSection === 'math' && (
            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://www.desmos.com/testing/cb-sat-ap/graphing', '_blank')}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculator
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://testinnovators.com/sat/web-app/images/SATShapeResources.pdf', '_blank')}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <FileText className="h-4 w-4 mr-2" />
                Reference
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Question Navigation Bar */}
      <div className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Question Navigation</span>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full border-2 border-muted-foreground"></div>
                <span>Unanswered</span>
              </div>
              <div className="flex items-center gap-1">
                <Flag className="w-3 h-3 text-orange-500" />
                <span>Flagged</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: getModuleQuestions() }, (_, index) => {
              const isAnswered = answers[index] !== null;
              const isFlagged = flagged.has(index);
              const isCurrent = currentQuestion === index;
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentQuestion(index);
                    setSelectedAnswer(answers[index]);
                  }}
                  className={`
                    relative w-8 h-8 rounded-md text-xs font-medium transition-all duration-200
                    ${isCurrent 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : isAnswered 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border'
                    }
                  `}
                >
                  {index + 1}
                  {isFlagged && (
                    <Flag className="absolute -top-0.5 -right-0.5 w-3 h-3 text-orange-500 fill-orange-500 drop-shadow-sm" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-card border-b px-6 py-2">
        <div className="container mx-auto">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Question Content */}
          <Card className="bg-gradient-card shadow-glow">
            <CardContent className="p-6">
              <div className="space-y-6">
                {currentQ.passage && (
                  <div className="space-y-3">
                    <h3 className="font-medium text-muted-foreground flex items-center gap-2">
                      Passage
                      {currentSection === "reading" && (
                        <span className="text-xs text-muted-foreground">(Click to highlight text)</span>
                      )}
                    </h3>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p 
                        className="leading-relaxed select-text cursor-text"
                        onMouseUp={() => {
                          if (currentSection === "reading") {
                            const selection = window.getSelection();
                            const selectedText = selection?.toString();
                            if (selectedText && selectedText.trim()) {
                              const newHighlighted = new Set(highlightedText);
                              newHighlighted.add(selectedText);
                              setHighlightedText(newHighlighted);
                            }
                          }
                        }}
                      >
                        {currentQ.passage}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">{currentQ.question}</h2>
                  
                  <div className="space-y-3">
                    {currentQ.choices.map((choice, index) => {
                      const choiceKey = `${currentQuestion}-${index}`;
                      const isEliminated = eliminatedChoices.has(choiceKey);
                      
                      return (
                        <div key={index} className="flex items-center gap-3">
                          {/* Elimination X button */}
                          <button
                            onClick={() => {
                              const newEliminated = new Set(eliminatedChoices);
                              if (isEliminated) {
                                newEliminated.delete(choiceKey);
                              } else {
                                newEliminated.add(choiceKey);
                                if (selectedAnswer === index) {
                                  setSelectedAnswer(null);
                                  const newAnswers = [...answers];
                                  newAnswers[currentQuestion] = null;
                                  setAnswers(newAnswers);
                                }
                              }
                              setEliminatedChoices(newEliminated);
                            }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                              isEliminated 
                                ? 'bg-destructive text-destructive-foreground border-destructive' 
                                : 'bg-muted hover:bg-destructive/10 border-border hover:border-destructive'
                            }`}
                            title={isEliminated ? "Restore option" : "Eliminate option"}
                          >
                            <span className="text-sm font-bold">×</span>
                          </button>
                          
                          <button
                            onClick={() => !isEliminated && handleAnswerSelect(index)}
                            disabled={isEliminated}
                            className={`flex-1 p-4 text-left rounded-lg border transition-all ${
                              selectedAnswer === index && !isEliminated
                                ? 'border-primary bg-primary/10 shadow-glow'
                                : isEliminated
                                ? 'border-border bg-muted/30 opacity-50 line-through'
                                : 'border-border hover:border-primary/50 hover:bg-muted/50'
                            }`}
                          >
                            <span className="font-medium mr-3">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            {choice}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="rounded-xl"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={handleFlag}
                className={`rounded-xl ${flagged.has(currentQuestion) ? 'text-warning' : ''}`}
              >
                <Flag className="h-4 w-4 mr-2" />
                {flagged.has(currentQuestion) ? 'Unflag' : 'Flag'}
              </Button>
              
              {currentQuestion === getModuleQuestions() - 1 ? (
                <Button
                  onClick={handleModuleComplete}
                  className="rounded-xl bg-gradient-primary shadow-glow"
                >
                  {currentModule === 1 ? "Complete Module 1" : "Submit Test"}
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={handleNext}
                  className="rounded-xl"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Question Review Pop-up */}
      {showQuestionReview && <QuestionReviewModal />}
      
      {/* Math Calculator */}
      {showCalculator && currentSection === "math" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-gradient-card shadow-glow">
            <CardHeader className="text-center border-b">
              <CardTitle>Desmos Graphing Calculator</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Calculator className="h-12 w-12 mx-auto mb-2" />
                  <p>Graphing Calculator Interface</p>
                  <p className="text-xs">Real Desmos integration would go here</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowCalculator(false)}
                className="w-full mt-4"
              >
                Close Calculator
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Math Reference Sheet */}
      {showReferenceSheet && currentSection === "math" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl bg-gradient-card shadow-glow max-h-[80vh] overflow-hidden">
            <CardHeader className="text-center border-b">
              <CardTitle>Math Reference Sheet</CardTitle>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium">Area and Volume</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>Circle: A = πr²</div>
                    <div>Rectangle: A = lw</div>
                    <div>Triangle: A = ½bh</div>
                    <div>Cylinder: V = πr²h</div>
                    <div>Sphere: V = ⁴⁄₃πr³</div>
                    <div>Cone: V = ⁄₃πr²h</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">Pythagorean Theorem</h3>
                  <div className="text-sm">a² + b² = c²</div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">Special Right Triangles</h3>
                  <div className="text-sm space-y-1">
                    <div>30°-60°-90°: sides in ratio 1 : √3 : 2</div>
                    <div>45°-45°-90°: sides in ratio 1 : 1 : √2</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">Quadratic Formula</h3>
                  <div className="text-sm">x = (-b ± √(b² - 4ac)) / 2a</div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setShowReferenceSheet(false)}
                className="w-full mt-6"
              >
                Close Reference Sheet
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}