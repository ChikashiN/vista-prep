import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Lightbulb, PenTool, Settings } from "lucide-react";
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
    id: "craft-structure",
    name: "Craft and Structure",
    description: "Author techniques, text structure, and rhetorical purpose",
    icon: BookOpen,
    questionCount: 14
  },
  {
    id: "information-ideas", 
    name: "Information and Ideas",
    description: "Main ideas, supporting details, and inferences",
    icon: Lightbulb,
    questionCount: 13
  },
  {
    id: "expression-ideas",
    name: "Expression of Ideas",
    description: "Rhetorical synthesis and editing for clarity",
    icon: PenTool,
    questionCount: 10
  },
  {
    id: "standard-conventions",
    name: "Standard English Conventions", 
    description: "Grammar, usage, and mechanics",
    icon: Settings,
    questionCount: 11
  }
];

interface DomainSelectorProps {
  selectedDomains: string[];
  onDomainsChange: (domains: string[]) => void;
}

export function DomainSelector({ selectedDomains, onDomainsChange }: DomainSelectorProps) {
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
        <h2 className="text-2xl font-bold">Customize Your Reading Practice</h2>
        <p className="text-muted-foreground">
          Select the SAT Reading & Writing content domains you want to practice
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {readingDomains.map((domain) => {
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
                  <Badge variant="outline" className="text-xs">
                    {domain.questionCount} Q's
                  </Badge>
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