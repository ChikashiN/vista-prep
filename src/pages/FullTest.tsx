import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Timer, Flag, ChevronLeft, ChevronRight, Calculator, BookOpen, Save, Eye, PauseCircle, Menu } from "lucide-react";

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
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(32 * 60); // 32 minutes in seconds
  const [showBreak, setShowBreak] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(10 * 60); // 10 minutes
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentSection, setCurrentSection] = useState<"reading" | "math">("reading");
  const [showReview, setShowReview] = useState(false);
  const [savedState, setSavedState] = useState<any>(null);
  const [showFlaggedPanel, setShowFlaggedPanel] = useState(false);
  const [showQuestionReview, setShowQuestionReview] = useState(false);
  const [module1Score, setModule1Score] = useState<number | null>(null);
  const [shouldUseHardModule2, setShouldUseHardModule2] = useState(false);

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

  // Initialize answers array
  useEffect(() => {
    setAnswers(new Array(getModuleQuestions()).fill(null));
  }, [currentModule, currentSection, settings.mode]);

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
      setAnswers(new Array(getModuleQuestions()).fill(null));
      setFlagged(new Set());
      setTimeLeft(getModuleTime());
    } else if (currentSection === "reading" && (settings.mode === "full-test" || settings.mode === "full-reading")) {
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
  };

  const startNextSection = () => {
    setCurrentSection("math");
    setCurrentModule(1);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers(new Array(22).fill(null)); // Math has 22 questions
    setFlagged(new Set());
    setTimeLeft(35 * 60); // Math modules are 35 minutes
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
    const score = answers.filter((answer, index) => {
      const q = sampleQuestions[index % sampleQuestions.length];
      return answer === q.correctAnswer;
    }).length;
    
    // Calculate authentic SAT scores using the official formulas
    const calculateSATScore = (rawScore: number, isEasyModule: boolean, sectionType: "reading" | "math") => {
      // Max raw scores: 54 for R&W, 44 for Math
      const maxRaw = sectionType === "reading" ? 54 : 44;
      const moduleIndicator = isEasyModule ? 1 : 0; // Ie = 1 if easy module, 0 if hard
      
      // Step 1: Raw to Scaled (200-800)
      const baseScaled = 200 + (rawScore / maxRaw) * 600;
      
      // Step 2: Apply ceiling or penalty method based on module difficulty
      let finalScore: number;
      
      if (isEasyModule) {
        // Penalty method: F = S - 130 × Ie (so easy gets -130 penalty)
        finalScore = baseScaled - 130;
        // Cap at minimum 200
        finalScore = Math.max(200, finalScore);
      } else {
        // Hard module: no penalty, but apply ceiling at 670 if needed
        finalScore = Math.min(baseScaled, 670);
      }
      
      return Math.round(finalScore);
    };
    
    const rawScore = score;
    const totalQuestions = getModuleQuestions();
    const isEasyModule = !shouldUseHardModule2; // If didn't advance to hard module 2
    const scaledScore = calculateSATScore(rawScore, isEasyModule, currentSection);
    const totalSATScore = currentSection === "reading" ? scaledScore + 400 : 800 + scaledScore; // Simulate total

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl bg-gradient-card shadow-glow">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Test Complete!</CardTitle>
            <p className="text-muted-foreground">
              {settings.mode === "full-test" ? "Full SAT Practice Test" : 
               settings.mode === "full-reading" ? "Reading & Writing Section" : "Math Section"}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">{scaledScore}</div>
                <div className="text-sm text-muted-foreground">Section Score</div>
                <div className="text-xs text-muted-foreground">out of 800</div>
              </div>
              
              {settings.mode === "full-test" && (
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">{totalSATScore}</div>
                  <div className="text-sm text-muted-foreground">Total Score</div>
                  <div className="text-xs text-muted-foreground">out of 1600</div>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="text-2xl font-bold">{Math.round((rawScore / totalQuestions) * 100)}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
                <div className="text-xs text-muted-foreground">{rawScore}/{totalQuestions} correct</div>
              </div>
            </div>

            {module1Score && (
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Module Performance</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="text-lg font-bold">Module 1</div>
                    <div className="text-sm text-muted-foreground">{module1Score}/{getModuleQuestions()} correct</div>
                    <Badge variant={shouldUseHardModule2 ? "default" : "secondary"}>
                      {shouldUseHardModule2 ? "Advanced to Hard Module 2" : "Standard Module 2"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="text-lg font-bold">Module 2</div>
                    <div className="text-sm text-muted-foreground">{rawScore - (module1Score || 0)}/{getModuleQuestions()} correct</div>
                    <Badge variant="outline">
                      {shouldUseHardModule2 ? "Hard Difficulty" : "Standard Difficulty"}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="rounded-xl" onClick={() => navigate('/dashboard')}>
                🏠 Return to Dashboard
              </Button>
              <Button 
                variant="default" 
                className="rounded-xl"
                onClick={() => navigate('/diagnostics', { 
                  state: { 
                    questions: sampleQuestions.slice(0, totalQuestions).map((q, i) => ({
                      ...q,
                      userAnswer: answers[i],
                      explanation: `This is a sample explanation for ${q.domain} question about ${q.question.substring(0, 30)}...`
                    })),
                    totalScore: scaledScore,
                    sectionType: currentSection
                  }
                })}
              >
                📈 View Full Diagnostics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {showQuestionReview && <QuestionReviewModal />}
      <Header streak={5} totalScore={1250} currentXP={250} level={3} />
      
      {/* Header with progress and timer */}
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              {currentSection === "reading" ? <BookOpen className="h-4 w-4" /> : <Calculator className="h-4 w-4" />}
              {currentSection === "reading" ? "Reading & Writing" : "Math"} - Module {currentModule}
            </div>
            <div className="flex items-center gap-4">
              {flagged.size > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFlaggedPanel(!showFlaggedPanel)}
                  className="text-xs"
                >
                  <Flag className="h-3 w-3 mr-1" />
                  Flagged ({flagged.size})
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQuestionReview(true)}
                className="text-xs"
              >
                <Menu className="h-3 w-3 mr-1" />
                Review Questions
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveAndExit}
                className="text-xs rounded-lg"
              >
                <Save className="h-3 w-3 mr-1" />
                Save & Exit
              </Button>
              <div className="flex items-center gap-2 text-sm">
                <Timer className="h-4 w-4" />
                <span className={timeLeft < 300 ? "text-destructive font-bold" : ""}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestion + 1} of {getModuleQuestions()}
            </span>
            <span className="text-sm text-muted-foreground">
              {answeredCount} answered
            </span>
          </div>
          
          <Progress value={progress} className="h-2" />
        </div>
      </div>

          {/* Main content */}
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Flagged questions sidebar */}
          {flagged.size > 0 && showFlaggedPanel && (
            <div className="lg:col-span-1 order-first lg:order-none">
              <Card className="bg-gradient-card shadow-card sticky top-24">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Flag className="h-4 w-4 text-warning" />
                    Flagged Questions ({flagged.size})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Array.from(flagged).map(qNum => (
                      <Button
                        key={qNum}
                        variant={qNum === currentQuestion ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setCurrentQuestion(qNum);
                          setSelectedAnswer(answers[qNum]);
                        }}
                        className="w-full justify-start rounded-lg"
                      >
                        <Flag className="h-3 w-3 mr-2" />
                        Question {qNum + 1}
                        {answers[qNum] !== null && (
                          <Badge variant="secondary" className="ml-auto">
                            Answered
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

        <div className={`${flagged.size > 0 && showFlaggedPanel ? 'lg:col-span-2' : 'lg:col-span-3'} grid grid-cols-1 lg:grid-cols-2 gap-8`}>
          {/* Question and passage */}
          <div className="space-y-6">
            {currentQ.passage && (
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Passage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{currentQ.passage}</p>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {currentQ.domain}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleFlag}
                      className={`rounded-lg ${flagged.has(currentQuestion) ? 'text-warning' : ''}`}
                    >
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{currentQ.question}</p>
              </CardContent>
            </Card>
          </div>

          {/* Answer choices */}
          <div className="space-y-4">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Answer Choices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentQ.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                      selectedAnswer === index
                        ? 'border-primary bg-primary/10 shadow-soft'
                        : 'border-border hover:border-primary/50 hover:shadow-soft'
                    }`}
                  >
                    <span className="text-sm">{choice}</span>
                  </button>
                ))}
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
                {currentQuestion === getModuleQuestions() - 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setShowReview(true)}
                    className="rounded-xl"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Review
                  </Button>
                )}
                
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
        </div>
      </div>
    </div>
  );
}