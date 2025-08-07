import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Clock, Star, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useTestData } from "@/hooks/useTestData";
import { toast } from "sonner";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  section: 'math' | 'reading';
  domain: string;
}

interface DailyChallengeProps {
  isCompleted: boolean;
  onStart: () => void;
}

// Sample questions for daily challenge
const dailyQuestions: Question[] = [
  {
    id: "q1",
    question: "If 2x + 5 = 13, what is the value of x?",
    options: ["2", "4", "6", "8"],
    correctAnswer: 1,
    section: "math",
    domain: "Algebra"
  },
  {
    id: "q2", 
    question: "Which word best completes the sentence? The scientist's hypothesis was _____ by the experimental results.",
    options: ["contradicted", "supported", "ignored", "questioned"],
    correctAnswer: 1,
    section: "reading",
    domain: "Standard English Conventions"
  },
  {
    id: "q3",
    question: "What is the slope of the line passing through points (2, 3) and (6, 11)?",
    options: ["1", "2", "3", "4"],
    correctAnswer: 1,
    section: "math", 
    domain: "Algebra"
  },
  {
    id: "q4",
    question: "The author's primary purpose in this passage is to:",
    options: ["Criticize modern technology", "Explain a scientific concept", "Narrate a personal experience", "Argue for policy change"],
    correctAnswer: 1,
    section: "reading",
    domain: "Information and Ideas"
  },
  {
    id: "q5",
    question: "If f(x) = x² + 3x - 2, what is f(4)?",
    options: ["22", "26", "30", "34"],
    correctAnswer: 1,
    section: "math",
    domain: "Advanced Math"
  }
];

export function DailyChallenge({ isCompleted, onStart }: DailyChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(5).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const { addTestResult } = useTestData();

  const handleStart = () => {
    setIsActive(true);
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(5).fill(-1));
    setShowResults(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < 4) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinish = () => {
    const score = calculateScore();
    
    // Track the test result and get XP earned
    const xpEarned = addTestResult({
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
      type: 'daily',
      section: 'both',
      domain: 'Mixed Practice',
      totalQuestions: 5,
      correctAnswers: score,
      timeSpent: 300 // Estimated 5 minutes
    });

    toast.success(`Daily Challenge Complete! You scored ${score}/5 questions correctly and earned ${xpEarned} XP!`);
    
    setIsActive(false);
    setShowResults(false);
    onStart(); // This will mark as completed in parent component
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return score + (answer === dailyQuestions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  if (isActive && !showResults) {
    const question = dailyQuestions[currentQuestion];
    return (
      <Card className="bg-gradient-accent border-0 shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Daily Challenge
            </CardTitle>
            <Badge variant="outline" className="border-primary text-primary">
              {currentQuestion + 1} / 5
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm font-medium">{question.question}</p>
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-3 text-left text-sm rounded-lg border transition-colors ${
                    selectedAnswers[currentQuestion] === index
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:bg-muted'
                  }`}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between gap-2">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === -1}
              size="sm"
            >
              {currentQuestion === 4 ? 'Finish' : 'Next'}
              {currentQuestion !== 4 && <ArrowRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    const score = calculateScore();
    return (
      <Card className="bg-gradient-accent border-0 shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Challenge Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-primary">{score}/5</div>
            <p className="text-sm text-muted-foreground">
              {score === 5 ? 'Perfect score!' : score >= 3 ? 'Great job!' : 'Keep practicing!'}
            </p>
            <div className="flex items-center justify-center gap-1 text-sm text-yellow-600">
              <Star className="h-4 w-4" />
              +10 Bonus XP Earned
            </div>
          </div>
          <Button onClick={handleFinish} className="w-full">
            Collect Reward
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-accent border-0 shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Daily Challenge
          </CardTitle>
          {isCompleted ? (
            <Badge variant="default" className="bg-green-500">
              ✓ Complete
            </Badge>
          ) : (
            <Badge variant="outline" className="border-yellow-500 text-yellow-600">
              🟡 New
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Quick 5-question mixed practice set
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              5 minutes
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              +10 Bonus XP
            </div>
          </div>
        </div>
        
        {!isCompleted && (
          <Button 
            onClick={handleStart}
            className="w-full rounded-xl"
            variant="secondary"
          >
            Start Daily Challenge
          </Button>
        )}
        
        {isCompleted && (
          <p className="text-sm text-green-600 text-center font-medium">
            Great job! Come back tomorrow for a new challenge 🎉
          </p>
        )}
      </CardContent>
    </Card>
  );
}