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
    id: "craft-structure-words",
    name: "Craft & Structure: Words in Context", 
    description: "Understanding words and phrases in context",
    icon: BookOpen,
    questionCount: 5
  },
  {
    id: "craft-structure-text",
    name: "Craft & Structure: Text Structure & Purpose",
    description: "Analyzing text structure and author's purpose", 
    icon: Layers,
    questionCount: 1
  },
  {
    id: "craft-structure-connections",
    name: "Craft & Structure: Cross-Text Connections",
    description: "Making connections between paired texts",
    icon: Link,
    questionCount: 1
  },
  {
    id: "information-central",
    name: "Information & Ideas: Central Ideas & Details",
    description: "Identifying main ideas and supporting details",
    icon: Target,
    questionCount: 2
  },
  {
    id: "information-evidence-textual", 
    name: "Information & Ideas: Command of Evidence (Textual)",
    description: "Using textual evidence to support conclusions",
    icon: FileText,
    questionCount: 2
  },
  {
    id: "information-evidence-quantitative",
    name: "Information & Ideas: Command of Evidence (Quantitative)", 
    description: "Analyzing data and quantitative information",
    icon: BarChart,
    questionCount: 1
  },
  {
    id: "information-inferences",
    name: "Information & Ideas: Inferences",
    description: "Drawing logical conclusions from text",
    icon: Brain,
    questionCount: 2
  },
  {
    id: "expression-transitions",
    name: "Expression of Ideas: Transitions",
    description: "Logical flow and connections between ideas", 
    icon: ArrowRight,
    questionCount: 3
  },
  {
    id: "expression-synthesis",
    name: "Expression of Ideas: Rhetorical Synthesis",
    description: "Combining information for rhetorical purpose",
    icon: PenTool,
    questionCount: 2
  },
  {
    id: "conventions-boundaries",
    name: "Standard English Conventions: Boundaries",
    description: "Sentence boundaries and punctuation",
    icon: Minus,
    questionCount: 5
  },
  {
    id: "conventions-form",
    name: "Standard English Conventions: Form, Structure, and Sense",
    description: "Grammar, usage, and sentence structure",
    icon: CheckCircle,
    questionCount: 3
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
                : sectionType === "reading" && questionCount === 27
                ? "SAT Module Distribution (27 questions total)"
                : selectedDomains.length === 2
                ? `${Math.floor(questionCount/2)} questions from each domain`
                : `Approximately ${Math.floor(questionCount/selectedDomains.length)}–${Math.ceil(questionCount/selectedDomains.length)} questions per domain`
              }
            </p>
            {sectionType === "reading" && questionCount === 27 && selectedDomains.length > 1 && (
              <div className="mt-2 text-xs text-primary/80">
                {selectedDomains.map(domainId => {
                  const domain = domains.find(d => d.id === domainId);
                  return domain && (
                    <div key={domainId} className="flex justify-between">
                      <span>{domain.name.split(': ')[1] || domain.name}</span>
                      <span>{domain.questionCount} questions</span>
                    </div>
                  );
                })}
              </div>
            )}
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