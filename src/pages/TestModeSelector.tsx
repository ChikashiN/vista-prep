import { Header } from "@/components/Header";
import { TestModeCard } from "@/components/TestModeCard";
import { Clock, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TestModeSelector() {
  const navigate = useNavigate();

  const handleFullTest = (mode: string) => {
    navigate('/full-test', {
      state: {
        mode,
        timedMode: true
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header streak={5} totalScore={1250} currentXP={250} level={3} />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Full Test Experience
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your test format and simulate real SAT conditions with adaptive testing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestModeCard
            title="🔄 Full SAT"
            description="Complete digital SAT with authentic timing and 10-minute break"
            duration="2h 14m"
            questionCount="98 Questions"
            icon={Zap}
            features={[
              "Reading & Writing + Math",
              "Adaptive 2-stage testing",
              "Complete Score Report",
              "10-minute Break"
            ]}
            onStart={() => handleFullTest("full-test")}
            variant="primary"
          />
          
          <TestModeCard
            title="📘 Reading & Writing Only"
            description="Focus on R&W section with 2 adaptive modules"
            duration="64 Minutes"
            questionCount="54 Questions"
            icon={Clock}
            features={[
              "Module 1: 32 minutes",
              "Module 2: 32 minutes (adaptive)",
              "Full section diagnostics",
              "Performance breakdown"
            ]}
            onStart={() => handleFullTest("full-reading")}
            variant="accent"
          />
          
          <TestModeCard
            title="🧮 Math Only"
            description="Complete Math section with built-in calculator"
            duration="70 Minutes"
            questionCount="44 Questions"
            icon={Target}
            features={[
              "Module 1: 35 minutes",
              "Module 2: 35 minutes (adaptive)",
              "Calculator available",
              "Grid-in questions included"
            ]}
            onStart={() => handleFullTest("full-math")}
            variant="accent"
          />
        </div>
      </main>
    </div>
  );
}