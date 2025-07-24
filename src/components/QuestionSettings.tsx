import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Timer, Target, Shuffle } from "lucide-react";

interface QuestionSettingsProps {
  difficulty: "Easy" | "Medium" | "Hard" | "Mixed";
  questionCount: 5 | 10 | 20;
  timedMode: boolean;
  onDifficultyChange: (difficulty: "Easy" | "Medium" | "Hard" | "Mixed") => void;
  onQuestionCountChange: (count: 5 | 10 | 20) => void;
  onTimedModeChange: (timed: boolean) => void;
  onStartPractice: () => void;
  disabled?: boolean;
}

export function QuestionSettings({
  difficulty,
  questionCount,
  timedMode,
  onDifficultyChange,
  onQuestionCountChange,
  onTimedModeChange,
  onStartPractice,
  disabled = false
}: QuestionSettingsProps) {
  const difficultyOptions: Array<"Easy" | "Medium" | "Hard" | "Mixed"> = ["Easy", "Medium", "Hard", "Mixed"];
  const questionOptions: Array<5 | 10 | 20> = [5, 10, 20];

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Easy": return "bg-success/10 text-success border-success/20 hover:bg-success/20";
      case "Medium": return "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20";
      case "Hard": return "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20";
      case "Mixed": return "bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20";
      default: return "bg-muted";
    }
  };

  if (disabled) {
    return (
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <Target className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Select at least one domain to continue</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-card animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="rounded-lg bg-gradient-primary p-2">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          Question Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Difficulty Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shuffle className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Difficulty Level</Label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {difficultyOptions.map((diff) => (
              <Button
                key={diff}
                variant={difficulty === diff ? "default" : "outline"}
                size="sm"
                onClick={() => onDifficultyChange(diff)}
                className={`rounded-xl ${
                  difficulty === diff 
                    ? "bg-gradient-primary shadow-glow" 
                    : getDifficultyColor(diff)
                }`}
              >
                {diff}
              </Button>
            ))}
          </div>
        </div>

        {/* Question Count */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Number of Questions</Label>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {questionOptions.map((count) => (
              <Button
                key={count}
                variant={questionCount === count ? "default" : "outline"}
                size="sm"
                onClick={() => onQuestionCountChange(count)}
                className={`rounded-xl ${
                  questionCount === count 
                    ? "bg-gradient-primary shadow-glow" 
                    : "hover:shadow-soft"
                }`}
              >
                {count}
              </Button>
            ))}
          </div>
        </div>

        {/* Timer Toggle */}
        <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
          <div className="flex items-center gap-3">
            <Timer className="h-4 w-4 text-muted-foreground" />
            <div>
              <Label className="text-sm font-medium">Focus Mode</Label>
              <p className="text-xs text-muted-foreground">
                {timedMode ? "Timed practice with real SAT timing" : "Practice at your own pace"}
              </p>
            </div>
          </div>
          <Switch
            checked={timedMode}
            onCheckedChange={onTimedModeChange}
          />
        </div>

        {/* Start Button */}
        <Button 
          onClick={onStartPractice}
          className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-200"
          size="lg"
        >
          Start Practice
          <Badge className="ml-2 bg-primary-foreground/20">
            {questionCount} questions
          </Badge>
        </Button>
        
        <p className="text-center text-sm text-muted-foreground">
          Ready when you are! 🚀
        </p>
      </CardContent>
    </Card>
  );
}