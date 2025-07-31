import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Lightbulb, PenTool, Settings, Layers, Link, Target, FileText, BarChart, Brain, ArrowRight, Minus, CheckCircle } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Domain {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  questionCount: number;
}

const readingDomains: Domain[] = [
  {
    id: "information-ideas",
    name: "Information and Ideas",
    description: "Command of Evidence, Central Ideas, Details, and Inferences",
    icon: Lightbulb,
    questionCount: 7
  },
  {
    id: "craft-structure",
    name: "Craft and Structure",
    description: "Words in Context, Text Structure, and Cross-Text Connections",
    icon: BookOpen,
    questionCount: 7
  },
  {
    id: "expression-ideas",
    name: "Expression of Ideas",
    description: "Transitions and Rhetorical Synthesis",
    icon: PenTool,
    questionCount: 5
  },
  {
    id: "standard-conventions",
    name: "Standard English Conventions",
    description: "Grammar, Boundaries, Form, Structure, and Sense",
    icon: Settings,
    questionCount: 8
  }
];

const mathDomains: Domain[] = [
  {
    id: "algebra",
    name: "Algebra",
    description: "Linear equations, systems, and algebraic expressions",
    icon: PenTool,
    questionCount: 0
  },
  {
    id: "advanced-math",
    name: "Advanced Math",
    description: "Nonlinear equations, functions, and polynomial operations",
    icon: BookOpen,
    questionCount: 0
  },
  {
    id: "problem-solving-data",
    name: "Problem-Solving and Data Analysis",
    description: "Statistics, probability, and data interpretation",
    icon: Lightbulb,
    questionCount: 0
  },
  {
    id: "geometry-trigonometry",
    name: "Geometry and Trigonometry",
    description: "Area, volume, angles, and trigonometric relationships",
    icon: Settings,
    questionCount: 0
  }
];

interface DomainSelectorProps {
  selectedDomains: string[];
  onDomainsChange: (domains: string[]) => void;
  sectionType: "reading" | "math";
  questionCount?: number;
}

export function DomainSelector({ selectedDomains, onDomainsChange, sectionType, questionCount }: DomainSelectorProps) {
  const domains = sectionType === "reading" ? readingDomains : mathDomains;
  
  const handleDomainToggle = (domainId: string) => {
    if (selectedDomains.includes(domainId)) {
      onDomainsChange(selectedDomains.filter(id => id !== domainId));
    } else {
      onDomainsChange([...selectedDomains, domainId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          Choose Your {sectionType === "reading" ? "Reading & Writing" : "Math"} Focus Areas
        </h2>
        <p className="text-muted-foreground">
          Just sharpening your skills today? Pick the domains you want to practice
        </p>
        {selectedDomains.length > 0 && questionCount && (
          <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-primary font-medium">
              📊 Question Distribution: {selectedDomains.length === 1 
                ? `All ${questionCount} questions from ${domains.find(d => d.id === selectedDomains[0])?.name}`
                : selectedDomains.length === 2
                ? `${Math.floor(questionCount/2)} questions from each domain`
                : `Approximately ${Math.floor(questionCount/selectedDomains.length)}–${Math.ceil(questionCount/selectedDomains.length)} questions per domain`
              }
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {domains.map((domain) => {
          const isSelected = selectedDomains.includes(domain.id);
          const Icon = domain.icon;

          return (
            <Card
              key={domain.id}
              className={`cursor-pointer transition-all duration-200 border-2 hover:shadow-soft ${
                isSelected 
                  ? "border-primary bg-primary/5 shadow-glow" 
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => handleDomainToggle(domain.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleDomainToggle(domain.id)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <div className={`rounded-lg p-2 ${
                      isSelected ? "bg-primary/20" : "bg-muted"
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        isSelected ? "text-primary" : "text-muted-foreground"
                      }`} />
                    </div>
                  </div>
                </div>
                <CardTitle className="text-lg">{domain.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {domain.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}