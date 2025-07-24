import { Header } from "@/components/Header";
import { SectionCard } from "@/components/SectionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calculator, Target, Zap, Trophy, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header streak={5} totalScore={1250} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
              Master the Digital SAT
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 animate-slide-up" style={{animationDelay: '0.1s'}}>
              Adaptive practice that grows with you. Just like Duolingo, but for SAT prep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{animationDelay: '0.2s'}}>
              <Button 
                size="lg" 
                onClick={() => navigate('/sectional-practice')}
                className="bg-white text-primary hover:shadow-glow hover:scale-105 rounded-xl text-lg px-8 py-4"
              >
                Start Practicing Free
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary rounded-xl text-lg px-8 py-4"
              >
                Take Full Practice Test
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-3">
              <div className="rounded-2xl bg-gradient-primary p-4 w-16 h-16 mx-auto">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-muted-foreground">Students using our platform</div>
            </div>
            <div className="text-center space-y-3">
              <div className="rounded-2xl bg-gradient-secondary p-4 w-16 h-16 mx-auto">
                <Target className="h-8 w-8 text-secondary-foreground" />
              </div>
              <div className="text-3xl font-bold">150+</div>
              <div className="text-muted-foreground">Points average improvement</div>
            </div>
            <div className="text-center space-y-3">
              <div className="rounded-2xl bg-gradient-primary p-4 w-16 h-16 mx-auto">
                <Zap className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="text-3xl font-bold">2M+</div>
              <div className="text-muted-foreground">Practice questions completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Practice Sections */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your Practice Mode</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Target specific skills or take full section practice tests. Every question adapts to your level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            <SectionCard
              title="Reading & Writing"
              description="Master passages, grammar, and rhetorical analysis with targeted practice"
              icon={BookOpen}
              questionsCount={54}
              timeEstimate="32 min per module"
              difficulty="Medium"
              progress={65}
              onClick={() => navigate('/sectional-practice')}
            />
            <SectionCard
              title="Math"
              description="Algebra, geometry, and advanced math problems with step-by-step solutions"
              icon={Calculator}
              questionsCount={44}
              timeEstimate="35 min per module"
              difficulty="Hard"
              progress={45}
              onClick={() => navigate('/sectional-practice')}
            />
          </div>

          {/* Full Test Card */}
          <Card className="max-w-4xl mx-auto bg-gradient-card shadow-glow border-2 border-primary/20">
            <CardContent className="p-8 text-center space-y-6">
              <div className="rounded-2xl bg-gradient-primary p-4 w-16 h-16 mx-auto">
                <Trophy className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold">Full Practice Test</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Experience the complete Digital SAT with adaptive modules, real timing, and detailed score analysis
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Badge variant="outline">2 hours 14 minutes</Badge>
                <Badge variant="outline">98 questions</Badge>
                <Badge variant="outline">Adaptive difficulty</Badge>
                <Badge variant="outline">Detailed analytics</Badge>
              </div>
              <Button size="lg" className="rounded-xl" variant="secondary">
                Take Full Practice Test
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Students Love Us</h2>
            <p className="text-xl text-muted-foreground">
              Game-changing features that make SAT prep actually enjoyable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-gradient-card shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center space-y-4">
                <div className="rounded-xl bg-gradient-primary p-3 w-12 h-12 mx-auto">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Adaptive Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Questions get harder or easier based on your performance, just like the real Digital SAT
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center space-y-4">
                <div className="rounded-xl bg-gradient-secondary p-3 w-12 h-12 mx-auto">
                  <Target className="h-6 w-6 text-secondary-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Smart Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Track your progress across all skill areas with detailed performance breakdowns
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center space-y-4">
                <div className="rounded-xl bg-gradient-primary p-3 w-12 h-12 mx-auto">
                  <Trophy className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Gamified Experience</h3>
                <p className="text-sm text-muted-foreground">
                  Earn streaks, badges, and XP points as you practice. Learning has never been this fun!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl font-bold text-white">Ready to boost your SAT score?</h2>
            <p className="text-xl text-white/90">
              Join thousands of students who've improved their scores with our adaptive practice platform
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/sectional-practice')}
              className="bg-white text-primary hover:shadow-glow hover:scale-105 rounded-xl text-lg px-8 py-4"
            >
              Start Free Practice Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
