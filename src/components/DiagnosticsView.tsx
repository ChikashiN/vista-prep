import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Question {
  id: number;
  question: string;
  choices: string[];
  correctAnswer: number;
  userAnswer: number | null;
  explanation: string;
  domain: string;
}

interface DiagnosticsViewProps {
  questions: Question[];
  onRetryIncorrect: () => void;
  onMorePractice: () => void;
}

export function DiagnosticsView({ questions, onRetryIncorrect, onMorePractice }: DiagnosticsViewProps) {
  const navigate = useNavigate();
  
  const correctCount = questions.filter(q => q.userAnswer === q.correctAnswer).length;
  const incorrectQuestions = questions.filter(q => q.userAnswer !== q.correctAnswer);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <Card className="bg-gradient-card shadow-glow">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Diagnostic Review</CardTitle>
            <p className="text-muted-foreground">
              Review your answers and learn from explanations
            </p>
            <div className="text-3xl font-bold text-primary mt-2">
              {correctCount}/{questions.length} Correct ({Math.round((correctCount / questions.length) * 100)}%)
            </div>
          </CardHeader>
        </Card>

        {/* Questions Review */}
        <div className="space-y-4">
          {questions.map((question, index) => {
            const isCorrect = question.userAnswer === question.correctAnswer;
            const userChoice = question.userAnswer !== null ? question.choices[question.userAnswer] : "Not answered";
            const correctChoice = question.choices[question.correctAnswer];

            return (
              <Card key={question.id} className="bg-gradient-card shadow-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-success" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                        <span className="font-medium">Question {index + 1}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {question.domain}
                      </Badge>
                    </div>
                    <Badge variant={isCorrect ? "default" : "destructive"}>
                      {isCorrect ? "Correct" : "Incorrect"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed font-medium">{question.question}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Your Answer:</h4>
                      <div className={`p-3 rounded-lg border-2 ${
                        isCorrect 
                          ? 'border-success bg-success/10' 
                          : 'border-destructive bg-destructive/10'
                      }`}>
                        <p className="text-sm">{userChoice}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Correct Answer:</h4>
                      <div className="p-3 rounded-lg border-2 border-success bg-success/10">
                        <p className="text-sm">{correctChoice}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Explanation:</h4>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm leading-relaxed">{question.explanation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="rounded-xl" 
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Home
          </Button>
          
          {incorrectQuestions.length > 0 && (
            <Button 
              variant="default" 
              className="rounded-xl" 
              onClick={onRetryIncorrect}
            >
              🔁 Retry Incorrect ({incorrectQuestions.length})
            </Button>
          )}
          
          <Button 
            variant="secondary" 
            className="rounded-xl" 
            onClick={onMorePractice}
          >
            📈 More Practice
          </Button>
        </div>
      </div>
    </div>
  );
}