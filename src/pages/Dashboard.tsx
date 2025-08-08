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
import { BookOpen, Calculator, Target, Users, Trophy, TrendingUp, Play, Zap, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTestData } from "@/hooks/useTestData";
import { toast } from "sonner";

export default function Dashboard() {
  const navigate = useNavigate();
  const [dailyChallengeCompleted, setDailyChallengeCompleted] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const { getUserData, getNextLevelXP, getRecentScores, getDomainAccuracy, addXP, addTestResult } = useTestData();
  
  // Check authentication
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/auth');
      return;
    }
    
    try {
      const userData = JSON.parse(user);
      
      // Verify user exists in users array and check payment status
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const verifiedUser = users.find((u: any) => u.id === userData.id);
      
      if (!verifiedUser) {
        // User not found in users array, clear and redirect to auth
        localStorage.removeItem('currentUser');
        navigate('/auth');
        return;
      }
      
      // Check if user has paid
      if (!verifiedUser.hasPaid) {
        // User hasn't paid, redirect to payment
        navigate('/payment');
        return;
      }
      
      setCurrentUser(verifiedUser);
      
      // Check if user just paid (hasPaid is true but no welcome shown yet)
      if (verifiedUser.hasPaid && !localStorage.getItem('welcomeShown')) {
        setShowWelcomeMessage(true);
        localStorage.setItem('welcomeShown', 'true');
        toast.success(`Welcome to Infiniprep, ${verifiedUser.name}! 🎉`);
      }
    } catch (error) {
      localStorage.removeItem('currentUser');
      navigate('/auth');
    }
  }, [navigate]);
  
  // Get real user data from the hook
  const userData = getUserData();
  const nextLevelXP = getNextLevelXP();
  const recentActivity = getRecentScores(3);
  const domainStats = getDomainAccuracy();

  const leaderboard = [
    { rank: 1, name: "MathWhiz2024", xp: 2450 },
    { rank: 2, name: "ReadingPro", xp: 2210 },
    { rank: 3, name: "SATMaster", xp: 1890 },
    { rank: 4, name: "StudyBeast", xp: 1650 },
    { rank: 5, name: `${userData.name} (You)`, xp: userData.totalXP }
  ];

  const xpProgress = (userData.currentXP / 500) * 100; // 500 XP per level

  return (
    <div className="min-h-screen bg-background">
      <Header 
        streak={userData.streak} 
        totalScore={userData.totalXP} 
        currentXP={userData.currentXP} 
        level={userData.level} 
      />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Banner for New Users */}
        {showWelcomeMessage && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-800">
                    Welcome to Infiniprep! 🎉
                  </h3>
                  <p className="text-green-700">
                    You now have lifetime access to all features. Start your SAT prep journey today!
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowWelcomeMessage(false)}
                >
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Welcome Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">
            Hi, <span className="bg-gradient-hero bg-clip-text text-transparent">{currentUser?.name || userData.name}</span>! 👋
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
                    {userData.totalXP} XP
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to Level {userData.level + 1}</span>
                    <span>{userData.currentXP}/500 XP</span>
                  </div>
                  <Progress value={xpProgress} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    {500 - userData.currentXP} XP until next level!
                  </p>
                  {/* Test buttons - remove these after testing */}
                  <div className="space-y-2 mt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => addXP(100)}
                      className="w-full"
                    >
                      Test: Add 100 XP
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        // Simulate completing a practice session
                        addTestResult({
                          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
                          type: 'sectional',
                          section: 'reading',
                          domain: 'information-ideas',
                          totalQuestions: 10,
                          correctAnswers: 8,
                          timeSpent: 600
                        });
                      }}
                      className="w-full"
                    >
                      Test: Complete Practice (8/10)
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        // Simulate completing a full test
                        addTestResult({
                          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
                          type: 'full',
                          section: 'both',
                          totalQuestions: 54,
                          correctAnswers: 45,
                          timeSpent: 7200
                        });
                      }}
                      className="w-full"
                    >
                      Test: Complete Full Test (45/54)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              <Card className="hover:shadow-soft transition-all cursor-pointer group" onClick={() => navigate('/diagnostics')}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                      <Target className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">View Diagnostics</h3>
                      <p className="text-sm text-muted-foreground">Track your progress</p>
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
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                            <BookOpen className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">Full SAT Test</p>
                            <p className="text-sm text-muted-foreground">{activity.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{activity.totalScore}</p>
                          <p className="text-sm text-muted-foreground">Total Score</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No recent activity yet</p>
                      <p className="text-sm">Start practicing to see your progress!</p>
                    </div>
                  )}
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
                  {domainStats.length > 0 ? (
                    domainStats.slice(0, 4).map((stat, index) => (
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
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>Complete practice sessions to see domain accuracy</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Performance Dashboard */}
            <PerformanceDashboard />
          </div>

          {/* Sidebar - Right column */}
          <div className="space-y-6">
            {/* Daily Challenge */}
            <DailyChallenge 
              isCompleted={dailyChallengeCompleted} 
              onStart={() => setDailyChallengeCompleted(true)} 
            />

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
                  <div className="text-2xl font-bold text-secondary">{userData.totalXP}</div>
                  <div className="text-sm text-muted-foreground">Total XP Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{userData.badge}</div>
                  <div className="text-sm text-muted-foreground">Current Badge</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}