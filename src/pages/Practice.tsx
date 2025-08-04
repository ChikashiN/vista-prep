import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { DiagnosticReport } from "@/components/DiagnosticReport";
import { AITutorChat } from "@/components/AITutorChat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Timer, Flag, ChevronLeft, ChevronRight, RotateCcw, MessageCircle, Calculator, FileText } from "lucide-react";
import { useTestData } from "@/hooks/useTestData";

interface Question {
  id: number;
  passage?: string;
  question: string;
  choices: string[];
  correctAnswer: number;
  domain: string;
  difficulty: string;
}

// Sample questions for demo
const sampleQuestions: Question[] = [
  {
    id: 1,
    passage: "The Renaissance period marked a significant shift in European art and culture. Artists began to focus more on realistic portrayals of human figures and natural landscapes, moving away from the stylized representations common in medieval art.",
    question: "Based on the passage, the Renaissance period was characterized by:",
    choices: [
      "A continuation of medieval artistic traditions",
      "A shift toward more realistic artistic representations", 
      "A focus solely on religious themes",
      "A decline in artistic innovation"
    ],
    correctAnswer: 1,
    domain: "information-ideas",
    difficulty: "Medium"
  },
  {
    id: 2,
    question: "Which choice completes the text with the most logical and precise word or phrase?",
    passage: "The scientist's research was so _______ that it challenged fundamental assumptions about climate change that had been accepted for decades.",
    choices: [
      "mundane",
      "groundbreaking",
      "superficial", 
      "conventional"
    ],
    correctAnswer: 1,
    domain: "craft-structure",
    difficulty: "Easy"
  }
];

// Helper function to get domain title for all sections
const getDomainTitle = (domain: string, section: string): string => {
  if (section === 'math') {
    const mathDomainMap: { [key: string]: string } = {
      'algebra': 'Algebra',
      'advanced-math': 'Advanced Math',
      'problem-solving': 'Problem-Solving and Data Analysis',
      'geometry': 'Geometry and Trigonometry'
    };
    return mathDomainMap[domain] || 'Algebra';
  } else {
    const readingDomainMap: { [key: string]: string } = {
      'information-ideas': 'Information and Ideas',
      'craft-structure': 'Craft and Structure',
      'expression-ideas': 'Expression of Ideas',
      'standard-conventions': 'Standard English Conventions'
    };
    return readingDomainMap[domain] || 'Information and Ideas';
  }
};

