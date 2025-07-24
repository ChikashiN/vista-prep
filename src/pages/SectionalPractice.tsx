import { useState } from "react";
import { Header } from "@/components/Header";
import { DomainSelector } from "@/components/DomainSelector";
import { QuestionSettings } from "@/components/QuestionSettings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";

type SectionType = "reading" | "math";

export default function SectionalPractice() {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<SectionType | null>(null);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard" | "Mixed">("Mixed");
  const [questionCount, setQuestionCount] = useState<5 | 10 | 20>(10);
  const [timedMode, setTimedMode] = useState(false);

  const handleStartPractice = () => {
    // Navigate to practice mode with settings
    navigate(`/practice/${selectedSection}`, {
      state: {
        domains: selectedDomains,
        difficulty,
        questionCount,
        timedMode
      }
    });
  };

  const handleBackToSections = () => {
    setSelectedSection(null);
    setSelectedDomains([]);
  };

  if (!selectedSection) {
    return (
      <div className="min-h-screen bg-background">
        <Header streak={5} totalScore={1250} />
        
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Sectional Practice
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Master the Digital SAT with targeted practice sessions. Choose your section and dive into authentic SAT questions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Reading & Writing Section */}
            <Card 
              className="group cursor-pointer bg-gradient-card border-0 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105"
              onClick={() => setSelectedSection("reading")}
            >
              <CardContent className="p-8 text-center space-y-6">
                <div className="rounded-2xl bg-gradient-primary p-4 w-16 h-16 mx-auto shadow-soft group-hover:animate-bounce-gentle">
                  <BookOpen className="h-8 w-8 text-primary-foreground" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold">Reading & Writing</h3>
                  <p className="text-muted-foreground">
                    Practice passages, grammar, and rhetorical skills
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="outline">64 Minutes</Badge>
                  <Badge variant="outline">2 Modules</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>✓ Craft & Structure</div>
                  <div>✓ Information & Ideas</div>
                  <div>✓ Expression of Ideas</div>
                  <div>✓ Standard Conventions</div>
                </div>

                <Button className="w-full rounded-xl" size="lg">
                  Start Reading Practice
                </Button>
              </CardContent>
            </Card>

            {/* Math Section */}
            <Card 
              className="group cursor-pointer bg-gradient-card border-0 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105"
              onClick={() => setSelectedSection("math")}
            >
              <CardContent className="p-8 text-center space-y-6">
                <div className="rounded-2xl bg-gradient-secondary p-4 w-16 h-16 mx-auto shadow-soft group-hover:animate-bounce-gentle">
                  <Calculator className="h-8 w-8 text-secondary-foreground" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold">Math</h3>
                  <p className="text-muted-foreground">
                    Algebra, geometry, and advanced math problems
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="outline">70 Minutes</Badge>
                  <Badge variant="outline">2 Modules</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>✓ Algebra (35%)</div>
                  <div>✓ Advanced Math (35%)</div>
                  <div>✓ Problem Solving (15%)</div>
                  <div>✓ Geometry & Trig (15%)</div>
                </div>

                <Button className="w-full rounded-xl" size="lg" variant="secondary">
                  Start Math Practice
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header streak={5} totalScore={1250} />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={handleBackToSections}
          className="mb-6 rounded-xl hover:shadow-soft"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sections
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Domain Selection */}
          <div className="space-y-6">
            <DomainSelector 
              selectedDomains={selectedDomains}
              onDomainsChange={setSelectedDomains}
              sectionType={selectedSection}
            />
          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            <QuestionSettings
              difficulty={difficulty}
              questionCount={questionCount}
              timedMode={timedMode}
              onDifficultyChange={setDifficulty}
              onQuestionCountChange={setQuestionCount}
              onTimedModeChange={setTimedMode}
              onStartPractice={handleStartPractice}
              disabled={selectedDomains.length === 0}
            />
          </div>
        </div>
      </main>
    </div>
  );
}