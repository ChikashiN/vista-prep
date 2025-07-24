import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";

interface SectionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  questionsCount: number;
  timeEstimate: string;
  difficulty: "Easy" | "Medium" | "Hard";
  progress?: number;
  onClick: () => void;
}

export function SectionCard({
  title,
  description,
  icon: Icon,
  questionsCount,
  timeEstimate,
  difficulty,
  progress = 0,
  onClick
}: SectionCardProps) {
  const difficultyColors = {
    Easy: "text-success bg-success/10 border-success/20",
    Medium: "text-warning bg-warning/10 border-warning/20", 
    Hard: "text-destructive bg-destructive/10 border-destructive/20"
  };

  return (
    <Card className="group relative overflow-hidden bg-gradient-card border-0 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 cursor-pointer" onClick={onClick}>
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="rounded-xl bg-gradient-primary p-3 shadow-soft group-hover:animate-bounce-gentle">
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
          <Badge className={`${difficultyColors[difficulty]} border`}>
            {difficulty}
          </Badge>
        </div>
        <CardTitle className="mt-4 text-lg font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{questionsCount} questions</span>
          <span className="text-muted-foreground">{timeEstimate}</span>
        </div>
        
        {progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button className="w-full rounded-xl" variant="outline">
          Start Practice
        </Button>
      </CardFooter>
    </Card>
  );
}