export default function Practice() {
  const { section } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addTestResult } = useTestData();
  
  const settings = location.state || {};
  const isRedoMode = settings.redoQuestions && settings.redoQuestions.length > 0;
  const questionsToUse = isRedoMode ? settings.redoQuestions : sampleQuestions;
  const questionCount = isRedoMode ? settings.redoQuestions.length : (settings.questionCount || 10);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeElapsed, setTimeElapsed] = useState(0); // Count up from 0 for sectional practice
  const [isCompleted, setIsCompleted] = useState(false);
  const [showAITutor, setShowAITutor] = useState(false);

  // Initialize answers array
  useEffect(() => {
    setAnswers(new Array(questionCount).fill(null));
  }, [questionCount]);

  // Timer effect - count up for sectional practice
  useEffect(() => {
    if (isCompleted) return;

    const timer = setInterval(() => {
      setTimeElapsed(time => time + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isCompleted]);

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
    if (currentQuestion < questionCount - 1) {
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

  const handleSubmit = () => {
    // Calculate score
    const correctAnswers = answers.filter((answer, index) => {
      const q = questionsToUse[index % questionsToUse.length];
      return answer === q.correctAnswer;
    }).length;

    // Add test result to tracking data
    addTestResult({
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
      type: 'sectional',
      section: section === 'math' ? 'math' : 'reading',
      domain: settings.domains?.[0] || (section === 'math' ? 'algebra' : 'information-ideas'),
      totalQuestions: questionCount,
      correctAnswers,
      timeSpent: timeElapsed
    });

    setIsCompleted(true);
  };

  const currentQ = questionsToUse[currentQuestion % questionsToUse.length];
  const progress = ((currentQuestion + 1) / questionCount) * 100;
  const answeredCount = answers.filter(a => a !== null).length;

  if (isCompleted) {
    const score = answers.filter((answer, index) => {
      const q = questionsToUse[index % questionsToUse.length];
      return answer === q.correctAnswer;
    }).length;
    const percentage = Math.round((score / questionCount) * 100);

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-gradient-card shadow-glow">
          <CardHeader className="text-center">
            <div className="rounded-2xl bg-gradient-primary p-4 w-16 h-16 mx-auto mb-4">
              <RotateCcw className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Practice Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="space-y-4">
              <div className="text-4xl font-bold text-primary">{percentage}%</div>
              <div className="text-muted-foreground">
                {score} out of {questionCount} correct
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="rounded-xl"
                onClick={() => {
                  // Handle retry incorrect questions
                  const incorrectQuestions = answers.map((answer, index) => {
                    const q = questionsToUse[index % questionsToUse.length];
                    return answer !== q.correctAnswer ? q : null;
                  }).filter(q => q !== null);
                  
                  if (incorrectQuestions.length > 0) {
                    navigate(`/practice/${section}`, {
                      state: {
                        ...settings,
                        redoQuestions: incorrectQuestions,
                        questionCount: incorrectQuestions.length
                      }
                    });
                  }
                }}
              >
                🔁 Retry Incorrect
              </Button>
              <Button 
                variant="outline" 
                className="rounded-xl"
                onClick={() => {
                  // Navigate to diagnostics view with sample data
                  const diagnosticQuestions = answers.map((answer, index) => {
                    const q = questionsToUse[index % questionsToUse.length];
                    return {
                      ...q,
                      userAnswer: answer,
                      explanation: "This is a sample explanation. The correct answer demonstrates the concept being tested in this question type."
                    };
                  });
                  navigate('/diagnostics', { state: { questions: diagnosticQuestions } });
                }}
              >
                📈 View Diagnostics
              </Button>
              <Button 
                variant="default" 
                className="rounded-xl"
                onClick={() => navigate('/practice')}
              >
                ➕ More Practice
              </Button>
            </div>

            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="w-full rounded-xl"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header streak={5} totalScore={1250} currentXP={250} level={3} />
      
      {/* Header with section info - matching Full Test layout */}
      <div className="bg-gradient-primary text-white shadow-glow">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">
                Sectional Practice: {getDomainTitle(settings.domains?.[0] || (section === 'math' ? 'algebra' : 'information-ideas'), section || 'math')}
              </h1>
            </div>
            {settings.timedMode && (
              <div className="text-right">
                <p className="text-xs text-slate-300">TIME ELAPSED</p>
                <div className="bg-white text-slate-900 px-3 py-1 rounded-full font-mono text-sm">
                  {formatTime(timeElapsed)}
                </div>
              </div>
            )}
          </div>
          
          {/* Math Tools (only for Math sections) - matching Full Test position */}
          {section === 'math' && (
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

      {/* Question Navigation Bar - matching Full Test layout */}
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
            {Array.from({ length: questionCount }, (_, index) => {
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

      {/* Progress Bar - matching Full Test layout */}
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-6">
          <Progress value={progress} className="h-1" />
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                    
                    {/* AI Tutor Button - only for sectional practice */}
                    {settings.mode === 'sectional' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowAITutor(true)}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    )}
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

              {currentQuestion === questionCount - 1 ? (
                <Button
                  onClick={handleSubmit}
                  className="rounded-xl bg-gradient-primary shadow-glow"
                >
                  Submit Practice
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
        
        {/* AI Tutor Chat */}
        {showAITutor && (
          <AITutorChat 
            currentQuestion={currentQ.question}
            currentChoices={currentQ.choices}
            onClose={() => setShowAITutor(false)}
          />
        )}
      </div>
    </div>
  );
}