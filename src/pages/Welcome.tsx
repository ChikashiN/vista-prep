import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Trophy, Target, BookOpen, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export default function Welcome() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    try {
      const userData = JSON.parse(currentUser);
      setUser(userData);
    } catch (error) {
      localStorage.removeItem('currentUser');
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleGetStarted = () => {
    toast.success('Welcome to Infiniprep! Let\'s start your SAT journey.');
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mb-6">
            <Trophy className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl mb-2">
            Welcome, {user.name}! 🎉
          </CardTitle>
          <p className="text-lg text-muted-foreground">
            Your SAT preparation journey starts now
          </p>
          <Badge variant="secondary" className="mt-2">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Welcome Message */}
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              You're all set to begin your SAT preparation with Infiniprep. 
              We're excited to help you achieve your target score!
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-3 p-4 rounded-lg bg-blue-50">
              <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center mx-auto">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold">Adaptive Practice</h3>
              <p className="text-sm text-muted-foreground">
                Questions that adapt to your skill level
              </p>
            </div>
            
            <div className="text-center space-y-3 p-4 rounded-lg bg-green-50">
              <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center mx-auto">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold">5000+ Questions</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive question bank
              </p>
            </div>
            
            <div className="text-center space-y-3 p-4 rounded-lg bg-purple-50">
              <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold">AI Tutor</h3>
              <p className="text-sm text-muted-foreground">
                Get help when you need it
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button 
              onClick={handleGetStarted}
              className="w-full text-lg py-6"
              size="lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full"
            >
              Sign Out
            </Button>
          </div>

          {/* Quick Tips */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold">Quick Tips:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Start with the Daily Challenge to warm up</li>
              <li>• Use sectional practice to focus on weak areas</li>
              <li>• Take full tests to track your progress</li>
              <li>• Check your dashboard for detailed analytics</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 