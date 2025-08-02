import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { DiagnosticReport } from "@/components/DiagnosticReport";
import { AITutorChat } from "@/components/AITutorChat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Timer, Flag, ChevronLeft, ChevronRight, RotateCcw, MessageCircle } from "lucide-react";

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

export default function Practice() {
  const { section } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
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
      
      {/* Header with progress and timer */}
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {section === 'reading' ? 'Reading & Writing' : 'Math'} Practice
              </div>
              
              {/* Math section tools */}
              {section === 'math' && (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://www.desmos.com/testing/cb-sat-ap/graphing', '_blank')}
                    className="text-xs px-2 py-1 h-auto"
                  >
                    🧮 Calculator
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://testinnovators.com/sat/web-app/images/SATShapeResources.pdf', '_blank')}
                    className="text-xs px-2 py-1 h-auto"
                  >
                    📐 Reference
                  </Button>
                </div>
              )}
            </div>
            
            {settings.timedMode && (
              <div className="flex items-center gap-2 text-sm">
                <Timer className="h-4 w-4" />
                <span>
                  {formatTime(timeElapsed)}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestion + 1} of {questionCount}
            </span>
            <span className="text-sm text-muted-foreground">
              {answeredCount} answered
            </span>
          </div>
          
          {/* Question number navigation */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {Array.from({ length: questionCount }, (_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentQuestion(i);
                  setSelectedAnswer(answers[i]);
                }}
                className={`w-8 h-8 rounded-lg text-xs font-medium border-2 transition-all relative ${
                  i === currentQuestion
                    ? 'border-primary bg-primary text-primary-foreground'
                    : answers[i] !== null
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-muted-foreground/30 hover:border-primary/50'
                }`}
              >
                {i + 1}
                {flagged.has(i) && (
                  <Flag className="h-3 w-3 text-warning absolute -top-1 -right-1 fill-current" />
                )}
              </button>
            ))}
          </div>
          
          <Progress value={progress} className="h-2" />
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