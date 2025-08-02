import { Header } from "@/components/Header";
import { SectionCard } from "@/components/SectionCard";
import { DailyChallenge } from "@/components/DailyChallenge";
import { XPTracker } from "@/components/XPTracker";
import { TestModeCard } from "@/components/TestModeCard";
import { PerformanceDashboard } from "@/components/PerformanceDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Calculator, Target, Users, Trophy, TrendingUp, Play, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Mock user data
  const userData = {
    name: "Alex",
    level: 5,
    currentXP: 1250,
    nextLevelXP: 1500,
    totalXP: 1250,
    streak: 7,
    badge: "SAT Warrior"
  };

  const recentActivity = [
    { section: "Reading & Writing", score: "18/27", accuracy: 67, date: "Today" },
    { section: "Math", score: "16/22", accuracy: 73, date: "Yesterday" },
    { section: "Reading & Writing", score: "22/27", accuracy: 81, date: "2 days ago" }
  ];

  const domainStats = [
    { domain: "Craft & Structure", accuracy: 78, improvement: "+5%" },
    { domain: "Information & Ideas", accuracy: 85, improvement: "+2%" },
    { domain: "Algebra", accuracy: 72, improvement: "+8%" },
    { domain: "Advanced Math", accuracy: 69, improvement: "+3%" }
  ];

  const leaderboard = [
    { rank: 1, name: "MathWhiz2024", xp: 2450 },
    { rank: 2, name: "ReadingPro", xp: 2210 },
    { rank: 3, name: "SATMaster", xp: 1890 },
    { rank: 4, name: "StudyBeast", xp: 1650 },
    { rank: 5, name: "Alex (You)", xp: 1250 }
  ];

  const xpProgress = (userData.currentXP / userData.nextLevelXP) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Header 
        streak={userData.streak} 
        totalScore={userData.totalXP} 
        currentXP={userData.currentXP} 
        level={userData.level} 
      />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">
            Hi, <span className="bg-gradient-hero bg-clip-text text-transparent">{userData.name}</span>! 👋
          </h1>
          <p className="text-lg text-muted-foreground">Ready to conquer the SAT today?</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* XP Level System */}
            <Card className="border-primary/20 shadow-glow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Level {userData.level}</CardTitle>
                      <p className="text-sm text-muted-foreground">{userData.badge}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {userData.currentXP} XP
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to Level {userData.level + 1}</span>
                    <span>{userData.currentXP}/{userData.nextLevelXP} XP</span>
                  </div>
                  <Progress value={xpProgress} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    {userData.nextLevelXP - userData.currentXP} XP until next level!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-soft transition-all cursor-pointer group" onClick={() => navigate('/practice')}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Go to Practice</h3>
                      <p className="text-sm text-muted-foreground">Target specific skills</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-soft transition-all cursor-pointer group" onClick={() => navigate('/test')}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                      <Zap className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Take Full Test</h3>
                      <p className="text-sm text-muted-foreground">Full SAT simulation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Practice History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          activity.section.includes('Reading') ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {activity.section.includes('Reading') ? <BookOpen className="h-4 w-4" /> : <Calculator className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium">{activity.section}</p>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{activity.score}</p>
                        <p className="text-sm text-muted-foreground">{activity.accuracy}% correct</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/practice')}>
                  <Play className="h-4 w-4 mr-2" />
                  Resume Last Activity
                </Button>
              </CardContent>
            </Card>

            {/* Domain Accuracy */}
            <Card>
              <CardHeader>
                <CardTitle>Accuracy by Domain</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {domainStats.map((stat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{stat.domain}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-green-600">{stat.improvement}</span>
                          <span className="font-medium">{stat.accuracy}%</span>
                        </div>
                      </div>
                      <Progress value={stat.accuracy} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Dashboard */}
            <PerformanceDashboard />
          </div>

          {/* Sidebar - Right column */}
          <div className="space-y-6">
            {/* Daily Challenge */}
            <DailyChallenge isCompleted={false} onStart={() => navigate('/practice')} />

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((user, index) => (
                    <div key={index} className={`flex items-center justify-between p-2 rounded-lg ${
                      user.name.includes('You') ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          user.rank <= 3 ? 'bg-yellow-500 text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                          {user.rank}
                        </div>
                        <span className={`font-medium ${user.name.includes('You') ? 'text-primary' : ''}`}>
                          {user.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{user.xp} XP</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View Full Leaderboard
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{userData.streak}</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">87</div>
                  <div className="text-sm text-muted-foreground">Questions Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">76%</div>
                  <div className="text-sm text-muted-foreground">Overall Accuracy</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}