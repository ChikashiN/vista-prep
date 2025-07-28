import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Flame, Trophy, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { XPTracker } from "./XPTracker";

interface HeaderProps {
  streak?: number;
  totalScore?: number;
  currentXP?: number;
  level?: number;
}

export function Header({ streak = 0, totalScore = 0, currentXP = 250, level = 3 }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-6">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="rounded-xl bg-white p-2 shadow-soft">
              <img 
                src="/lovable-uploads/0157cd31-b39f-4ed3-99cd-26eaa7d3d61d.png" 
                alt="Infini Prep Logo" 
                className="h-6 w-6"
              />
            </div>
            <div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Infini Prep
              </h1>
              <p className="text-xs text-muted-foreground">SAT Reading & Math</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Button 
              variant={location.pathname === '/' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => navigate('/')}
              className="rounded-lg"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button 
              variant={location.pathname === '/sectional-practice' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => navigate('/sectional-practice')}
              className="rounded-lg"
            >
              Practice
            </Button>
          </nav>
        </div>

        {/* User Stats */}
        <div className="flex items-center gap-4">
          {/* XP Tracker - hidden on mobile */}
          <div className="hidden md:block">
            <XPTracker 
              currentXP={currentXP}
              streak={streak}
              level={level}
              xpToNextLevel={100 - (currentXP % 100)}
            />
          </div>

          {/* Mobile - simple stats */}
          <div className="md:hidden flex items-center gap-2">
            <Badge variant="outline" className="px-2 py-1">
              🔥 {streak}
            </Badge>
            <Badge variant="outline" className="px-2 py-1">
              L{level}
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