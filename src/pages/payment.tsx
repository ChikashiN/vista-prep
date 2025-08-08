import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown, Shield, Users, Target, BookOpen, Calculator, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PLANS } from '@/lib/stripe';
import { toast } from 'sonner';

interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
  paymentLink: string;
}

export default function Payment() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Check if user is logged in
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
      
      setCurrentUser(verifiedUser);
      
      // If user has already paid, redirect to dashboard
      if (verifiedUser.hasPaid) {
        navigate('/dashboard');
      }
    } catch (error) {
      navigate('/auth');
    }
  }, [navigate]);

  const pricingTiers: PricingTier[] = [
    {
      id: 'lifetime',
      name: PLANS.BASIC.name,
      price: PLANS.BASIC.price,
      period: 'one-time',
      description: 'Lifetime access to all Infiniprep features',
      icon: <Crown className="h-6 w-6" />,
      color: 'bg-yellow-500',
      popular: true,
      paymentLink: PLANS.BASIC.paymentLink,
      features: PLANS.BASIC.features
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;
    
    setLoading(true);
    
    try {
      const selectedTier = pricingTiers.find(t => t.id === selectedPlan);
      if (selectedTier) {
        // Redirect to Stripe payment link
        window.open(selectedTier.paymentLink, '_blank');
        
        // Simulate payment success (in real app, you'd handle webhook)
        setTimeout(() => {
          // Update user payment status
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const updatedUsers = users.map((user: any) => {
            if (user.id === currentUser.id) {
              return { ...user, hasPaid: true };
            }
            return user;
          });
          localStorage.setItem('users', JSON.stringify(updatedUsers));
          
          // Update current user
          const updatedUser = { ...currentUser, hasPaid: true };
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          
          setLoading(false);
          toast.success('Payment successful! Welcome to Infiniprep!');
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setLoading(false);
      toast.error('We are sorry!Payment failed. Please try again.');
    }
  };

  if (!currentUser) {
    return null; // Loading state
  }

  return (
    <div className="min-h-screen bg-background">
      <Header streak={0} totalScore={0} currentXP={0} level={1} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Welcome, {currentUser.name}! 👋
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete your payment to unlock lifetime access to all Infiniprep features. 
            No monthly fees, no recurring charges.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="flex justify-center mb-12">
          <Card className="relative transition-all duration-300 hover:shadow-lg max-w-md w-full">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
              Best Value
            </Badge>
            
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-500 flex items-center justify-center mx-auto mb-4">
                <Crown className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl">{pricingTiers[0].name}</CardTitle>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold">{pricingTiers[0].price}</span>
                <span className="text-muted-foreground">/{pricingTiers[0].period}</span>
              </div>
              <p className="text-sm text-muted-foreground">{pricingTiers[0].description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {pricingTiers[0].features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => handlePlanSelect('lifetime')}
              >
                {selectedPlan === 'lifetime' ? 'Selected' : 'Get Lifetime Access'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Payment Section */}
        {selectedPlan && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Complete Your Purchase</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <span className="font-medium">Selected Plan:</span>
                <span className="font-bold">
                  {pricingTiers[0].name} - {pricingTiers[0].price}
                </span>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Processing Payment...' : 'Pay with Stripe'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedPlan(null)}
                  className="w-full"
                >
                  Change Plan
                </Button>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                <Shield className="h-4 w-4 inline mr-1" />
                Secure payment powered by Stripe
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Comparison */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Infiniprep?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto">
                <Brain className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold">Adaptive Learning</h3>
              <p className="text-sm text-muted-foreground">Questions adapt to your skill level</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto">
                <Target className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-semibold">Targeted Practice</h3>
              <p className="text-sm text-muted-foreground">Focus on your weakest areas</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto">
                <BookOpen className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="font-semibold">Comprehensive Content</h3>
              <p className="text-sm text-muted-foreground">5000+ high-quality questions</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center mx-auto">
                <Users className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="font-semibold">Expert Support</h3>
              <p className="text-sm text-muted-foreground">Get help when you need it</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What does lifetime access include?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Lifetime access includes unlimited access to all practice questions, full practice tests, progress tracking, and all future updates to the platform.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is this a one-time payment?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Yes! This is a one-time payment of $22.99. No monthly fees, no recurring charges, no hidden costs. We also offer a 48 hour free trial!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
