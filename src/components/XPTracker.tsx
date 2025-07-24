import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Flame, Trophy } from "lucide-react";

interface XPTrackerProps {
  currentXP: number;
  streak: number;
  level: number;
  xpToNextLevel: number;
}

export function XPTracker({ currentXP, streak, level, xpToNextLevel }: XPTrackerProps) {
  const xpProgress = ((currentXP % 100) / 100) * 100; // Assuming 100 XP per level

  return (
    <div className="flex items-center gap-4">
      {/* Streak */}
      <div className="flex items-center gap-1">
        <Flame className="h-4 w-4 text-orange-500" />
        <span className="text-sm font-medium">{streak}</span>
      </div>

      {/* Level and XP */}
      <div className="flex items-center gap-2">
        <Trophy className="h-4 w-4 text-primary" />
        <Badge variant="outline" className="px-2 py-1">
          Level {level}
        </Badge>
        <div className="flex items-center gap-2 min-w-[100px]">
          <Progress value={xpProgress} className="h-2 w-16" />
          <span className="text-xs text-muted-foreground">
            {currentXP % 100}/{100}
          </span>
        </div>
      </div>

      {/* XP indicator */}
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 text-yellow-500" />
        <span className="text-sm font-medium text-primary">{currentXP} XP</span>
      </div>
    </div>
  );
}