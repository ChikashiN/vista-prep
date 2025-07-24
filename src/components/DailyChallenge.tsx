import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Clock, Star } from "lucide-react";

interface DailyChallengeProps {
  isCompleted: boolean;
  onStart: () => void;
}

export function DailyChallenge({ isCompleted, onStart }: DailyChallengeProps) {
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
            onClick={onStart}
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