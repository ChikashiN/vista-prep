import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Flame, Trophy } from "lucide-react";

interface HeaderProps {
  streak?: number;
  totalScore?: number;
}

export function Header({ streak = 0, totalScore = 0 }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-primary p-2 shadow-soft">
            <Target className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SAT Prep Pro
            </h1>
            <p className="text-xs text-muted-foreground">Reading & Math</p>
          </div>
        </div>

        {/* User Stats */}
        <div className="flex items-center gap-4">
          {/* Streak Counter */}
          <div className="flex items-center gap-2 rounded-xl bg-gradient-card p-2 shadow-soft">
            <Flame className="h-4 w-4 text-streak-gold" />
            <span className="text-sm font-medium">{streak}</span>
            <Badge variant="outline" className="text-xs">
              Day streak
            </Badge>
          </div>

          {/* Total Score */}
          <div className="flex items-center gap-2 rounded-xl bg-gradient-card p-2 shadow-soft">
            <Trophy className="h-4 w-4 text-badge-gold" />
            <span className="text-sm font-medium">{totalScore}</span>
            <Badge variant="outline" className="text-xs">
              Total XP
            </Badge>
          </div>

          {/* Sign Up Button */}
          <Button variant="default" className="rounded-xl">
            Sign Up Free
          </Button>
        </div>
      </div>
    </header>
  );
}