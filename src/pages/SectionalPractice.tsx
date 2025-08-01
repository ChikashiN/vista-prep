import { useState } from "react";
import { Header } from "@/components/Header";
import { DomainSelector } from "@/components/DomainSelector";
import { QuestionSettings } from "@/components/QuestionSettings";
import { TestModeCard } from "@/components/TestModeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Calculator, Clock, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

type SectionType = "reading" | "math";
type TestMode = "sectional" | "full-reading" | "full-math" | "full-test";

export default function SectionalPractice() {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<SectionType | null>(null);
  const [testMode, setTestMode] = useState<TestMode | null>(null);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard" | "Mixed">("Mixed");
  const [questionCount, setQuestionCount] = useState<5 | 10 | 20>(10);
  const [timedMode, setTimedMode] = useState(false);

  const handleStartPractice = () => {
    if (testMode === "sectional") {
      navigate(`/practice/${selectedSection}`, {
        state: {
          domains: selectedDomains,
          difficulty,
          questionCount,
          timedMode,
          mode: "sectional"
        }
      });
    } else {
      // Handle full test modes
      navigate(`/practice/full-test`, {
        state: {
          mode: testMode,
          timedMode: true // Full tests are always timed
        }
      });
    }
  };

  const handleBackToSections = () => {
    setSelectedSection(null);
    setTestMode(null);
    setSelectedDomains([]);
  };

  const handleSectionalPractice = (section: SectionType) => {
    setSelectedSection(section);
    setTestMode("sectional");
  };

  const handleFullTest = (mode: TestMode) => {
    setTestMode(mode);
    navigate(`/practice/full-test`, {
      state: {
        mode,
        timedMode: true
      }
    });
  };

  if (!selectedSection && !testMode) {
    return (
      <div className="min-h-screen bg-background">
        <Header streak={5} totalScore={1250} currentXP={250} level={3} />
        
        <main className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              SAT Practice Hub
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your practice mode: focused skill building or full test simulation
            </p>
          </div>

          {/* Quick Practice Section */}
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold">Quick Practice</h2>
              <p className="text-muted-foreground">Focus on specific skills with customizable practice sets</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TestModeCard
                title="Reading & Writing"
                description="Practice specific domains with custom settings"
                duration="Flexible"
                questionCount="5-20 Questions"
                icon={BookOpen}
                features={[
                  "Information and Ideas",
                  "Craft and Structure", 
                  "Expression of Ideas",
                  "Standard English Conventions"
                ]}
                onStart={() => handleSectionalPractice("reading")}
                variant="primary"
              />
              
              <TestModeCard
                title="Math"
                description="Target specific math concepts and skills"
                duration="Flexible"
                questionCount="5-20 Questions"
                icon={Calculator}
                features={[
                  "Algebra",
                  "Advanced Math",
                  "Problem-Solving & Data Analysis",
                  "Geometry & Trigonometry"
                ]}
                onStart={() => handleSectionalPractice("math")}
                variant="secondary"
              />
            </div>
          </div>

          {/* Quick Access to Full Test */}
          <div className="space-y-8 mt-16 text-center">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold">Ready for a Full Test?</h2>
              <p className="text-muted-foreground">Take a complete adaptive SAT experience</p>
            </div>
            
            <Button 
              onClick={() => navigate('/test')}
              variant="default"
              size="lg"
              className="rounded-xl bg-gradient-primary shadow-glow px-8 py-3"
            >
              🧪 Full Test Experience
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header streak={5} totalScore={1250} currentXP={250} level={3} />
      
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
              questionCount={questionCount}
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