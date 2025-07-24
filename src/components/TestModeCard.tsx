import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface TestModeCardProps {
  title: string;
  description: string;
  duration: string;
  questionCount: string;
  icon: LucideIcon;
  features: string[];
  onStart: () => void;
  variant?: "primary" | "secondary" | "accent";
}

export function TestModeCard({ 
  title, 
  description, 
  duration, 
  questionCount, 
  icon: Icon, 
  features, 
  onStart,
  variant = "primary"
}: TestModeCardProps) {
  const gradientClass = {
    primary: "bg-gradient-primary",
    secondary: "bg-gradient-secondary", 
    accent: "bg-gradient-accent"
  }[variant];

  const buttonVariant = {
    primary: "default",
    secondary: "secondary",
    accent: "outline"
  }[variant];

  return (
    <Card className="group cursor-pointer bg-gradient-card border-0 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
      <CardContent className="p-8 text-center space-y-6">
        <div className={`rounded-2xl ${gradientClass} p-4 w-16 h-16 mx-auto shadow-soft group-hover:animate-bounce-gentle`}>
          <Icon className="h-8 w-8 text-primary-foreground" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="outline">{duration}</Badge>
          <Badge variant="outline">{questionCount}</Badge>
        </div>

        <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
          {features.map((feature, index) => (
            <div key={index}>✓ {feature}</div>
          ))}
        </div>

        <Button 
          className="w-full rounded-xl" 
          size="lg" 
          variant={buttonVariant as any}
          onClick={onStart}
        >
          Start {title}
        </Button>
      </CardContent>
    </Card>
  );
}