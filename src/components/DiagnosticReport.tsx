import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Clock, Target, BookOpen } from "lucide-react";

interface DomainResult {
  domain: string;
  correct: number;
  total: number;
  percentage: number;
}

interface DiagnosticReportProps {
  overallScore: number;
  totalQuestions: number;
  domainResults: DomainResult[];
  averageTimePerQuestion: number;
  estimatedScore: number;
  recommendations: string[];
  onRetryIncorrect: () => void;
  onPracticeSimilar: () => void;
  onBackToHome: () => void;
}

export function DiagnosticReport({
  overallScore,
  totalQuestions,
  domainResults,
  averageTimePerQuestion,
  estimatedScore,
  recommendations,
  onRetryIncorrect,
  onPracticeSimilar,
  onBackToHome
}: DiagnosticReportProps) {
  const overallPercentage = Math.round((overallScore / totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <Card className="bg-gradient-card shadow-glow">
          <CardHeader className="text-center">
            <div className="rounded-2xl bg-gradient-primary p-4 w-16 h-16 mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl">Diagnostic Report</CardTitle>
            <p className="text-muted-foreground">Here's how you performed</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">{overallPercentage}%</div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
                <div className="text-xs text-muted-foreground">{overallScore}/{totalQuestions} correct</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-3xl font-bold text-secondary">{estimatedScore}</div>
                <div className="text-sm text-muted-foreground">Estimated SAT Score</div>
                <div className="text-xs text-muted-foreground">Based on performance</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-3xl font-bold text-accent">{averageTimePerQuestion}s</div>
                <div className="text-sm text-muted-foreground">Avg Time/Question</div>
                <div className="text-xs text-muted-foreground">Time management</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Domain Breakdown */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Performance by Domain
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {domainResults.map((result, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{result.domain}</span>
                  <Badge variant={result.percentage >= 70 ? "default" : "outline"}>
                    {result.correct}/{result.total}
                  </Badge>
                </div>
                <Progress value={result.percentage} className="h-2" />
                <div className="text-sm text-muted-foreground">
                  {result.percentage}% correct
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                  <Clock className="h-3 w-3 text-primary" />
                </div>
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="rounded-xl" onClick={onRetryIncorrect}>
            🔁 Retry Incorrect Questions
          </Button>
          <Button variant="default" className="rounded-xl" onClick={onPracticeSimilar}>
            📈 Practice Similar Questions
          </Button>
          <Button variant="secondary" className="rounded-xl" onClick={onBackToHome}>
            🏠 Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}